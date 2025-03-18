from robyn import Robyn

def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

def setup_cors(app: Robyn):
    @app.after_request()
    async def cors_middleware(response):
        return add_cors_headers(response)

    @app.options("/*")
    async def handle_preflight():
        return {
            "status_code": 204,
            "headers": {
                "Access-Control-Allow-Origin": "http://localhost:3000",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": "",
        }