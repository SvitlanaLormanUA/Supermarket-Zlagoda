import os
from robyn.authentication import AuthenticationHandler, BearerGetter, Identity
from robyn import Request, jsonify
import sqlite3
from typing import Optional
from auth.crud import decode_access_token, get_user_by_email, decode_access_token
from dotenv import load_dotenv
from jose import JWTError, jwt

load_dotenv()
DB_LINK = os.getenv("DB_LINK")

def get_db_connection():
    return sqlite3.connect(DB_LINK)
class RoleBasedAuthHandler(AuthenticationHandler):
     def __init__(self, token_getter):
        super().__init__(token_getter)
        self.secret_key = os.getenv("SECRET_KEY") 
        self.algorithm = "HS256"
        print(f"Loaded SECRET_KEY: {self.secret_key}") 

     def authenticate(self, request: Request) -> Optional[Identity]:
        token = self.token_getter.get_token(request)
        print(f"Extracted token: {token}")
        if not token:
            return None

        try:
            payload = decode_access_token(token)
            useremail = payload["sub"]

            user = get_user_by_email(useremail)
            print(f"Decoded payload: {payload}")
            return Identity(claims={"user": f"{ user.role }"})
        except JWTError as e:  
            print(f"Token validation failed: {e}")
            return None


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
