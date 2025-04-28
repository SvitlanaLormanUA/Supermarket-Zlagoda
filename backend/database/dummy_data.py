import sqlite3

conn = sqlite3.connect('supermarket.db')
cursor = conn.cursor()

cursor.execute('''
INSERT INTO category (category_name)
VALUES
('diary'),
('fruit'),
('vegetables'),
('beverages')
''')

cursor.execute('''
INSERT INTO Product (category_number, product_name, characteristics) VALUES 
 (1, 'cream', 'a dairy product made from the high-fat layer skimmed from the top of milk'), 
 (1, 'yougurt','a dairy product made by bacterial fermentation of milk'),
   
 (2, 'apple', 'a round fruit with red or green skin and sweet flesh'),
 (2, 'banana', 'a long, curved fruit with a yellow skin and soft, sweet flesh'),
 (2, 'orange', 'a sweet fruit with a orange skin'),
 
 (3, 'carrot', 'a root vegetable, typically orange in color'),
 (3, 'broccoli', 'a green vegetable with a thick stalk and tight green flower buds'),

 (4, 'soda', 'a carbonated soft drink'),
 (4, 'juice', 'a drink made from the extraction of fruits')

''')


cursor.execute('''
INSERT INTO store_product (
    UPC, 
    UPC_prom, 
    id_product, 
    selling_price, 
    products_number, 
    promotional_product   
) 
    VALUES 
    ('123456789012', NULL, 1, 2.99, 100, FALSE), 
    ('234567890123', '123456789012', 2, 5.49, 50, TRUE),
    ('345678901234', '123456789012', 4, 3.99, 20, TRUE),
    ('456789012345', '234567890123', 5, 4.79, 25, TRUE),
    ('567890123456', NULL, 8, 2.99, 100, FALSE), 
    ('678901234567', NULL, 9, 2.49, 50, FALSE)
''')

cursor.execute('''
INSERT INTO Employee (
    id_employee, 
    empl_surname, 
    empl_name, 
    empl_patronymic, 
    empl_role, 
    salary, 
    date_of_birth, 
    date_of_start, 
    phone_number, 
    city, 
    street, 
    zip_code
) 
VALUES 
                ('E001', 'Shevchenko', 'Oleksandr', 'Ivanovych', 'Cashier', 20000.00, '1985-02-15', '2010-05-01', '380671234567', 'Kyiv', 'Khreshchatyk St', '01001'),
                ('E002', 'Lorman', 'Svitlana', 'Oleksandrivna', 'Manager', 28000.00, '1990-08-20', '2015-03-12', '380502395078', 'Lviv', 'Hrushevskoho St', '79000'),
                ('E003', 'Koval', 'Iryna', 'Andriivna', 'Cashier', 20000.00, '1988-11-10', '2012-07-25', '380633053489', 'Odesa', 'Deribasivska St', '65000'),
                ('E004', 'Gaponenko', 'Yelyzaveta', 'Andriivna', 'Manager', 20000.00, '1992-05-30', '2018-01-15', '380994567890', 'Kyiv', 'Sumska St', '61000'),
                ('E005', 'Petrenko', 'Olha', 'Vasyliivna', 'Cashier', 40000, '1990-01-01', '2021-01-01', '380671234567', 'Kyiv', 'Khreshchatyk St', '01001'),
                ('E006', 'Ivanenko', 'Maksym', 'Oleksandrovych', 'Cashier', 40000, '1992-01-01', '2022-01-01', '380502395078', 'Lviv', 'Hrushevskoho St', '79000'),
                ('E007', 'Sydorchuk', 'Nataliia', 'Petrivna', 'Cashier', 40000, '1993-01-01', '2022-06-01', '380633053489', 'Odesa', 'Deribasivska St', '65000'),
                ('E008', 'Fedorenko', 'Dmytro', 'Andriiovych', 'Cashier', 40000, '1991-01-01', '2023-01-01', '380994567890', 'Kharkiv', 'Sumska St', '61000'),
                ('E009', 'Melnyk', 'Tetiana', 'Ihorivna', 'Cashier', 40000, '1994-01-01', '2023-06-01', '380985678901', 'Dnipro', 'Dmytra Yavornytskoho Ave', '49000'),
                ('E010', 'Kovalchuk', 'Andrii', 'Mykolaiovych', 'Cashier', 40000, '1990-06-01', '2023-03-01', '380974123456', 'Vinnytsia', 'Soborna St', '21000');
''')

cursor.execute('''
INSERT INTO Customer_Card (
    card_number, cust_surname, cust_name, cust_patronymic, phone_number, 
    city, street, zip_code, percent
) 
VALUES  
('C001', 'Petrenko', 'Olha', 'Vasyliivna', '380671234567', 'Kyiv', 'Khreshchatyk St', '01001', 5),  
('C002', 'Ivanenko', 'Maksym', 'Oleksandrovych', '380502395078', 'Lviv', 'Hrushevskoho St', '79000', 10),  
('C003', 'Sydorchuk', 'Nataliia', 'Petrivna', '380633053489', 'Odesa', 'Deribasivska St', '65000', 7),  
('C004', 'Fedorenko', 'Dmytro', 'Andriiovych', '380994567890', 'Kharkiv', 'Sumska St', '61000', 12),  
('C005', 'Melnyk', 'Tetiana', 'Ihorivna', '380985678901', 'Dnipro', 'Dmytra Yavornytskoho Ave', '49000', 8);  

''')

cursor.execute('''
INSERT INTO Receipt (
    check_number, id_employee, card_number, print_date, sum_total, vat
) 
VALUES 
('R001', 'E001', 'C001', '2024-02-25 10:15:30', 500.75, 500.75 * 0.20),
('R002', 'E002', NULL, '2024-02-25 12:40:10', 1200.50, 1200.50 * 0.20),
('R003', 'E003', 'C003', '2024-02-26 14:20:45', 750.30, 750.30 * 0.20),
('R004', 'E004', 'C004', '2024-02-26 16:55:00', 340.20, 340.20 * 0.20),
('R005', 'E005', NULL, '2024-02-27 09:30:15', 920.80, 920.80 * 0.20);

''')

cursor.execute('''
INSERT INTO sale (UPC, check_number, product_number, selling_price) VALUES
    ('123456789012', 'R001', 2, 2.99),
    ('234567890123', 'R001', 1, 5.49),
    ('345678901234', 'R002', 3, 1.99),
    ('456789012345', 'R003', 1, 4.79),
    ('567890123456', 'R004', 2, 2.99),
    ('678901234567', 'R005', 1, 2.49)

''')

conn.commit()
conn.close()

print("Тестові дані успішно додані!")