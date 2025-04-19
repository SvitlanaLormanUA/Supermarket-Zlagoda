from robyn import Robyn, jsonify, ALLOW_CORS
from models import (
    get_all_store_products,
    get_all_categories,
    get_products_by_category,
    get_product_info,
    get_customer_info_ordered,
    get_customers_by_name_surname,
    get_total_price,
    get_total_quantity,
    get_store_products_by_UPC,
    get_total_price,
    get_total_quantity,
    get_promotional_products,
    get_non_promotional_products,
    get_products_info,
    get_sorted_products_in_store,
    get_sorted_categories,
    get_all_receipts,
    get_employee_by_id,

    add_new_product,
    add_new_store_product,
    add_new_category,
    add_customer,
    add_new_receipt,

    delete_product,
    delete_store_product,
    delete_category,
    delete_customer,

    update_product,
    update_store_product,
    update_category,
    update_customer,

    get_all_employees,
    get_employee_by_surname,
    get_cashiers,
    add_new_employee,
    delete_employee,
    update_employee,
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
async def get_store_products(request):
    discount = request.query_params.get("discount") 
    if discount == "true":  
        return get_promotional_products()
    elif discount == "false":
        return get_non_promotional_products()
    else: 
     return get_all_store_products()  
    
@app.get("/product-by-ID")
async def get_products_information():
    return get_products_info()

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


@app.get("/products-in-store/sort/:field/:order")
def sort_store_products(req):
    field = req.path_params["field"]
    order = req.path_params["order"]
    discount_filter = req.query_params.get("discount")

    result = get_sorted_products_in_store(field, order, discount_filter)
    return jsonify(result)


# Categories
@app.get("/categories")
async def get_categories():
    return get_all_categories()

@app.get("/categories/sort/:field/:order")
def sort_categories(req):
    field = req.path_params["field"]
    order = req.path_params["order"]

    result = get_sorted_categories(field, order)
    return jsonify(result)


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

# Employees


# вони тут вже відсортовані за прізвищем
@app.get("/employees")
async def get_employees():
    return get_all_employees()

@app.get("/employee-by-ID")
async def get_empl_by_id():
    return get_employee_by_id()

@app.get("/employees/cashiers")
async def fetch_cashiers():
    return get_cashiers()

@app.get("/employees/:surname")
async def fetch_employee_by_surname(request):
    surname = request.path_params["surname"]  
    return get_employee_by_surname(surname)

@app.post("/employees")
async def add_employee(request):
    try:
        employee_data = json.loads(request.body)
        return add_new_employee(employee_data)
    except json.JSONDecodeError:
        return {
            "status_code": 400,
            "body": jsonify({"data": "Invalid JSON format"}),
            "headers": {"Content-Type": "application/json"},
        }

@app.patch("/employees/:id")
async def update_employee_route(request):
    try:
        employee_id = request.path_params.get("id")
        employee_data = json.loads(request.body)
        return update_employee(employee_id, employee_data)
    except json.JSONDecodeError:
        return {
            "status_code": 400,
            "body": jsonify({
                "status": "error",
                "message": "Invalid JSON format"
            }),
            "headers": {"Content-Type": "application/json"}
        }

@app.delete("/employees/:id")
async def delete_employee_route(request):
    employee_id = request.path_params.get("id")
    return delete_employee(employee_id)


# Receipts
@app.get("/receipts")
async def get_receipts():
    return get_all_receipts()


@app.post("/receipts")
async def add_receipt(request):
    try:
        receipt_data = json.loads(request.body)
        return add_new_receipt(receipt_data)
    except json.JSONDecodeError:
        return {
            "status_code": 400,
            "body": jsonify({"data": "Invalid JSON format"}),
            "headers": {"Content-Type": "application/json"},
        }


app.start(port=PORT, host="127.0.0.1")
