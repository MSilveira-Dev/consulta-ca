from flask import Flask, jsonify
from flask_cors import CORS
from ca import consultar_ca  # importe sua função

app = Flask(__name__)
CORS(app)

@app.route("/consulta/<ca>")
def consulta(ca):
    resultado = consultar_ca(ca)
    return jsonify(resultado)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)