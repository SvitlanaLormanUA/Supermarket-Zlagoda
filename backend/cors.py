from robyn import Robyn


def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"  
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, DELETE, OPTIONS" 
    response.headers["Access-Control-Allow-Headers"] = "Content-Type" 
    return response

# Preflight handlers for OPTIONS requests
def setup_cors(app: Robyn):
    @app.after_request()
    async def cors_handler(response):
        return add_cors_headers(response)

    @app.options("/products")
    async def handle_preflight():
        return {
            "status_code": 204,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": "",
        }

    @app.options("/products/:id")
    async def handle_preflight_id():
        return {
            "status_code": 204,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:3000",  
                "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": "",
        }

    @app.options("/products/new_product")
    async def handle_preflight_new_product():
        return {
            "status_code": 204,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": "",
        }