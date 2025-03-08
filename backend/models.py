import sqlite3
import json
def get_all_store_products():
    try:
        conn = sqlite3.connect('database/supermarket.db')
        cursor = conn.cursor()

        cursor.execute('''
            SELECT sp.id, p.name, sp.price, sp.quantity, sp.discount
            FROM store_products sp
            JOIN products p ON sp.product_id = p.id
        ''')

        products = cursor.fetchall()
        conn.close()

        if not products:
            return json.dumps({"error": "No products found"}, ensure_ascii=False)

        product_list = [
            {"id": row[0], "name": row[1], "price": row[2], "quantity": row[3], "discount": row[4]}
            for row in products
        ]

        return json.dumps(product_list, ensure_ascii=False)
    except sqlite3.Error as e:
        return json.dumps({"error": str(e)}, ensure_ascii=False)