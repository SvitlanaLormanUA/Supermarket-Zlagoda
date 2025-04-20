import sqlite3

conn = sqlite3.connect('supermarket.db')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS category (
    category_number INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS product (
    id_product INTEGER PRIMARY KEY,
    category_number INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    characteristics TEXT NOT NULL,
    FOREIGN KEY (category_number) REFERENCES category(category_number) ON UPDATE CASCADE ON DELETE NO ACTION
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS store_product (
    UPC TEXT PRIMARY KEY,
    UPC_prom TEXT,
    id_product INTEGER NOT NULL,
    selling_price REAL NOT NULL,
    products_number INTEGER NOT NULL,
    promotional_product BOOLEAN NOT NULL,
    FOREIGN KEY (UPC_prom) REFERENCES store_product(UPC) ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (id_product) REFERENCES product(id_product) ON UPDATE CASCADE ON DELETE NO ACTION
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS employee (
    id_employee TEXT PRIMARY KEY,
    empl_surname TEXT NOT NULL,
    empl_name TEXT NOT NULL,
    empl_patronymic TEXT,
    empl_role TEXT NOT NULL,
    salary REAL NOT NULL,
    date_of_birth TEXT NOT NULL,
    date_of_start TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    city TEXT NOT NULL,
    street TEXT NOT NULL,
    zip_code TEXT NOT NULL
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS customer_card (
    card_number TEXT PRIMARY KEY,
    cust_surname TEXT NOT NULL,
    cust_name TEXT NOT NULL,
    cust_patronymic TEXT,
    phone_number TEXT NOT NULL,
    city TEXT NOT NULL,
    street TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    percent INTEGER NOT NULL
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS receipt (
    check_number TEXT PRIMARY KEY,
    id_employee TEXT NOT NULL,
    card_number TEXT,
    print_date TEXT NOT NULL,
    sum_total REAL NOT NULL,
    vat REAL NOT NULL,
    FOREIGN KEY (id_employee) REFERENCES employee(id_employee) ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (card_number) REFERENCES customer_card(card_number) ON UPDATE CASCADE ON DELETE NO ACTION
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS sale (
    UPC TEXT NOT NULL,
    check_number TEXT NOT NULL,
    product_number INTEGER NOT NULL,
    selling_price REAL NOT NULL,
    PRIMARY KEY (UPC, check_number),
    FOREIGN KEY (UPC) REFERENCES store_product(UPC) ON UPDATE CASCADE ON DELETE NO ACTION,
    FOREIGN KEY (check_number) REFERENCES receipt(check_number) ON UPDATE CASCADE ON DELETE CASCADE
)
''')
cursor.execute('''
CREATE TABLE IF NOT EXISTS account (
    account_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, 
    is_active BOOLEAN DEFAULT 1,
    last_login TIMESTAMP,
    failed_attempts INTEGER DEFAULT 0,
    account_locked BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (employee_id) REFERENCES employee(id_employee) ON DELETE CASCADE
)
''')

# для швидкого пошуку за email
cursor.execute('CREATE INDEX IF NOT EXISTS idx_account_email ON account(email)')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS token_blacklist (
        token TEXT PRIMARY KEY,
        expires_at DATETIME NOT NULL
);
''')
conn.commit()
conn.close()

print("База даних створена успішно!")
