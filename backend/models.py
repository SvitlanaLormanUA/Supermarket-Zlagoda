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
    try:
        conn = sqlite3.connect('./database/supermarket.db')
        cursor = conn.cursor()

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

