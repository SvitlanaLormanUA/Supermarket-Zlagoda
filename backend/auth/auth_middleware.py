import os
from robyn.authentication import AuthenticationHandler, Identity
from robyn import Request
from typing import Optional
from auth.crud import decode_access_token, get_user_by_email, decode_access_token, get_db_connection
from dotenv import load_dotenv
from jose import JWTError
from models.get import get_employee_info_by_id

load_dotenv()
DB_LINK = os.getenv("DB_LINK")

class RoleBasedAuthHandler(AuthenticationHandler):
     def __init__(self, token_getter):
        super().__init__(token_getter)
        self.secret_key = os.getenv("SECRET_KEY") 
        self.algorithm = os.getenv("ALGORITHM")
        print(f"Loaded SECRET_KEY: {self.secret_key}") 

     def authenticate(self, request: Request) -> Optional[Identity]:
        token = self.token_getter.get_token(request)

        if not token or is_token_blacklisted(token):
            return None

        try:
            payload = decode_access_token(token)
            if payload is None:
                return None
            useremail = payload["sub"]

            user = get_user_by_email(useremail)
            print(f"Decoded payload: {payload}")

            #employee = get_employee_info_by_id(user.employee_id)
            return Identity(claims={
                "user": f"{ user.role }",
                 "userId": f"{ user.employee_id }"
                                    })
        except JWTError as e:  
            print(f"Token validation failed: {e}")
            return None

def is_token_blacklisted(token: str) -> bool:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT 1 FROM token_blacklist WHERE token = ? AND expires_at > datetime('now')",
            (token,)
        )
        return cursor.fetchone() is not None
    
def roles_required(roles: list[str]):
    def decorator(handler):
        async def wrapper(request: Request):
            user = request.identity.claims.get("user")
            print(user)
            if user not in roles:
                return {
                    "status_code": 403,
                    "body": {"detail": f"Role '{user}' lacks permissions"}
                }
            return await handler(request)
        return wrapper
    return decorator
