# Linebot Setup Guideline
**Author: Buffett**

This guide provides step-by-step instructions for downloading, installing, and setting up ngrok, which is necessary for exposing your local development server to the internet.

## Table of Contents
- [Step 1: Download ngrok](#step-1-download-ngrok)
- [Step 2: Install ngrok](#step-2-install-ngrok)
  - [On Windows](#on-windows)
  - [On macOS](#on-macos)
  - [On Linux](#on-linux)
- [Step 3: Authenticate Your ngrok Account](#step-3-authenticate-your-ngrok-account)
- [Step 4: Start Using ngrok](#step-4-start-using-ngrok)
- [Running Python Codes](#running-python-codes)

## Step 1: Download ngrok
1. Go to the [ngrok download page](https://ngrok.com/download).
2. Download the version for your operating system (Windows, macOS, or Linux).

## Step 2: Install ngrok

### On Windows
1. Download the ZIP file.
2. Extract the ZIP file.
3. Move the `ngrok.exe` file to a directory of your choice (e.g., `C:\ngrok`).

### On macOS
1. Open Terminal.
2. Install using Homebrew:

    ```sh
    brew install --cask ngrok
    ```

### On Linux
1. Download the TAR file.
2. Extract the TAR file:

    ```sh
    tar -xvf /path/to/ngrok-stable-linux-amd64.tar.gz
    ```

3. Move the `ngrok` binary to `/usr/local/bin` or another directory in your PATH:

    ```sh
    sudo mv ngrok /usr/local/bin
    ```

## Step 3: Authenticate Your ngrok Account
1. Sign up for an ngrok account at the [ngrok signup page](https://dashboard.ngrok.com/signup).
2. Log in to your account.
3. Copy your authentication token from the [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken).
4. Run the following command in your terminal or command prompt, replacing `YOUR_AUTH_TOKEN` with the token you copied:

    ```sh
    ngrok authtoken YOUR_AUTH_TOKEN
    ```

## Step 4: Start Using ngrok
To start an ngrok tunnel, run the following command (replace `PORT` with the port number your application is running on, e.g., `5000` for a Flask app):

```sh
ngrok http http://127.0.0.1:5000
```
<br>

# Running python codes
Before running python codes, please install some packages by running
```sh
pip install -r requirements.txt
```

After that, you can run
```sh
python ShoppingGO3.py
```
Note: Remember to start ngrok first!