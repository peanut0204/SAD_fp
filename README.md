# Good Book Sharing Web App

> frontend: React, Tailwind

> backend: Flask, Python

## Project Overview
(NULL)

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
install dependencies
```
npm i
```
start the application

```
npm start
```

the website runs on http://localhost:3000/

---

### Go to backend

```
cd backend
```
create venv

```
py -m venv venv   # for Windows
python3 -m venv venv   # for macOS
```

activate venv

```
.\venv\Scripts\activate.ps1   # for Windows
source venv/bin/activate   # for macOS
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

## Example
進入「好書 Sharing」平台時，一開始是登入畫面。
![Login Page](./screenshot/1_login.png)
按下註冊按鈕，在註冊畫面進行註冊。
![Register Page](./screenshot/2_register.png)
接下來登入後會自動導向至 My Page，即可開始探索「好書 Sharing」平台。
![My Page](./screenshot/3_myPage.png)
以「搜尋書籍」的功能為例，可以在上方的選單列進入 Search Book 畫面，開始找書。
![Search Book Page](./screenshot/4_searchBook.png)