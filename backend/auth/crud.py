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

# Security configurations
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"
SECRET_KEY = "your-secret-key-here"  # Change this in production!
ACCESS_TOKEN_EXPIRE_MINUTES = 30


@dataclass
class User:
    account_id: int
    employee_id: str
    email: str
    password_hash: str
    is_active: bool

def get_db_connection():
    """Create and return a new database connection."""
    return sqlite3.connect(DB_LINK)

def get_password_hash(password: str) -> str:
    """Hash a password for storing."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a stored password against one provided by user."""
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
    """Get a user by email."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM account WHERE email = ?", (email,))
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

def create_user(employee_id: str, email: str, password: str) -> User:
    """Create account only for verified employees"""
    hashed_password = get_password_hash(password)
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            # Verify employee_id exists
            cursor.execute('SELECT 1 FROM employee WHERE id_employee = ?', (employee_id,))
            if not cursor.fetchone():
                raise ValueError("Invalid employee ID")

            # Create account
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
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT token."""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None

def authenticate_user(email: str, password: str) -> Optional[str]:
    """Authenticate user and return JWT token if successful."""
    user = get_user_by_email(email)
    if not user or not user.is_active:
        return None
    
    if not verify_password(password, user.password_hash):
        return None
        
    return create_access_token(
        data={
            "sub": user.email,
            "employee_id": user.employee_id,
            "account_id": user.account_id
        }
    )
def get_employee_id(surname: str, name: str, patronymic: str, role: str) -> Optional[str]:
    """Get employee ID from HR records"""
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