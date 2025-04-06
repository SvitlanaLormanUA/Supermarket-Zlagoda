import sqlite3
from robyn import jsonify 
 
# !!! У якому вигляді повертається відповідь:
# "status_code": 200,
#             "body": jsonify({
#                 "data": result,
#             }),
#             "headers": {"Content-Type": "application/json"}
 
# результат, тобто наші дані -- у "data"
# на фронтенді має тільки "data" відображатись. все інше -- для безпеки та беку :)
# !!!
 
def update_product(product_id, product_data):
    conn = None
    try:
        conn = sqlite3.connect('./database/supermarket.db')
        cursor = conn.cursor()
 
        cursor.execute('''
            UPDATE product
            SET category_number = ?, product_name = ?, characteristics = ?
            WHERE id_product = ?
        ''', (product_data['category_number'], product_data['product_name'], product_data['characteristics'], product_id))
 
        cursor.execute('''
            UPDATE store_product
            SET UPC = ?, UPC_prom = ?, selling_price = ?, products_number = ?, promotional_product = ?
            WHERE id_product = ?
        ''', (
            product_data['UPC'],
            product_data['UPC_prom'],
            product_data['selling_price'],
            product_data['products_number'],
            product_data['promotional_product'],
            product_id
        ))
 
        conn.commit()
 
        return {
            "status_code": 200,
            "body": jsonify({"data": "Product updated successfully"}),
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
 
def delete_product(product_id):
    conn = None
    try:
        conn = sqlite3.connect('./database/supermarket.db')
        cursor = conn.cursor()
 
        # перевірка на те, чи існує продукт у таблиці product
        cursor.execute('''
            SELECT id_product FROM product WHERE id_product = ?
        ''', (product_id,))
        product_exists = cursor.fetchone()
 
        if not product_exists:
            return {
                "status_code": 404,
                "body": jsonify({"data": "Product not found"}),
                "headers": {"Content-Type": "application/json"}
            }
        cursor.execute('''
            DELETE FROM store_product
            WHERE id_product = ?
        ''', (product_id,))
 
        cursor.execute('''
            DELETE FROM product
            WHERE id_product = ?
        ''', (product_id,))
 
        conn.commit()
 
        return {
            "status_code": 200,
            "body": jsonify({"data": "Product deleted successfully"}),
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
 
def add_new_product(product_data):
    conn = None
    try:
        conn = sqlite3.connect('./database/supermarket.db')
        cursor = conn.cursor()
 
        cursor.execute('''
            INSERT INTO product (category_number, product_name, characteristics)
            VALUES (?, ?, ?)
        ''', (product_data['category_number'], product_data['product_name'], product_data['characteristics']))
 
        cursor.execute('''
            INSERT INTO store_product (UPC, UPC_prom, id_product, selling_price, products_number, promotional_product)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            product_data['UPC'],
            product_data['UPC_prom'],
            cursor.lastrowid,
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
 
 
def add_new_category(category_data):
    conn = None
    try:
        conn = sqlite3.connect('./database/supermarket.db')
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

def delete_category(category_number):
    conn = None
    try:
        conn = sqlite3.connect('./database/supermarket.db')
        conn.execute("PRAGMA foreign_keys = ON")
        cursor = conn.cursor()

        cursor.execute('SELECT category_number FROM category WHERE category_number = ?', (category_number,))
        category_exists = cursor.fetchone()

        if not category_exists:
            return {
                "status_code": 404,
                "body": jsonify({"data": "Category not found"}),
                "headers": {"Content-Type": "application/json"}
            }

        cursor.execute('DELETE FROM category WHERE category_number = ?', (category_number,))
        conn.commit()

        return {
            "status_code": 200,
            "body": jsonify({"data": "Category deleted successfully"}),
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.IntegrityError as e:
        return {
            "status_code": 400,
            "body": jsonify({"data": "Cannot delete category with associated products"}),
            "headers": {"Content-Type": "application/json"}
        }

    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        return {
            "status_code": 500,
            "body": jsonify({"data": f"Database error: {str(e)}"}),
            "headers": {"Content-Type": "application/json"}
        }

    finally:
        if conn:
            conn.close()


def update_category(category_number, category_data):
    conn = None
    try:
        conn = sqlite3.connect('./database/supermarket.db')
        cursor = conn.cursor()
 
        cursor.execute('''
            UPDATE category
            SET category_name = ?
            WHERE category_number = ?
        ''', (
            category_data['category_name'],
            category_number
        ))
 
        conn.commit()
 
        return {
            "status_code": 200,
            "body": jsonify({"data": "Product updated successfully"}),
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

