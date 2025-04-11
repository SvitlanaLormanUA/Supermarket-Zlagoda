from robyn import Robyn, jsonify, ALLOW_CORS
from models import (
    get_all_store_products,
    get_all_categories,
    get_products_by_category,
    get_product_info,
    get_all_customer_cards,
    get_customer_info_ordered,
    get_customers_by_name_surname,
    get_total_price,
    get_total_quantity,
    get_store_products_by_UPC,
    get_total_price,
    get_total_quantity,

    add_new_category,
    add_new_product,
    add_new_store_product,
    add_new_category,
    add_customer,

    delete_product,
    delete_store_product,
    delete_category,
    delete_customer,

    update_product,
    update_store_product,
    update_category,
    update_customer,
)

import json

app = Robyn(__file__)
PORT = 5174

ALLOW_CORS(app, origins="*")

# Products

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
    
@app.get("/products/category/:category_id")
async def get_products_by_category_route(request):
    category_id = request.path_params.get("category_id")
    return get_products_by_category(category_id)
 


# Products In Store
@app.get("/products-in-store")
async def get_store_products():
    return get_all_store_products()

@app.get("/products-in-store/search/:UPC")
async def get_all_store_products_by_UPC(request):
    UPC = request.path_params.get("UPC")
    return get_store_products_by_UPC(UPC)

@app.patch("/products-in-store/:id")
async def upd_store_product(request):
    product_id = request.path_params.get("id")
    product_data = json.loads(request.body)
    return update_store_product(product_id, product_data)
 
@app.post("/products-in-store/new_product")
async def add_store_product(request):
    try:
        product_data = json.loads(request.body)
        return add_new_store_product(product_data)
    except json.JSONDecodeError:
        return {
            "status_code": 400,
            "body": jsonify({"data": "Invalid JSON format"}),
            "headers": {"Content-Type": "application/json"},
        }   
    
@app.delete("/products-in-store/:id")
async def del_store_product(request):
    product_id = request.path_params.get("id")
    return delete_store_product(product_id)   
 
@app.get("/products-in-store/total_price")
async def total_price():
    return get_total_price()
 
@app.get("/products-in-store/total_quantity")
async def total_quantity():
    return get_total_quantity()


# Categories
@app.get("/categories")
async def get_categories():
    return get_all_categories()

@app.patch("/categories/:id")
async def upd_category(request):
    category_number = request.path_params.get("id")
    category_data = json.loads(request.body)
    return update_category(category_number, category_data)
 
@app.post("/categories")
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
 

# Customers Card
@app.get("/customers-card")
async def get_customers_cards():
    return get_customer_info_ordered()

@app.get("/customers-card/search")
async def search_customers(request):
    name = request.query_params.get("name")
    surname = request.query_params.get("surname")
    return get_customers_by_name_surname(name, surname)

@app.post("/customers-card/new_customer")
async def add_customer(request):
    try:
        customer_data = json.loads(request.body)
        return add_customer(customer_data)
    except json.JSONDecodeError:
        return {
            "status_code": 400,
            "body": jsonify({"data": "Invalid JSON format"}),
            "headers": {"Content-Type": "application/json"},
        }
    
@app.delete("/customers-card/:card_number")
async def del_customer(request):
    card_number = request.path_params.get("card_number")
    return delete_customer(card_number)

@app.patch("/customers-card/:card_number")
async def update_customer_route(request):
    try:
        update_data = json.loads(request.body)
        card_number = request.path_params.get("card_number")
        return update_customer(card_number, update_data)
    except json.JSONDecodeError:
        return {
            "status_code": 400,
            "body": jsonify({
                "status": "error",
                "message": "Invalid JSON format"
            }),
            "headers": {"Content-Type": "application/json"}
        }

app.start(port=PORT, host="127.0.0.1")


