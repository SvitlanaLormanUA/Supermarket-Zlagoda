import sqlite3
import os
from robyn import jsonify 
from dotenv import load_dotenv

load_dotenv()
DB_LINK = os.getenv("DB_LINK")

def delete_product(product_id):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
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


def delete_store_product(product_id):
     conn = None
     try:
         conn = sqlite3.connect('./database/supermarket.db')
         cursor = conn.cursor()
 
         # перевірка на те, чи існує продукт у таблиці product
         cursor.execute('''
             SELECT id_product FROM store_product WHERE id_product = ?
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

             

def delete_category(category_number):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
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

def delete_customer(card_number):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            DELETE FROM customer_card WHERE card_number = :card_number
        ''', {'card_number': card_number})

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
                "message": f"Customer {card_number} deleted successfully"
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

#EMPLOYEES
def delete_employee(employee_id):
    conn = None
    try:
        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id_employee FROM employee WHERE id_employee = ?
        ''', (employee_id,))
        employee_exists = cursor.fetchone()

        if not employee_exists:
            return {
                "status_code": 404,
                "body": jsonify({"data": "Employee not found"}),
                "headers": {"Content-Type": "application/json"}
            }

        cursor.execute('''
            DELETE FROM employee WHERE id_employee = ?
        ''', (employee_id,))

        conn.commit()

        return {
            "status_code": 200,
            "body": jsonify({"data": "Employee deleted successfully"}),
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