# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/generate_dataframe', methods=['POST'])
def generate_dataframe():
    data = request.get_json()
    # Process the data and create a DataFrame
    dataframe_data = {'numbers': data['numbers']}
    df = pd.DataFrame(dataframe_data)
    # Convert DataFrame to JSON and return
    return df.to_json(orient='records')

if __name__ == '__main__':
    app.run(debug=True)
