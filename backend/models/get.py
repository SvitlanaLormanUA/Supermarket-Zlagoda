import sqlite3
from robyn import jsonify 

def get_product_info(product_id):
    conn = None
    try:
        # Create a new connection for this request
        conn = sqlite3.connect('./database/supermarket.db')
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
        # Create a new connection for this request
        conn = sqlite3.connect('./database/supermarket.db')
        cursor = conn.cursor()

        cursor.execute('''
            SELECT 
                sp.UPC,
                sp.UPC_prom,
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
                'product_name': product[2],
                'characteristics': product[3],
                'category_name': product[4],
                'selling_price': float(product[5]),
                'products_number': int(product[6]),
                'promotional_product': bool(product[7])
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

def get_all_categories():
    conn = None
    try:
        conn = sqlite3.connect('./database/supermarket.db')
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

def get_products_by_category(category_number):
    conn = None
    try:
        # Create a new connection for this request
        conn = sqlite3.connect('./database/supermarket.db')
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
        conn = sqlite3.connect('./database/supermarket.db')
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
        conn = sqlite3.connect('./database/supermarket.db')
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


def get_all_customer_cards():
    conn = None
    try:
        conn = sqlite3.connect('./database/supermarket.db')
        cursor = conn.cursor()
 
        cursor.execute('''
            SELECT card_number, cust_surname, cust_name, cust_patronymic, 
                phone_number, city, street, zip_code, percent 
            FROM customer_card
        ''')
 
        customer_cards = cursor.fetchall()
        result = []
        for card in customer_cards:
            card_dict = {
                'card_number': card[0],
                'cust_surname': card[1],
                'cust_name': card[2],
                'cust_patronymic': card[3] if card[3] else "",
                'phone_number': card[4],
                'city': card[5],
                'street': card[6],
                'zip_code': card[7],
                'percent': card[8]
            }
            result.append(card_dict)
 
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


def get_products_info():
    conn = None
    try:
        conn = sqlite3.connect('./database/supermarket.db')
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
