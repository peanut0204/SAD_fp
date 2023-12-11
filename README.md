# Good Book Sharing

> frontend: React, Tailwind

> backend: Flask, Python


## To set up database
Create ```db_password.txt``` and write your password in the file.

Change database name in ```app.py```
```
dbname = <your database name>
```

## To start the Website



### Go to frontend

```
cd frontend
```

Open the frontend...

```
npm start
```

the website runs on http://localhost:3000/

---

### Go to backend

```
cd backend
```
create venv (for windows)

```
py -m venv venv
```

activate venv (for windows)

```
.\venv\Scripts\activate.ps1   
```
install requirements

```
pip install -r requirements.txt
```

run flask

```
python app.py
```

and the server would runs on port http://127.0.0.1:5000/

<i>The CORS policy is dealt by using vite proxy</i>
