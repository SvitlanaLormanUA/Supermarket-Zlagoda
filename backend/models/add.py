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
        # Зверни увагу на назви!!!
        card_number = customer_data.get('card_number')
        surname = customer_data.get('cust_surname')
        name = customer_data.get('cust_name')
        patronymic = customer_data.get('cust_patronymic')
        phone = customer_data.get('phone_number')
        city = customer_data.get('city')
        street = customer_data.get('street')
        zip_code = customer_data.get('zip_code')
        percent = customer_data.get('percent')


        conn = sqlite3.connect(DB_LINK)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO customer_card (
                card_number, cust_surname, cust_name, cust_patronymic, 
                phone_number, city, street, zip_code, percent
            ) VALUES (
                :card_number, :surname, :name, :patronymic, 
                :phone, :city, :street, :zip, :percent
            )
        ''', {
            'card_number': card_number,
            'surname': surname,
            'name': name,
            'patronymic': patronymic,
            'phone': phone,
            'city': city,
            'street': street,
            'zip': zip_code,
            'percent': percent
        })

        conn.commit()

        return {
            "status_code": 201,
            "body": jsonify({
                "status": "success",
                "message": f"Customer {card_number} added successfully"
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