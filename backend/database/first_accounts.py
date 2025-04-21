import sqlite3
import bcrypt
from datetime import datetime

def hash_password(password: str) -> str:
    """Hash password using bcrypt and return string hash"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

conn = sqlite3.connect('supermarket.db')
cursor = conn.cursor()

accounts_data = [
    # Manager accounts
    {
        'employee_id': 'E002',
        'email': 'svlormanua@gmail.com',
        'password': 'ManagerPass123!',
        'is_active': 1
    },
    {
        'employee_id': 'E004',
        'email': 'gaponenko08@ukr.net',
        'password': 'ManagerPass123!',
        'is_active': 1
    },
    # Cashier accounts
    {
        'employee_id': 'E001',
        'email': 'olexandr.shevchenko@zl.com',
        'password': 'CashierPass456!',
        'is_active': 1
    },
    # ,
    # на ньому тестую
    {
        'employee_id': 'E003',
        'email': 'koval.iruna@zl.com',
        'password': 'KovalPass789!',
        'is_active': 1
    }
]

for account in accounts_data:
    try:
        password_hash = hash_password(account['password'])
        cursor.execute('''
        INSERT OR IGNORE INTO account (
            employee_id,
            email,
            password_hash,
            is_active,
            last_login
        ) VALUES (?, ?, ?, ?, ?)
        ''', (
            account['employee_id'],
            account['email'],
            password_hash,
            account['is_active'],
            datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ))
        print(f"Added account for {account['email']}")
    except sqlite3.IntegrityError as e:
        print(f"Skipped duplicate: {account['email']} ({str(e)})")

conn.commit()

# Verify insertion
print("\nAdded accounts:")
cursor.execute("SELECT employee_id, email, is_active FROM account")
for row in cursor.fetchall():
    print(f"ID: {row[0]}, Email: {row[1]}, Active: {bool(row[2])}")

conn.close()