import sqlite3
import os
from robyn import jsonify 
from dotenv import load_dotenv

load_dotenv()
DB_LINK = os.getenv("DB_LINK")

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

#CUSTOMERS
def update_customer(card_number, update_data):
    conn = None
    try:
        if not update_data:
            return {
                "status_code": 400,
                "body": jsonify({
                    "status": "error",
                    "message": "No fields provided to update"
                }),
                "headers": {"Content-Type": "application/json"}
            }

        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        field_map = {
            'cust_surname': 'cust_surname',
            'cust_name': 'cust_name',
            'cust_patronymic': 'cust_patronymic',
            'phone_number': 'phone_number',
            'city': 'city',
            'street': 'street',
            'zip_code': 'zip_code',
            'percent': 'percent'
        }

        set_clause = ", ".join(
            f"{field_map[key]} = :{key}"
            for key in update_data.keys()
            if key in field_map
        )
        if not set_clause:
            return {
                "status_code": 400,
                "body": jsonify({
                    "status": "error",
                    "message": "No valid fields provided to update"
                }),
                "headers": {"Content-Type": "application/json"}
            }

        query = f'''
            UPDATE customer_card 
            SET {set_clause}
            WHERE card_number = :card_number
        '''
        params = {'card_number': card_number, **update_data}

        cursor.execute(query, params)
        conn.commit()

        if cursor.rowcount == 0:
            return {
                "status_code": 404,
                "body": jsonify({
                    "status": "error",
                    "message": f"Customer with card_number {card_number} not found"
                }),
                "headers": {"Content-Type": "application/json"}
            }

        return {
            "status_code": 200,
            "body": jsonify({
                "status": "success",
                "message": f"Customer {card_number} updated successfully",
                "rows_updated": cursor.rowcount
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
