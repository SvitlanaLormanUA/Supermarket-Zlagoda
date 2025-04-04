from robyn import Robyn, jsonify
from models import (
    get_all_store_products,
    get_all_categories,
    get_products_by_category,
    get_product_info,  
    get_total_price,
    get_total_quantity,
    get_all_customer_cards,
    add_new_product,
    add_new_category,
    delete_product,
    delete_category,
    update_product,
  
)
import json
from cors import setup_cors  

app = Robyn(__file__)
PORT = 5174


setup_cors(app)


@app.get("/products")
async def get_products():
    return get_all_store_products()

@app.get("/categories")
async def get_categories():
    return get_all_categories()

@app.get("/products/:id")
async def get_product(request):
    product_id = request.path_params.get("id")
    return get_product_info(product_id)

@app.patch("/products/:id")
async def upd_product(request):
    product_id = request.path_params.get("id")
    product_data = json.loads(request.body)
    return update_product(product_id, product_data)

@app.delete("/products/:id")
async def del_product(request):
    product_id = request.path_params.get("id")
    return delete_product(product_id)

@app.post("/products/new_product")
async def add_product(request):
    try:
        product_data = json.loads(request.body)
        return add_new_product(product_data)
    except json.JSONDecodeError:
        return {
            "status_code": 400,
            "body": jsonify({"data": "Invalid JSON format"}),
            "headers": {"Content-Type": "application/json"},
        }

@app.get("/products/total_price")
async def total_price():
    return get_total_price()

@app.get("/products/total_quantity")
async def total_quantity():
    return get_total_quantity()

@app.get("/products/category/:category_id")
async def get_products_by_category_route(request):
    category_id = request.path_params.get("category_id")
    return get_products_by_category(category_id)


@app.get("/customers-card")
async def get_customers_cards():
    return get_all_customer_cards()

@app.post("/products/category/new_category")
async def add_category(request):
    try:
        category_data = json.loads(request.body)
        return add_new_category(category_data)
    except json.JSONDecodeError:
        return {
            "status_code": 400,
            "body": jsonify({"data": "Invalid JSON format"}),
            "headers": {"Content-Type": "application/json"},
        }

@app.delete("/categories/:id")
async def del_category(request):
    category_number = request.path_params.get("id")
    return delete_category(category_number)           

app.start(port=PORT, host="127.0.0.1")