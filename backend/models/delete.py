
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


def delete_category(category_number):
    conn = None
    try:
        conn = sqlite3.connect('./database/supermarket.db')
        cursor = conn.cursor()

        # перевірка на те, чи існує продукт у таблиці category
        cursor.execute('''
            SELECT category_number FROM category WHERE category_number = ?
        ''', (category_number,))
        category_exists = cursor.fetchone()

        if not category_exists:
            return {
                "status_code": 404,
                "body": jsonify({"data": "Product not found"}),
                "headers": {"Content-Type": "application/json"}
            }
        cursor.execute('''
            DELETE FROM category
            WHERE category_number = ?
        ''', (category_number,))

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


         