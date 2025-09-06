from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import base64
import tempfile
from backend.gemini import process_query
import os

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

@app.route("/")
def splash():
    return render_template("splash.html")

@app.route("/app")
def app_page():
    return render_template("index.html")

@app.route('/submit_query', methods=['POST'])
def submit_query():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"response": "No data received"}), 400

        user_query = data.get('query', '')
        frame = data.get('frame', '')

        if not frame:
            return jsonify({"response": "No frame provided"}), 400

        header, encoded = frame.split(',', 1)
        decoded = base64.b64decode(encoded)

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
            f.write(decoded)
            f.flush()
            response = process_query(f.name, user_query)

        os.remove(f.name) 

        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"response": "Server error occurred."}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
