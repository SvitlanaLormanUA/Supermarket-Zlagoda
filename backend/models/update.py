import sqlite3
from robyn import jsonify
from os import environ as env

DB_LINK = env.get("DB_LINK")

def update_product(product_id, product_data):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            UPDATE product
            SET category_number = ?, product_name = ?, characteristics = ?
            WHERE id_product = ?
        ''', (product_data['category_number'], product_data['product_name'], product_data['characteristics'], product_id))

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

def update_store_product(product_id, product_data):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

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

        if cursor.rowcount == 0:
            return {
                "status_code": 404,
                "body": jsonify({"data": "No product found to update"}),
                "headers": {"Content-Type": "application/json"}
            }

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

def update_category(category_number, category_data):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
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
