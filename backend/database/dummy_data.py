import sqlite3

conn = sqlite3.connect('supermarket.db')
cursor = conn.cursor()

cursor.execute('''
INSERT INTO categories (name) VALUES
    ('Fruits'),
    ('Vegetables'),
    ('Dairy'),
    ('Bakery')
''')

cursor.execute('''
INSERT INTO products (name, producer, characteristics, category_id) VALUES
    ('Apple', 'FreshFruits Inc.', 'Sweet and juicy', 1),
    ('Banana', 'Tropical Fruits Ltd.', 'Rich in potassium', 1),
    ('Carrot', 'Healthy Veggies', 'Fresh and crunchy', 2),
    ('Milk', 'DairyFarm', '1 liter, 2.5% fat', 3),
    ('Bread', 'BakeryHouse', 'Whole grain', 4)
''')

cursor.execute('''
INSERT INTO store_products (product_id, price, quantity, discount) VALUES
    (1, 1.50, 100, 0),
    (2, 0.80, 200, 5),
    (3, 0.50, 150, 0),
    (4, 1.20, 50, 10),
    (5, 2.00, 80, 0)
''')


cursor.execute('''
INSERT INTO client_cards (number, first_name, last_name, phone, address, city, discount) VALUES
    ('1234567890', 'John', 'Doe', '+123456789', '123 Main St', 'New York', 5),
    ('0987654321', 'Jane', 'Smith', '+987654321', '456 Elm St', 'Los Angeles', 10)
''')

cursor.execute('''
INSERT INTO employees (first_name, last_name, position, salary, start_date, contact_info, address, city) VALUES
    ('Alice', 'Johnson', 'Manager', 3000.00, '2020-01-15', '+111222333', '789 Oak St', 'Chicago'),
    ('Bob', 'Williams', 'Cashier', 2000.00, '2021-05-20', '+444555666', '321 Pine St', 'Houston')
''')

conn.commit()
conn.close()

print("Тестові дані успішно додані!")