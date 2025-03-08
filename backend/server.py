from robyn import Robyn
from models import get_all_store_products

app = Robyn(__file__)

PORT = 3000

@app.get("/products")
def get_products():
    return get_all_store_products()

app.start(port=PORT, host="127.0.0.1") 

