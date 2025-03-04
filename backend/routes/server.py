from robyn import Robyn

app = Robyn(__file__)

PORT = 3000

@app.get("/")
def h():
    return "Hello, world"

app.start(port=PORT, host="0.0.0.0") 
