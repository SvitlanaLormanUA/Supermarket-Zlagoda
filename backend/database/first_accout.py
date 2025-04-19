import sqlite3
import bcrypt
from datetime import datetime

conn = sqlite3.connect('supermarket.db')
cursor = conn.cursor()

def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed, salt

accounts_data = [
    # Менеджер 
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

    {
        'employee_id': 'E001',
        'email': 'olexandr.shevchenko@zl.com',
        'password': 'CashierPass456!',
        'is_active': 1
    },

    {
        'employee_id': 'E003',
        'email': 'koval.iruna@zl.com',
        'password': 'KovalPass789!',
        'is_active': 1
    }
]

for account in accounts_data:
    password_hash, salt = hash_password(account['password'])
    cursor.execute('''
    INSERT OR IGNORE INTO accounts (
        employee_id,
        email,
        password_hash,
        salt,
        is_active,
        last_login
    ) VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        account['employee_id'],
        account['email'],
        password_hash,
        salt,
        account['is_active'],
        datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    ))

# для перевірки
cursor.execute("SELECT * FROM accounts")
print("Додані акаунти:")
for row in cursor.fetchall():
    print(row)

conn.commit()
conn.close()