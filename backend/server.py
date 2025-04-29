
from robyn import Robyn, jsonify, ALLOW_CORS
from robyn.exceptions import HTTPException
from auth.crud import create_user, authenticate_user, get_employee_id, blacklist_token
from robyn.authentication import BearerGetter
from auth.auth_middleware import roles_required, RoleBasedAuthHandler
from models import (
    get_receipts_by_date,
    get_active_cashiers_with_receipts,
    get_all_products,
    get_product_by_name,
    get_all_store_products,
    get_all_categories,
    get_products_by_category,
    get_product_info,
    get_customer_info_ordered,
    get_customers_by_name_surname,
    get_customers_by_percent,
    get_total_price,
    get_total_quantity,
    get_store_products_by_UPC,
    get_total_quantity,
    get_promotional_products,
    get_non_promotional_products,
    get_products_info,
    get_sorted_products_in_store,
    get_sorted_categories,
    get_sorted_products,
    get_cashier_receipt_history,
    get_total_sales_by_cashier,  
    get_total_quantity_product,  
    get_employee_info_by_id,

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

    get_all_employees,
    get_employee_by_id,
    get_employee_by_surname,
    get_cashiers,
    add_new_employee,
    delete_employee,
    update_employee,
)

import json
from dotenv import load_dotenv
load_dotenv()

app = Robyn(__file__)

PORT = 8000

ALLOW_CORS(app, origins="*")
app.configure_authentication(RoleBasedAuthHandler(token_getter=BearerGetter()))

@app.get("/products", auth_required=True)
async def get_products(request):
    return get_all_products()

@app.get("/products/search/:product_name", auth_required=True)
async def get_all_products_by_name(request):
    name = request.path_params.get("product_name")
    return get_product_by_name(name)

@app.get("/products/:id", auth_required=True)
async def get_product(request):
    product_id = request.path_params.get("id")
    return get_product_info(product_id)

@app.patch("/products/:id")
@roles_required(["Manager"])
async def upd_product(request):
    product_id = request.path_params.get("id")
    product_data = json.loads(request.body)
    return update_product(product_id, product_data)

@app.delete("/products/:id")
@roles_required(["Manager"])
async def del_product(request):
    product_id = request.path_params.get("id")
    return delete_product(product_id)

@app.post("/products/new_product")
@roles_required(["Manager"])
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
    
@app.get("/products/sort/:field/:order", auth_required=True)
def sort_products(req):
    field = req.path_params["field"]
    order = req.path_params["order"]

    result = get_sorted_products(field, order)
    return jsonify(result)    
    
@app.get("/products/category/:category_id", auth_required=True)
async def get_products_by_category_route(request):
    category_id = request.path_params.get("category_id")
    return get_products_by_category(category_id)
 

# Products In Store
@app.get("/products-in-store", auth_required=True)
async def get_store_products(request):
    discount = request.query_params.get("discount") 
    if discount == "true":  
        return get_promotional_products()
    elif discount == "false":
        return get_non_promotional_products()
    else: 
     return get_all_store_products()  
    
@app.get("/product-by-ID", auth_required=True)
async def get_products_information(request):
    return get_products_info()

@app.get("/products-in-store/search/:UPC", auth_required=True)
async def get_all_store_products_by_UPC(request):
    UPC = request.path_params.get("UPC")
    return get_store_products_by_UPC(UPC)

@app.patch("/products-in-store/:id")
@roles_required(["Manager"])
async def upd_store_product(request):
    product_id = request.path_params.get("id")
    product_data = json.loads(request.body)
    return update_store_product(product_id, product_data)
 
@app.post("/products-in-store/new_product")
@roles_required(["Manager"])
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
    
@app.delete("/products-in-store/:id", auth_required=True)
@roles_required(["Manager"])
async def del_store_product(request):
    product_id = request.path_params.get("id")
    return delete_store_product(product_id)   
 
@app.get("/products-in-store/total_price", auth_required=True)
async def total_price(request):
    return get_total_price()
 
@app.get("/products-in-store/total_quantity", auth_required=True)
async def total_quantity(request):
    return get_total_quantity()


@app.get("/products-in-store/sort/:field/:order", auth_required=True)
def sort_store_products(req):
    field = req.path_params["field"]
    order = req.path_params["order"]
    discount_filter = req.query_params.get("discount")

    result = get_sorted_products_in_store(field, order, discount_filter)
    return jsonify(result)


# Categories
@app.get("/categories", auth_required=True)
async def get_categories(request):
    return get_all_categories()

@app.get("/categories/sort/:field/:order", auth_required=True)
def sort_categories(req):
    field = req.path_params["field"]
    order = req.path_params["order"]

    result = get_sorted_categories(field, order)
    return jsonify(result)


@app.patch("/categories/:id", auth_required=True)
@roles_required(["Manager"])
async def upd_category(request):
    category_number = request.path_params.get("id")
    category_data = json.loads(request.body)
    return update_category(category_number, category_data)
 
@app.post("/categories")
@roles_required(["Manager"])
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
@roles_required(["Manager"])
async def del_category(request):
    category_number = request.path_params.get("id")
    return delete_category(category_number)  

