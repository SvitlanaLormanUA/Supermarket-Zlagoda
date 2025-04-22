from passlib.context import CryptContext
import sqlite3
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from datetime import datetime, timedelta
from dataclasses import dataclass
import os
from dotenv import load_dotenv

load_dotenv()
DB_LINK = os.getenv("DB_LINK")


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = os.getenv("ALGORITHM")
SECRET_KEY = os.getenv("SECRET_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES = 2880  # 48 годин


@dataclass
class User:
    account_id: int
    employee_id: str
    email: str
    password_hash: str
    role: str
    is_active: bool

def get_db_connection():
    return sqlite3.connect(DB_LINK)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_user(user_id: int) -> Optional[User]:
    """Get a user by ID."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM account WHERE account_id = ?", (user_id,))
        row = cursor.fetchone()
        if row:
            return User(
                account_id=row[0],
                employee_id=row[1],
                email=row[2],
                password_hash=row[3],
                is_active=bool(row[5])
            )
    return None

def get_user_by_email(email: str) -> Optional[User]:
    """Get a user by email with employee role."""
    with get_db_connection() as conn:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                a.account_id, 
                a.employee_id, 
                a.email, 
                a.password_hash, 
                a.is_active,
                e.empl_role 
            FROM account a
            JOIN employee e ON a.employee_id = e.id_employee  -- JOIN з employee
            WHERE a.email = ?
        """, (email,))
        
        row = cursor.fetchone()
        if row:
            return User(
                account_id=row[0],
                employee_id=row[1],
                email=row[2],
                password_hash=row[3],
                is_active=bool(row[4]),
                role=row[5]  
            )
    return None
def create_user(employee_id: str, email: str, password: str) -> User:
    """Create account only for verified employees"""
    hashed_password = get_password_hash(password)
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            # спочатку перевіряємо по employee_id чи існує такий працівник
            cursor.execute('SELECT 1 FROM employee WHERE id_employee = ?', (employee_id,))
            if not cursor.fetchone():
                raise ValueError("Invalid employee ID")

            # потім створюємо акаунт
            cursor.execute('''
                INSERT INTO account (employee_id, email, password_hash, is_active)
                VALUES (?, ?, ?, 1)
            ''', (employee_id, email, hashed_password))
            
            conn.commit()
            
            return User(
                account_id=cursor.lastrowid,
                employee_id=employee_id,
                email=email,
                password_hash=hashed_password,
                is_active=True
            )
            
        except sqlite3.IntegrityError as e:
            if "UNIQUE" in str(e):
                raise ValueError("Email already registered")
            raise ValueError(f"Database error: {str(e)}")
def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        return None
    except JWTError as e:
        print(f"Invalid token: {e}")
        return None

def authenticate_user(email: str, password: str) -> Optional[str]:
    user = get_user_by_email(email)
    if not user or not user.is_active:
        return None
    
    if not verify_password(password, user.password_hash):
        return None
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT empl_role FROM employee WHERE id_employee = ?', (user.employee_id,))
        role = cursor.fetchone()[0]  
    
    return create_access_token({
        "sub": user.email,
        "employee_id": user.employee_id,
        "account_id": user.account_id,
        "role": role  
    })
def get_employee_id(surname: str, name: str, patronymic: str, role: str) -> Optional[str]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id_employee FROM employee
            WHERE empl_surname = ?
            AND empl_name = ?
            AND empl_patronymic = ?
            AND empl_role = ?
        ''', (surname, name, patronymic, role))
        
        result = cursor.fetchone()
        return result[0] if result else None
    
def blacklist_token(token: str):
    """When the token is blacklisted, clean expired ones too"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            # спочатку очищаємо всі прострочені токени
            cursor.execute(
                "DELETE FROM token_blacklist WHERE expires_at < datetime('now')"
            )
            
            # потім додаємо новий токен до blacklist
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            exp_time = datetime.fromtimestamp(payload["exp"])
            
            cursor.execute(
                "INSERT INTO token_blacklist (token, expires_at) VALUES (?, ?)",
                (token, exp_time)
            )
            conn.commit()
        except JWTError:
            pass
