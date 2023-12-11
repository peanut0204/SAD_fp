from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import psycopg2

# Connect to PostgreSQL and fetch data
with open('db_password.txt', 'r') as file:
	db_password = file.read().strip()
dbname = 'dbms_fp'	


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

#This is an example api of how to return data frame 
@app.route('/api/generate_dataframe', methods=['POST'])
def generate_dataframe():
	# Get parameters from the JSON request data
	data = request.get_json()
	print("data: ",data) #可以多把資料印出來看看比較好操作
	'''
	data:  {'numbers': [1, 2, 3, 4, 5]}
	'''
	print("data['numbers']: ", data['numbers'])
	'''
	data['numbers']:  [1, 2, 3, 4, 5]
	'''
	# Process the data and create a DataFrame
	dataframe_data = {'numbers': data['numbers']}
	df = pd.DataFrame(dataframe_data)
	print(df)
	# Convert DataFrame to JSON and return
	return df.to_json(orient='records')

# Login
@app.route('/api/login', methods=['POST'])
def login():
	
	# Get parameters from the JSON request data
	data = request.get_json()

	# Extract account and password from the request data
	account = data.get('account')
	password = data.get('password')

	# Validate if account and password are present in the request
	if not account or not password:
		return jsonify({'success': False, 'message': 'Account and password are required'}), 400

	# Fetch data from the database using a prepared statement to prevent SQL injection
	try:
		psql_conn = psycopg2.connect("dbname='"+dbname+"' user='postgres' host='localhost' password=" + db_password) 
		query = "SELECT m.member_id, r.role FROM member AS m JOIN member_role AS r ON m.member_id=r.member_id WHERE m.account='"+account+"' AND m.password='"+password+"'"
		df = pd.read_sql_query(query, psql_conn)
		psql_conn.close()
		# with psql_conn.cursor() as cursor:
		# 	cursor.execute("SELECT member_id, status FROM member AS m JOIN member_role AS r ON m.member_id=r.member_id WHERE m.account=%s AND m.password=%s", (account, password))
		# 	result = cursor.fetchone()

		if not df.empty:
			if 'Admin' in df['role'].values:				
				identity = 'Admin'
			else:
				identity = 'User'
			return jsonify({'success': True, 'memberId': df['member_id'][0], 'identity': identity})
		else:
			return jsonify({'success': False, 'message': 'Login failed. Invalid account or password'})

	except Exception as e:
		print("Error during login:", str(e))
		return jsonify({'success': False, 'message': 'An error occurred during login'}), 500

if __name__ == '__main__':
	app.run(debug=True)
