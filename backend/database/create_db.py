import sqlite3

conn = sqlite3.connect('supermarket.db')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    producer TEXT,
    characteristics TEXT,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES categories(id)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS store_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    discount REAL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS receipts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT NOT NULL,
    date TEXT NOT NULL,
    total_sum REAL NOT NULL
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS contains (
    receipt_id INTEGER,
    store_product_id INTEGER,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (receipt_id) REFERENCES receipts(id),
    FOREIGN KEY (store_product_id) REFERENCES store_products(id),
    PRIMARY KEY (receipt_id, store_product_id)
)
''')


cursor.execute('''
CREATE TABLE IF NOT EXISTS client_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    city TEXT,
    discount REAL DEFAULT 0
)
''')


cursor.execute('''
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    position TEXT NOT NULL,
    salary REAL NOT NULL,
    start_date TEXT NOT NULL,
    contact_info TEXT,
    address TEXT,
    city TEXT
)
''')

conn.commit()
conn.close()

print("База даних створена успішно!")
