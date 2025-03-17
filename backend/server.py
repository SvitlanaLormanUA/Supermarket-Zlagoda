from robyn import Robyn, jsonify
from models import get_all_store_products, get_all_categories, get_product_info, add_new_product, delete_product, update_product, get_total_price, get_total_quantity
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


app.start(port=PORT, host="127.0.0.1")