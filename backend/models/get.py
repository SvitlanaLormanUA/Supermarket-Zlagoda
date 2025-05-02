import sqlite3
import os
from robyn import jsonify 
from dotenv import load_dotenv
from urllib.parse import unquote

load_dotenv()
DB_LINK = os.getenv("DB_LINK")

def get_all_products():
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT 
                p.id_product, 
                p.category_number, 
                c.category_name,
                p.product_name, 
                p.characteristics
            FROM product p
            LEFT JOIN category c ON p.category_number = c.category_number
        ''')

        products = cursor.fetchall()
        result = []
        for product in products:
            product_dict = {
                'id_product': product[0],
                'category_number': product[1],
                'category_name': product[2],
                'product_name': product[3],
                'characteristics': product[4],
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


def get_product_by_name(product_name):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT 
                p.id_product, 
                p.category_number, 
                c.category_name,
                p.product_name, 
                p.characteristics
            FROM product p
            JOIN category c ON p.category_number = c.category_number
            WHERE LOWER(p.product_name) LIKE LOWER(?)
        ''', (f'%{product_name}%',)) 

        products = cursor.fetchall()
        result = []
        for product in products:
            product_dict = {
                'id_product': product[0],
                'category_number': product[1],
                'category_name': product[2],
                'product_name': product[3],
                'characteristics': product[4],
                
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


def get_sorted_products(field, order):
    valid_fields = {"product_name"}
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
            p.id_product,
            p.category_number,
            c.category_name,
            p.product_name,
            p.characteristics        
        FROM product p
        JOIN category c ON p.category_number = c.category_number
        """

        query += f" ORDER BY {field} {order.upper()}"

        cursor.execute(query)
        products = cursor.fetchall()
        result = []
        for product in products:
            product_dict = {
                'id_product': product[0],
                'category_number': product[1],
                'category_name': product[2],
                'product_name': product[3],
                'characteristics': product[4]
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



def get_store_products_by_input(search_value):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        search_value = unquote(search_value.strip()) if search_value else ""

        # Determine if the input is a UPC (all digits) or a product name
        is_upc = search_value.isdigit()  

        if is_upc:
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
            ''', (search_value,))
        else:
            # Query for product_name (case-insensitive, partial match)
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
                WHERE p.product_name LIKE ? COLLATE NOCASE
            ''', (f'%{search_value}%',))

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
            query += " WHERE sp.promotional_product = true"
        elif discount_filter == "false":
            query += " WHERE sp.promotional_product = false"

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


def get_products_sorted(sort_by="product_name", order="ASC"):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        # Валідація параметрів
        valid_sort_fields = ["product_name", "id_product", "category_name"]
        valid_orders = ["ASC", "DESC"]
        
        if sort_by not in valid_sort_fields or order.upper() not in valid_orders:
            return {
                "status_code": 400,
                "body": jsonify({"error": "Invalid sort parameters"}),
                "headers": {"Content-Type": "application/json"}
            }

        query = f'''
            SELECT 
                p.id_product,
                p.product_name,
                p.characteristics,
                c.category_name
            FROM product p
            LEFT JOIN category c ON p.category_number = c.category_number
            ORDER BY {sort_by} {order}
        '''

        cursor.execute(query)
        products = cursor.fetchall()
        result = [{
            'id': p[0],
            'name': p[1],
            'characteristics': p[2],
            'category': p[3]
        } for p in products]

        return {
            "status_code": 200,
            "body": jsonify({"data": result}),
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.Error as e:
        return {
            "status_code": 500,
            "body": jsonify({"error": str(e)}),
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
            ORDER BY p.product_name COLLATE NOCASE ASC
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


def get_customers_by_percent(percent, sort="asc"):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # Ensure sort is either ASC or DESC
        sort_order = "ASC" if sort.lower() != "desc" else "DESC"

        cursor.execute(f'''
            SELECT * FROM customer_card
            WHERE percent = ?
            ORDER BY cust_surname {sort_order}
        ''', (percent,))

        rows = cursor.fetchall()
        customers = [dict(row) for row in rows]

        return {
            "status_code": 200,
            "body": jsonify({"customers": customers}),
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

#EMPLOYEES
# вони тут вже відсортовані за прізвищем
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
            ORDER BY empl_surname ASC
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

def get_employee_by_surname(surname):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        print(f"DEBUG: Querying surname = {surname}")  
        surname = unquote(surname) if surname else None
        
        cursor.execute('''
            SELECT 
                empl_surname,
                phone_number,
                city,
                street,
                zip_code
            FROM employee
            WHERE empl_surname = ? COLLATE NOCASE  
            ORDER BY empl_surname ASC
        ''', (surname.strip(),)) 

        employees = cursor.fetchall()
        result = [
            {
                'empl_surname': employee[0],
                'phone_number': employee[1],
                'city': employee[2],
                'street': employee[3],
                'zip_code': employee[4]
            }
            for employee in employees
        ]

        return {
            "status_code": 200,
            "body": jsonify({"data": result}),
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.Error as e:
        return {
            "status_code": 500,
            "body": {
                "status": "error",
                "data": [],
                "message": f"Database error: {str(e)}"
            },
            "headers": {"Content-Type": "application/json"}
        }
    finally:
        if conn:
            conn.close()


def get_cashiers():
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
            WHERE empl_role = ? COLLATE NOCASE  
            ORDER BY empl_surname ASC
        ''', ('Cashier',))

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
            FROM employee
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


def get_employee_info_by_id(employee_id: str, role: str = None):
    """
    Fetch employee information by id_employee from the employee table.
    Returns a Robyn-compatible HTTP response dictionary.
    """
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id_employee, empl_surname, empl_name, empl_patronymic, empl_role,
                   salary, date_of_birth, date_of_start, phone_number, city, street, zip_code
            FROM employee
            WHERE id_employee = ?
        ''', (employee_id,))

        row = cursor.fetchone()
        if row:
            employee = {
                "id_employee": row[0],
                "empl_surname": row[1],
                "empl_name": row[2],
                "empl_patronymic": row[3],
                "empl_role": row[4],
                "salary": float(row[5]),
                "date_of_birth": row[6],
                "date_of_start": row[7],
                "phone_number": row[8],
                "city": row[9],
                "street": row[10],
                "zip_code": row[11]
            }
            return {
                "status_code": 200,
                "body": jsonify({"data": employee}),
                "headers": {"Content-Type": "application/json"}
            }
        return {
            "status_code": 404,
            "body": {"status": "error", "data": [], "message": "Employee not found"},
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.Error as e:
        return {
            "status_code": 500,
            "body": {"status": "error", "data": [], "message": f"Database error: {str(e)}"},
            "headers": {"Content-Type": "application/json"}
        }
    except ValueError as e:
        return {
            "status_code": 500,
            "body": {"status": "error", "data": [], "message": f"Data conversion error: {str(e)}"},
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
                r.check_number,
                r.id_employee,
                r.card_number,
                r.print_date,
                r.sum_total,
                r.vat,
                s.UPC,
                s.product_number,
                s.selling_price,
                p.product_name
            FROM receipt r
            LEFT JOIN employee e ON r.id_employee = e.id_employee
            LEFT JOIN customer_card cc ON r.card_number = cc.card_number
            INNER JOIN sale s ON r.check_number = s.check_number
            INNER JOIN store_product sp ON s.UPC = sp.UPC
            INNER JOIN product p ON sp.id_product = p.id_product
            ORDER BY r.print_date DESC, r.check_number, s.UPC
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
                'items': [{
                    'UPC': receipt[6],
                    'product_number': receipt[7],
                    'selling_price': receipt[8],
                    'product_name': receipt[9]
                }]
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


def get_receipts_by_date(cashier_id, target_date):

    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        print(f"[DEBUG] Filtering receipts for cashier_id={cashier_id} on date={target_date}")

        query = '''
        SELECT 
            r.check_number,
            r.print_date,
            r.sum_total,
            r.vat,
            e.id_employee,
            e.empl_surname || ' ' || e.empl_name AS cashier_name,
            r.card_number,
            COUNT(s.UPC) AS items_count
        FROM 
            receipt r
        JOIN 
            employee e ON r.id_employee = e.id_employee
        LEFT JOIN 
            sale s ON r.check_number = s.check_number
        WHERE 
            r.id_employee = ? AND DATE(r.print_date) = DATE(?)
        GROUP BY 
            r.check_number, r.print_date, r.sum_total, r.vat, 
            e.id_employee, cashier_name, r.card_number
        ORDER BY 
            r.print_date DESC, r.check_number;
        '''
        cursor.execute(query, (cashier_id, target_date))
        rows = cursor.fetchall()

        receipts = []
        for row in rows:
            receipts.append({
                "check_number": row[0],
                "print_date": row[1],
                "sum_total": row[2],
                "vat": row[3],
                "employee_id": row[4],
                "cashier_name": row[5],
                "card_number": row[6],
                "items_count": row[7]
            })

        return {
            "status_code": 200 if receipts else 404,
            "body": jsonify({
                "status": "success",
                "data": receipts,
                "message": (
                    f"Found {len(receipts)} receipts for cashier {cashier_id} on {target_date}"
                    if receipts else f"No receipts found for cashier {cashier_id} on {target_date}"
                )
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

# COMPLICATED QUERIES
def get_cashier_receipt_history(id_employee=None, date_created=None, date_ended=None):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        query = '''
        SELECT 
            e.id_employee,
            e.empl_surname,
            e.empl_name,
            r.check_number,
            r.card_number,
            r.print_date,
            r.sum_total,
            r.vat,
            s.UPC,
            s.product_number,
            s.selling_price,
            p.product_name,
            c.category_name
        FROM 
            employee e
            INNER JOIN receipt r ON e.id_employee = r.id_employee
            INNER JOIN sale s ON r.check_number = s.check_number
            INNER JOIN store_product sp ON s.UPC = sp.UPC
            INNER JOIN product p ON sp.id_product = p.id_product
            INNER JOIN category c ON p.category_number = c.category_number
        '''
        
        params = []
        conditions = []
        if id_employee:
            conditions.append('e.id_employee = ?')
            params.append(id_employee)
        if date_created:
            conditions.append('DATE(r.print_date) >= DATE(?)')
            params.append(date_created)
        if date_ended:
            conditions.append('DATE(r.print_date) <= DATE(?)')
            params.append(date_ended)
        
        if conditions:
            query += ' WHERE ' + ' AND '.join(conditions)
        
        query += ' ORDER BY r.print_date DESC, r.check_number, s.UPC;'

        cursor.execute(query, params)
        rows = cursor.fetchall()

        if not rows:
            message = "No receipts found"
            if id_employee:
                message += f" for cashier ID: {id_employee}"
            if date_created or date_ended:
                message += f" for period: {date_created or 'any'} to {date_ended or 'any'}"
            return {
                "status_code": 404,
                "body": jsonify({
                    "status": "success",
                    "data": [],
                    "message": message
                }),
                "headers": {"Content-Type": "application/json"}
            }

        # Structure the data
        receipts = {}
        for row in rows:
            check_number = row[3]
            if check_number not in receipts:
                receipts[check_number] = {
                    "check_number": row[3],
                    "id_employee": row[0],
                    "employee_name": f"{row[1]} {row[2]}",
                    "card_number": row[4],
                    "print_date": row[5],
                    "sum_total": row[6],
                    "vat": row[7],
                    "items": []
                }
            receipts[check_number]["items"].append({
                "UPC": row[8],
                "product_name": row[11],
                "category_name": row[12],
                "product_number": row[9],
                "selling_price": row[10]
            })

        # Convert receipts dict to list for JSON response
        result = list(receipts.values())

        return {
            "status_code": 200,
            "body": jsonify({
                "status": "success",
                "data": result,
                "message": "Receipt history retrieved successfully"
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

def get_active_cashiers_with_receipts(date_created=None, date_ended=None):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        query = '''
        SELECT 
            a.employee_id,
            e.empl_surname,
            e.empl_name,
            a.is_active,
            a.last_login,
            r.check_number,
            r.card_number,
            r.print_date,
            r.sum_total,
            s.UPC,
            p.product_name,
            s.product_number,
            s.selling_price
        FROM 
            account a
        JOIN employee e ON a.employee_id = e.id_employee
        JOIN receipt r ON e.id_employee = r.id_employee
        LEFT JOIN sale s ON r.check_number = s.check_number
        LEFT JOIN store_product sp ON s.UPC = sp.UPC
        LEFT JOIN product p ON sp.id_product = p.id_product
        WHERE 
            NOT EXISTS (
                SELECT 1 FROM account a2 
                WHERE a2.employee_id = a.employee_id AND a2.is_active = 0
            )
            AND NOT EXISTS (
                SELECT 1 FROM account a3 
                WHERE a3.employee_id = a.employee_id AND a3.last_login IS NULL
            )
            AND NOT EXISTS (
                SELECT 1 FROM employee e2 
                WHERE e2.id_employee = e.id_employee AND e2.empl_role != 'Cashier'
            )
            AND NOT EXISTS (
                SELECT 1 FROM receipt r2 
                WHERE r2.check_number = r.check_number AND r2.card_number IS NULL
            )
        '''
        
        params = []
        conditions = []
        if date_created:
            conditions.append('DATE(r.print_date) >= DATE(?)')
            params.append(date_created)
        if date_ended:
            conditions.append('DATE(r.print_date) <= DATE(?)')
            params.append(date_ended)
    
        if conditions:
            query += ' AND ' + ' AND '.join(conditions)
        
        query += ' ORDER BY a.employee_id, r.check_number, r.print_date DESC;'

        cursor.execute(query, params)
        rows = cursor.fetchall()

        if not rows:
            return {
                "status_code": 404,
                "body": jsonify({
                    "data": [],
                    "total_sales": 0.0
                }),
                "headers": {"Content-Type": "application/json"}
            }

        # Structure the data
        receipts = {}
        total_sales = 0.0
        for row in rows:
            check_number = row[5]
            if check_number not in receipts:
                receipts[check_number] = {
                    "check_number": row[5],
                    "id_employee": row[0],
                    "employee_name": f"{row[1]} {row[2]}",
                    "card_number": row[6],
                    "print_date": row[7],
                    "sum_total": float(row[8]),
                    "items": []
                }
                total_sales += float(row[8])  # Accumulate total sales
            if row[9]:  # Check if product data exists (UPC is not null)
                receipts[check_number]["items"].append({
                    "UPC": row[9],
                    "product_name": row[10],
                    "product_number": row[11],
                    "selling_price": float(row[12])
                })

        # Convert receipts dict to list for JSON response
        result = list(receipts.values())

        return {
            "status_code": 200,
            "body": jsonify({
                "status": "success",
                "data": result,
                "total_sales": total_sales,
                "message": "Receipt history retrieved successfully"
            }),
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.Error as e:
        return {
            "status_code": 500,
            "body": jsonify({
                "status": "error",
                "data": [],
                "total_sales": 0.0,
                "message": f"Database error: {str(e)}"
            }),
            "headers": {"Content-Type": "application/json"}
        }
    finally:
        if conn:
            conn.close()
#19. загальна сума продажів
def get_total_sales_by_cashier(id_employee, start_date, end_date):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        if id_employee:
            query = '''
            SELECT 
                e.id_employee,
                e.empl_surname,
                e.empl_name,
                SUM(s.product_number * s.selling_price) AS total_sales
            FROM 
                employee e
                INNER JOIN receipt r ON e.id_employee = r.id_employee
                INNER JOIN sale s ON r.check_number = s.check_number
            WHERE 
                e.id_employee = ?
                AND r.print_date BETWEEN ? AND ?
            GROUP BY 
                e.id_employee, e.empl_surname, e.empl_name
            '''
            cursor.execute(query, (id_employee, start_date, end_date))
            rows = cursor.fetchall()

        else:
            query = '''
            SELECT 
                e.id_employee,
                e.empl_surname,
                e.empl_name,
                SUM(s.product_number * s.selling_price) AS total_sales
            FROM 
                employee e
                INNER JOIN receipt r ON e.id_employee = r.id_employee
                INNER JOIN sale s ON r.check_number = s.check_number
            WHERE 
                r.print_date BETWEEN ? AND ?
            GROUP BY 
                e.id_employee, e.empl_surname, e.empl_name
            '''
            cursor.execute(query, (start_date, end_date))
            rows = cursor.fetchall()

        if not rows:
            return {
                "status_code": 404,
                "body": jsonify({"status": "error", "message": "No sales found for the given period"}),
                "headers": {"Content-Type": "application/json"}
            }

        result = []
        for row in rows:
            result.append({
                "id_employee": row[0],
                "empl_surname": row[1],
                "empl_name": row[2],
                "total_sales": round(row[3], 2) if row[3] else 0.0
            })

        return {
            "status_code": 200,
            "body": jsonify({"data": result}),
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

#21. кількість поданого певного товару за період
def get_total_quantity_product(product_id, start_date, end_date):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        query = '''
        SELECT 
            p.id_product,
            p.product_name,
            SUM(s.product_number) AS total_quantity,
            MIN(sp.selling_price) AS min_price,
            MAX(sp.selling_price) AS max_price,
            AVG(sp.selling_price) AS avg_price
        FROM 
            product p
            INNER JOIN store_product sp ON p.id_product = sp.id_product
            INNER JOIN sale s ON sp.UPC = s.UPC
            INNER JOIN receipt r ON s.check_number = r.check_number
        WHERE 
            p.id_product = ?
            AND r.print_date BETWEEN ? AND ?
        GROUP BY 
            p.id_product, p.product_name
        '''

        cursor.execute(query, (product_id, start_date, end_date))
        row = cursor.fetchone()

        if not row:
            return {
                "status_code": 404,
                "body": {
                    "status": "error",
                    "message": "No sales found for this product in the given period"
                },
                "headers": {"Content-Type": "application/json"}
            }

        result = {
            "id_product": row[0],
            "product_name": row[1],
            "total_quantity_sold": row[2],
            "min_price": round(row[3], 2) if row[3] else None,
            "max_price": round(row[4], 2) if row[4] else None,
            "avg_price": round(row[5], 2) if row[5] else None
        }

        return {
            "status_code": 200,
            "body": {
                "data": result
            },
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.Error as e:
        return {
            "status_code": 500,
            "body": {
                "status": "error",
                "message": f"Database error: {str(e)}"
            },
            "headers": {"Content-Type": "application/json"}
        }
    finally:
        if conn:
            conn.close()


def get_customers_without_category_and_receipts(category_name: str):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        query = '''
        SELECT 
            c.card_number,
            c.cust_surname,
            c.cust_name,
            c.phone_number,
            c.city
        FROM 
            customer_card c
        WHERE 
            NOT EXISTS (
                SELECT 1
                FROM receipt r
                JOIN sale s ON r.check_number = s.check_number
                JOIN store_product sp ON s.UPC = sp.UPC
                JOIN product p ON sp.id_product = p.id_product
                WHERE r.card_number = c.card_number
                AND p.category_name = ?
            )
            AND NOT EXISTS (
                SELECT 1 
                FROM receipt r2 
                WHERE r2.card_number = c.card_number
            )
        '''

        cursor.execute(query, (category_name))
        rows = cursor.fetchall()

        if not rows:
            return {
                "status_code": 404,
                "body": jsonify({
                    "status": "success",
                    "data": [],
                    "message": "No matching customers found"
                }),
                "headers": {"Content-Type": "application/json"}
            }

        result = []
        for row in rows:
            result.append({
                "card_number": row[0],
                "surname": row[1],
                "name": row[2],
                "phone": row[3],
                "city": row[4]
            })

        return {
            "status_code": 200,
            "body": jsonify({
                "data": result,
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


def get_average_receipt_by_product(product_id):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        query = '''
            SELECT 
                p.id_product,
                p.product_name,
                AVG(r.sum_total) AS average_receipt_total,
                MIN(r.sum_total) AS min_receipt_total,
                MAX(r.sum_total) AS max_receipt_total,
                COUNT(DISTINCT r.check_number) AS number_of_receipts
            FROM receipt r
            JOIN sale s ON r.check_number = s.check_number
            JOIN store_product sp ON s.UPC = sp.UPC
            JOIN product p ON sp.id_product = p.id_product
            WHERE p.id_product = ?
            GROUP BY p.id_product, p.product_name
        '''

        cursor.execute(query, (product_id,))
        result = cursor.fetchone()

        if result:
            product_id = result[0] 
            product_name = result[1]
            average_receipt_total = result[2] if result[2] else 0.0
            min_receipt_total = result[3] if result[3] else 0.0
            max_receipt_total = result[4] if result[4] else 0.0
            number_of_receipts = result[5] if result[5] else 0

            return {
                "status_code": 200,
                "body": jsonify({
                    "status": "success",
                    "data": {
                        "product_id": product_id,
                        "product_name": product_name,
                        "average_receipt_total": round(average_receipt_total, 2),
                        "min_receipt_total": round(min_receipt_total, 2),
                        "max_receipt_total": round(max_receipt_total, 2),
                        "number_of_receipts": number_of_receipts
                    },
                    "message": "Average receipt total calculated"
                }),
                "headers": {"Content-Type": "application/json"}
            }
        else:
            return {
                "status_code": 404,
                "body": jsonify({
                    "status": "error",
                    "data": [],
                    "message": "No data found for the selected product"
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




