import os
from robyn.authentication import AuthenticationHandler, BearerGetter, Identity
from robyn import Request
import sqlite3
from typing import Optional
from auth.crud import decode_access_token, get_user_by_email
from dotenv import load_dotenv

load_dotenv()
DB_LINK = os.getenv("DB_LINK")

def get_db_connection():
    return sqlite3.connect(DB_LINK)

class RoleBasedAuthHandler(AuthenticationHandler):
    def __init__(self, token_getter):
        super().__init__(token_getter)
        self.secret_key = os.getenv("SECRET_KEY", "your-secret-key-here")
    
    def authenticate(self, request: Request) -> Optional[Identity]:
        token = self.token_getter.get_token(request)
        if not token:
            return None

        try:
            payload = jwt.decode(
                token, 
                self.secret_key, 
                algorithms=["HS256"]
            )
            if not payload:
                return None
                
            # Direct database check instead of separate function
            with get_db_connection() as conn:
                cursor = conn.cursor()
                
                # Get user
                cursor.execute('''
                    SELECT account_id, employee_id, email, password_hash, is_active
                    FROM account
                    WHERE email = ?
                ''', (payload.get("sub"),))
                user = cursor.fetchone()
                
                if not user or not user[4]:  # is_active check
                    return None
                
                # Get role
                cursor.execute('''
                    SELECT empl_role FROM employee 
                    WHERE id_employee = ?
                ''', (user[1],))  # employee_id from account
                role_result = cursor.fetchone()
            
            return Identity(claims={
                "email": user[2],
                "role": role_result[0] if role_result else None,
                "employee_id": user[1],
                "account_id": user[0]
            })
            
        except Exception as e:
            print(f"Auth error: {repr(e)}")
            return None
        
        
def auth_required(roles: list[str] = None):
    def decorator(handler):
        async def wrapper(request: Request):
            if not request.identity:
                return {
                    "status_code": "401",
                    "body": {"detail": "Not authenticated"},
                    "headers": {"WWW-Authenticate": "Bearer"}
                }
            
            if roles and request.identity.claims.get("role") not in roles:
                return {
                    "status_code": "403",
                    "body": {"detail": "Insufficient permissions"},
                }
            
            return await handler(request)
        return wrapper
    return decorator