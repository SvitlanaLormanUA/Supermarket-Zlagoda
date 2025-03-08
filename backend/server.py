from robyn import Robyn
from models import get_all_store_products

app = Robyn(__file__)

PORT = 3000


# сервер повертає 
@app.get("/products")
def get_products():
    response = get_all_store_products()
    return response["body"]

app.start(port=PORT, host="127.0.0.1") 