@app.post("/products/category/new_category")
@roles_required(["Manager"])
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
@app.get("/customers-card", auth_required=True)
async def get_customers_cards(request):
    percent = request.query_params.get("percent")
    sort = request.query_params.get("sort", "asc")

    if percent is not None:
        try:
            percent = int(percent)
        except ValueError:
            return jsonify({"error": "Invalid percent value"}), 400
        return get_customers_by_percent(percent, sort)
    
    return get_customer_info_ordered()

@app.get("/customers-card/search", auth_required=True)
async def search_customers(request):
    name = request.query_params.get("name")
    surname = request.query_params.get("surname")
    return get_customers_by_name_surname(name, surname)

@app.post("/customers-card/new_customer", auth_required=True)
async def add_new_customer(request):
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

@app.patch("/customers-card/:card_number", auth_required=True)
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

# Receipts
@app.get("/receipts", auth_required=True)
@roles_required(["Manager"])
async def get_all_receipts_history(request):
    date_created = request.path_params["date_cr"]
    if date_created is not None:
        get_active_cashiers_with_receipts(date_created)
    return get_cashier_receipt_history()

@app.get("/receipts/:id_employee", auth_required=True)
@roles_required(["Manager"])
async def get_receipts_by_cashier(request):
    id_employee = request.path_params["id_employee"]  
    return get_cashier_receipt_history(id_employee)

# Receipts - complicated queries 
@app.get("/sales/cashier", auth_required=True)
@roles_required(["Manager"])
async def get_sales_by_cashier(request):
    id_employee = request.query_params.get("id_employee")
    start_date = request.query_params.get("start_date")
    end_date = request.query_params.get("end_date")
    
    if not id_employee or not start_date or not end_date:
        return {
            "status_code": 400,
            "body": {"message": "id_employee, start_date, and end_date are required"},
            "headers": {"Content-Type": "application/json"}
        }
    
    return get_total_sales_by_cashier(id_employee, start_date, end_date)


@app.get("/sales/product", auth_required=True)
@roles_required(["Manager"])
async def get_quantity_of_product(request):
    product_id = request.query_params.get("product_id")
    start_date = request.query_params.get("start_date")
    end_date = request.query_params.get("end_date")

    if not product_id or not start_date or not end_date:
        return {
            "status_code": 400,
            "body": {"message": "product_id, start_date, and end_date are required"},
            "headers": {"Content-Type": "application/json"}
        }
    
    return get_total_quantity_product(product_id, start_date, end_date)



# Employees
# вони тут вже відсортовані за прізвищем
@app.get("/employees", auth_required=True)
@roles_required(["Manager"])
async def get_employees(request):
    return get_all_employees()

@app.get("/employee-by-ID", auth_required=True)
@roles_required(["Manager"])
async def get_empl_by_id(request):
    return get_employee_by_id()


@app.get("/employees/cashiers")
@roles_required(["Manager"])
async def fetch_cashiers(request):
    return get_cashiers()

@app.get("/employees/search")
@roles_required(["Manager"])
async def fetch_employee_by_surname(request):
    surname = request.path_params["surname"]  
    return get_employee_by_surname(surname)

@app.post("/employees/new_employee", auth_required=True)
@roles_required(["Manager"])
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
@roles_required(["Manager"])
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

@app.delete("/employees/:id", auth_required=True)
@roles_required(["Manager"])
async def delete_employee_route(request):
    employee_id = request.path_params.get("id")
    return delete_employee(employee_id)


# authentication / authorization
@app.post("/employees/register", auth_required=True)
@roles_required(["Manager"])
async def register_user(request):
    try:
        data = json.loads(request.body)
        
        required_fields = [
            "empl_surname", "empl_name",
            "empl_role",
            "email", "password"
        ]
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing required field: {field}")

        # перевірка на те, чи такий співробітник існує
        employee_id = get_employee_id(
            surname=data["empl_surname"],
            name=data["empl_name"],
            role=data["empl_role"]
        )
        
        if not employee_id:
            raise ValueError("Employee not found in HR records")

        user = create_user(
            employee_id=employee_id,
            email=data["email"],
            password=data["password"]
        )
        
        return jsonify({
            "account_id": user.account_id,
            "employee_id": user.employee_id,
            "email": user.email,
            "is_active": user.is_active
        })
        
    except json.JSONDecodeError:
        raise HTTPException(400, "Invalid JSON")
    except ValueError as e:
        raise HTTPException(400, str(e))

@app.post("/login")
async def login_user(request):
    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            raise ValueError("Email and password are required")
            
        token = authenticate_user(email=email, password=password)
        
        if token is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        #decoded = jwt.decode(token, options={"verify_signature": False})
        return jsonify({"access_token": token})
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/logout")
async def logout_user(request):
    auth_header = request.headers.get("authorization")
    if not auth_header.startswith("Bearer "):
        return {
            "status_code": 401,
            "body": {"detail": "Invalid authorization header"},
            "headers": {"WWW-Authenticate": "Bearer"}
        }
    
    token = auth_header.split(" ")[1]
    blacklist_token(token)
    
    return {
        "status_code": 200,
        "body": {"message": "Successfully logged out"},
        "headers": {"Content-Type": "application/json"}
    }

@app.get("/users/me", auth_required=True)
async def get_current_user(request):
    user_id = request.identity.claims["userId"]
    return get_employee_info_by_id(user_id)


app.start(port=PORT, host="127.0.0.1")
