import sqlite3
from robyn import jsonify 


# !!! У якому вигляді повертається відповідь:
# "status_code": 200,
#             "body": jsonify({
#                 "data": result,
#             }),
#             "headers": {"Content-Type": "application/json"}

# результат, тобто наші дані -- у "data"
# !!!
def get_all_store_products():
    try:

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
        
        # Fetch all results
        products = cursor.fetchall()
        
        # Format the results
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