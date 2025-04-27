import sqlite3
import os
from robyn import jsonify 
from dotenv import load_dotenv

load_dotenv()
DB_LINK = os.getenv("DB_LINK")


def add_new_product(product_data):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO product (category_number, product_name, characteristics)
            VALUES (?, ?, ?)
        ''', (product_data['category_number'], product_data['product_name'], product_data['characteristics']))

        conn.commit()

        return {
            "status_code": 201,
            "body": jsonify({"data": "Product added successfully"}),
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.Error as e:
        return {
            "status_code": 500,
            "body": jsonify({"data": f"Database error: {str(e)}"}),
            "headers": {"Content-Type": "application/json"}
        }
    finally:
        if conn:
            conn.close()

def add_new_store_product(product_data):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO store_product (UPC, UPC_prom, id_product, selling_price, products_number, promotional_product)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            product_data['UPC'],
            product_data['UPC_prom'],
            product_data['id_product'],
            product_data['selling_price'],
            product_data['products_number'],
            product_data['promotional_product']
        ))

        conn.commit()

        return {
            "status_code": 201,
            "body": jsonify({"data": "Product added successfully"}),
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.Error as e:
        return {
            "status_code": 500,
            "body": jsonify({"data": f"Database error: {str(e)}"}),
            "headers": {"Content-Type": "application/json"}
        }
    finally:
        if conn:
            conn.close()            

def add_new_category(category_data):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO category (category_name)
            VALUES (?)
        ''', (category_data['category_name'],))

        conn.commit()

        return {
            "status_code": 201,
            "body": jsonify({"data": "Category added successfully"}),
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.Error as e:
        return {
            "status_code": 500,
            "body": jsonify({"data": f"Database error: {str(e)}"}),
            "headers": {"Content-Type": "application/json"}
        }
    finally:
        if conn:
            conn.close()


def add_customer(customer_data):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO customer_card (
                card_number, cust_surname, cust_name, cust_patronymic,
                phone_number, city, street, zip_code, percent
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            customer_data['card_number'],
            customer_data['cust_surname'],
            customer_data['cust_name'],
            customer_data['cust_patronymic'],
            customer_data['phone_number'],
            customer_data['city'],
            customer_data['street'],
            customer_data['zip_code'],
            customer_data['percent']
        ))

        conn.commit()

        return {
            "status_code": 201,
            "body": jsonify({
                "status": "success",
                "message": f"Customer added successfully"
            }),
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.IntegrityError as e:
        return {
            "status_code": 400,
            "body": jsonify({
                "status": "error",
                "message": f"Integrity error: {str(e)} (e.g., duplicate card_number or missing required field)"
            }),
            "headers": {"Content-Type": "application/json"}
        }
    except sqlite3.Error as e:
        return {
            "status_code": 500,
            "body": jsonify({
                "status": "error",
                "data": [],
                "message": f"Database error: {str(e)}"
            }),
            "headers": {"Content-Type": "application/json"}
        }
    finally:
        if conn:
            conn.close()


def add_new_employee(employee_data):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO employee (
                id_employee, empl_surname, empl_name, empl_patronymic,
                empl_role, salary, date_of_birth, date_of_start,
                phone_number, city, street, zip_code
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            employee_data['id_employee'],
            employee_data['empl_surname'],
            employee_data['empl_name'],
            employee_data['empl_patronymic'],
            employee_data['empl_role'],
            employee_data['salary'],
            employee_data['date_of_birth'],
            employee_data['date_of_start'],
            employee_data['phone_number'],
            employee_data['city'],
            employee_data['street'],
            employee_data['zip_code']
        ))

        conn.commit()

        return {
            "status_code": 201,
            "body": jsonify({"data": "Employee added successfully"}),
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.IntegrityError as e:
        return {
            "status_code": 400,
            "body": jsonify({
                "status": "error",
                "message": f"Integrity error: {str(e)} (e.g., duplicate id_employee)"
            }),
            "headers": {"Content-Type": "application/json"}
        }
    except sqlite3.Error as e:
        return {
            "status_code": 500,
            "body": jsonify({"data": f"Database error: {str(e)}"}),
            "headers": {"Content-Type": "application/json"}
        }
    finally:
        if conn:
            conn.close()


def add_new_receipt(receipt_data):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO receipt (check_number, id_employee, card_number, print_date, sum_total, vat)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            receipt_data['checkNumber'],
            receipt_data['employeeId'],
            receipt_data['cardNumber'],
            receipt_data['printDate'],
            float(receipt_data['sumTotal']),
            float(receipt_data['vat'])
        ))

        for product in receipt_data.get('products', []):
            cursor.execute('''
                INSERT INTO sale (UPC, check_number, product_number, selling_price)
                VALUES (?, ?, ?, ?)
            ''', (
                product['UPC'],
                receipt_data['checkNumber'],
                int(product['product_number']),
                float(product['selling_price'])
            ))

        conn.commit()

        return {
            "status_code": 201,
            "body": jsonify({"data": "Receipt and products added successfully"}),
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.Error as e:
        if conn:
            conn.rollback()
        return {
            "status_code": 500,
            "body": jsonify({"data": f"Database error: {str(e)}"}),
            "headers": {"Content-Type": "application/json"}
        }

    finally:
        if conn:
            conn.close()         

def add_receipt_with_store_products(receipt_data):
    """
    Чек (store_products)
    :param receipt_data: {
        "check_number": str,
        "id_employee": str,
        "card_number": str (optional),
        "print_date": str (YYYY-MM-DD HH:MM:SS),
        "items": [
            {
                "UPC": str,
                "quantity": int,
                "selling_price": float
            },
            ...
        ]
    }
    """
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()
        
        # Загальна сума та ПДВ
        total = sum(item['quantity'] * item['selling_price'] for item in receipt_data['items'])
        vat = total * 0.2  # 20% ПДВ (можна змінити)

        cursor.execute('''
            INSERT INTO receipt (
                check_number, 
                id_employee, 
                card_number, 
                print_date, 
                sum_total, 
                vat
            ) VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            receipt_data['check_number'],
            receipt_data['id_employee'],
            receipt_data.get('card_number'),
            receipt_data['print_date'],
            total,
            vat
        ))


        for item in receipt_data['items']:
            # наявність?
            cursor.execute('SELECT products_number FROM store_product WHERE UPC = ?', (item['UPC'],))
            result = cursor.fetchone()
            
            if not result:
                raise ValueError(f"Товар з UPC {item['UPC']} не знайдено")
                
            available_quantity = result[0]
            if available_quantity < item['quantity']:
                raise ValueError(f"Недостатня кількість товару {item['UPC']}. Доступно: {available_quantity}")


            cursor.execute('''
                INSERT INTO sale (
                    UPC, 
                    check_number, 
                    product_number, 
                    selling_price
                ) VALUES (?, ?, ?, ?)
            ''', (
                item['UPC'],
                receipt_data['check_number'],
                item['quantity'],
                item['selling_price']
            ))


            cursor.execute('''
                UPDATE store_product 
                SET products_number = products_number - ? 
                WHERE UPC = ?
            ''', (item['quantity'], item['UPC']))

        conn.commit()

        return {
            "status_code": 201,
            "body": jsonify({
                "message": "Чек успішно додано",
                "check_number": receipt_data['check_number'],
                "total": total,
                "vat": vat
            }),
            "headers": {"Content-Type": "application/json"}
        }

    except ValueError as e:
        if conn:
            conn.rollback()
        return {
            "status_code": 400,
            "body": jsonify({"error": str(e)}),
            "headers": {"Content-Type": "application/json"}
        }
    except sqlite3.Error as e:
        if conn:
            conn.rollback()
        return {
            "status_code": 500,
            "body": jsonify({"error": f"Database error: {str(e)}"}),
            "headers": {"Content-Type": "application/json"}
        }
    finally:
        if conn:
            conn.close()
