import sqlite3
import os
from robyn import jsonify 
from dotenv import load_dotenv
from urllib.parse import unquote

load_dotenv()
DB_LINK = os.getenv("DB_LINK")

def get_product_info(product_id):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT p.id_product, p.product_name, p.characteristics, 
                   sp.UPC, sp.selling_price, sp.products_number, sp.promotional_product
            FROM product p
            LEFT JOIN store_product sp ON p.id_product = sp.id_product
            WHERE p.id_product = ?
        ''', (product_id,))

        result = cursor.fetchone()

        if result:
            product_info = {
                "id_product": result[0],
                "product_name": result[1],
                "characteristics": result[2],
                "UPC": result[3],
                "selling_price": result[4],
                "products_number": result[5],
                "promotional_product": bool(result[6])
            }
            return {
                "status_code": 200,
                "body": jsonify({"data": product_info}),
                "headers": {"Content-Type": "application/json"}
            }
        else:
            return {
                "status_code": 404,
                "body": jsonify({"data": "Product not found"}),
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

def get_all_store_products():
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT 
                sp.UPC,
                sp.UPC_prom,
                p.id_product,
                p.product_name,
                p.characteristics,
                c.category_name,
                sp.selling_price,
                sp.products_number,
                sp.promotional_product
            FROM store_product sp
            JOIN product p ON sp.id_product = p.id_product
            JOIN category c ON p.category_number = c.category_number
        ''')

        products = cursor.fetchall()
        result = []
        for product in products:
            product_dict = {
                'UPC': product[0],
                'UPC_prom': product[1],
                'id_product': product[2],
                'product_name': product[3],
                'characteristics': product[4],
                'category_name': product[5],
                'selling_price': float(product[6]),
                'products_number': int(product[7]),
                'promotional_product': bool(product[8])
            }
            result.append(product_dict)

        return {
            "status_code": 200,
            "body": jsonify({"data": result}),
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


def get_store_products_by_UPC(upc_value):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT 
                sp.UPC,
                sp.UPC_prom,
                sp.id_product,
                p.product_name,
                p.characteristics,
                c.category_name,
                sp.selling_price,
                sp.products_number,
                sp.promotional_product
            FROM store_product sp
            JOIN product p ON sp.id_product = p.id_product
            JOIN category c ON p.category_number = c.category_number
            WHERE sp.UPC = ?
        ''', (upc_value,))

        products = cursor.fetchall()
        result = []
        for product in products:
            product_dict = {
                'UPC': product[0],
                'UPC_prom': product[1],
                'id_product': product[2],
                'product_name': product[3],
                'characteristics': product[4],
                'category_name': product[5],
                'selling_price': float(product[6]),
                'products_number': int(product[7]),
                'promotional_product': bool(product[8])
            }
            result.append(product_dict)

        return {
            "status_code": 200,
            "body": jsonify({"data": result}),
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


def get_sorted_products_in_store(field, order, discount_filter=None):
    valid_fields = {"product_name", "products_number"}
    valid_order = {"asc", "desc"}

    if field not in valid_fields or order.lower() not in valid_order:
        return {
            "status_code": 400,
            "body": jsonify({
                "status": "error",
                "message": "Invalid sort parameters."
            }),
            "headers": {"Content-Type": "application/json"}
        }

    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        query = f"""
        SELECT  
            sp.UPC,
            sp.UPC_prom,
            sp.id_product,
            p.product_name,
            p.characteristics,
            c.category_name,
            sp.selling_price,
            sp.products_number,
            sp.promotional_product
        FROM store_product sp
        JOIN product p ON sp.id_product = p.id_product
        JOIN category c ON p.category_number = c.category_number
        """

        if discount_filter == "true":
            query += " WHERE sp.promotional_product = 1"
        elif discount_filter == "false":
            query += " WHERE sp.promotional_product = 0"

        query += f" ORDER BY {field} {order.upper()}"

        cursor.execute(query)
        products = cursor.fetchall()

        result = []
        for product in products:
            product_dict = {
                'UPC': product[0],
                'UPC_prom': product[1],
                'id_product': product[2],
                'product_name': product[3],
                'characteristics': product[4],
                'category_name': product[5],
                'selling_price': float(product[6]),
                'products_number': int(product[7]),
                'promotional_product': bool(product[8])
            }
            result.append(product_dict)

        return {
            "status_code": 200,
            "body": jsonify({"data": result}),
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.Error as e:
        return {
            "status_code": 500,
            "body": jsonify({
                "status": "error",
                "message": f"Database error: {str(e)}"
            }),
            "headers": {"Content-Type": "application/json"}
        }

    finally:
        if conn:
            conn.close()




def get_all_categories():
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT category_number, category_name FROM category
        ''')

        categories = cursor.fetchall()
        result = []
        for category in categories:
            category_dict = {
                'category_number': category[0],
                'category_name': category[1]
            }
            result.append(category_dict)

        return {
            "status_code": 200,
            "body": jsonify({"data": result}),
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


def get_sorted_categories(field, order):
    valid_fields = {"category_name", "category_number"}
    valid_order = {"asc", "desc"}

    if field not in valid_fields or order.lower() not in valid_order:
        return {
            "status_code": 400,
            "body": jsonify({
                "status": "error",
                "message": "Invalid sort parameters."
            }),
            "headers": {"Content-Type": "application/json"}
        }

    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        query = f"""
            SELECT category_number, category_name FROM category
        """

        query += f" ORDER BY {field} {order.upper()}"

        cursor.execute(query)
        categories = cursor.fetchall()
        result = []
        for category in categories:
            category_dict = {
                'category_number': category[0],
                'category_name': category[1]
            }
            result.append(category_dict)

        return {
            "status_code": 200,
            "body": jsonify({"data": result}),
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.Error as e:
        return {
            "status_code": 500,
            "body": jsonify({
                "status": "error",
                "message": f"Database error: {str(e)}"
            }),
            "headers": {"Content-Type": "application/json"}
        }

    finally:
        if conn:
            conn.close()



def get_products_by_category(category_number):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT p.id_product, p.product_name
            FROM product p
            LEFT JOIN store_product sp ON p.id_product = sp.id_product
            WHERE p.category_number = ?
        ''', (category_number,))

        products = cursor.fetchall()

        if products:
            product_list = [
                {
                    "id_product": product[0],
                    "product_name": product[1]
                }
                for product in products
            ]
            return {
                "status_code": 200,
                "body": jsonify({"data": product_list}),
                "headers": {"Content-Type": "application/json"}
            }
        else:
            return {
                "status_code": 404,
                "body": jsonify({"data": "No products found for this category"}),
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

#for receipt
def get_total_price():
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT SUM(selling_price * products_number) FROM store_product
        ''')

        row = cursor.fetchone()
        total_price = row[0] if row[0] else 0.0

        return {
            "status_code": 200,
            "body": jsonify({"total_price": round(total_price, 2)}),
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.Error as e:
        return {
            "status_code": 500,
            "body": jsonify({"status": "error", "message": f"Database error: {str(e)}"}),
            "headers": {"Content-Type": "application/json"}
        }
    finally:
        if conn:
            conn.close()

def get_total_quantity():
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT SUM(products_number) FROM store_product
        ''')

        row = cursor.fetchone()
        total_quantity = row[0] if row[0] else 0

        return {
            "status_code": 200,
            "body": jsonify({"total_quantity": total_quantity}),
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.Error as e:
        return {
            "status_code": 500,
            "body": jsonify({"status": "error", "message": f"Database error: {str(e)}"}),
            "headers": {"Content-Type": "application/json"}
        }
    finally:
        if conn:
            conn.close()


def get_products_info():
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id_product, product_name
            FROM product
        ''')

        products = cursor.fetchall()
        result = [{'id_product': row[0], 'product_name': row[1]} for row in products]

        return {
            "status_code": 200,
            "body": jsonify({"data": result}),
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

def get_promotional_products():
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT p.id_product, p.product_name, sp.products_number
            FROM product p
            JOIN store_product sp ON p.id_product = sp.id_product
            WHERE sp.promotional_product = 1
            ORDER BY sp.products_number DESC
        ''')

        products = cursor.fetchall()
        result = [{'id_product': row[0], 'product_name': row[1], 'products_number': row[2]} for row in products]

        return {"status": "success", "data": result}

    except sqlite3.Error as e:
        return {"status": "error", "data": [], "message": f"Database error: {str(e)}"}
    finally:
        if conn:
            conn.close()

def get_non_promotional_products():
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT p.id_product, p.product_name, sp.products_number
            FROM product p
            JOIN store_product sp ON p.id_product = sp.id_product
            WHERE sp.promotional_product = 0
            ORDER BY sp.products_number DESC
        ''')

        products = cursor.fetchall()
        result = [{'id_product': row[0], 'product_name': row[1], 'products_number': row[2]} for row in products]

        return {"status": "success", "data": result}

    except sqlite3.Error as e:
        return {"status": "error", "data": [], "message": f"Database error: {str(e)}"}
    finally:
        if conn:
            conn.close()

# CUSTOMERS
def get_customer_info_ordered():
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT * FROM customer_card ORDER BY cust_surname
        ''')

        rows = cursor.fetchall()
        column_names = [description[0] for description in cursor.description]
        clients = [dict(zip(column_names, row)) for row in rows]

        return {
            "status_code": 200,
            "body": jsonify({"data": clients}),
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

def get_customers_by_name_surname(name=None, surname=None):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        name = unquote(name) if name else None
        surname = unquote(surname) if surname else None

        print(f"Searching: name={name}, surname={surname}")  # дебаг

        cursor.execute('''
            SELECT * FROM customer_card 
            WHERE (:name IS NULL OR cust_name LIKE '%' || :name || '%') 
            AND (:surname IS NULL OR cust_surname LIKE '%' || :surname || '%') 
            ORDER BY cust_surname
        ''', {'name': name, 'surname': surname})

        rows = cursor.fetchall()
        column_names = [description[0] for description in cursor.description]
        customers = [dict(zip(column_names, row)) for row in rows]

        return {
            "status_code": 200,
            "body": jsonify({"data": customers}),
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

#EMPLOYEES
def get_all_employees():
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT 
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
            FROM employee
        ''')

        employees = cursor.fetchall()
        result = []
        for employee in employees:
            employee_dict = {
                'id_employee': employee[0],
                'empl_surname': employee[1],
                'empl_name': employee[2],
                'empl_patronymic': employee[3],
                'empl_role': employee[4],
                'salary': float(employee[5]),
                'date_of_birth': employee[6],
                'date_of_start': employee[7],
                'phone_number': employee[8],
                'city': employee[9],
                'street': employee[10],
                'zip_code': employee[11]
            }
            result.append(employee_dict)

        return {
            "status_code": 200,
            "body": jsonify({"data": result}),
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


def get_employee_by_id():
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id_employee, empl_surname
            FROM Employee
        ''')

        employees = cursor.fetchall()
        result = []
        for employee in employees:
            employee_dict = {
                'id_employee': employee[0],
                'empl_surname': employee[1]
            }
            result.append(employee_dict)

        return {
            "status_code": 200,
            "body": jsonify({"data": result}),
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


def get_all_receipts():
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT 
                check_number,
                id_employee,
                card_number,
                print_date,
                sum_total,
                vat              
            FROM receipt
        ''')

        receipts = cursor.fetchall()
        result = []
        for receipt in receipts:
            receipt_dict = {
                'check_number': receipt[0],
                'id_employee': receipt[1],
                'card_number': receipt[2],
                'print_date': receipt[3],
                'sum_total': receipt[4],
                'vat': receipt[5],
            }
            result.append(receipt_dict)

        return {
            "status_code": 200,
            "body": jsonify({"data": result}),
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
