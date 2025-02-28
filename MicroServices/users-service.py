import json
import boto3

# Initialize DynamoDB client
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Users") 

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        action = body.get("action")
        email = body.get("email")
        password = body.get("password")
        username = body.get("username")

        if not email or not password:
            return generate_response(400, {"error": "Email and password are required"})

        if action == "register":
            return register_user(email, password, username)
        elif action == "login":
            return login_user(email, password)
        else:
            return generate_response(400, {"error": "Invalid action"})
    
    except Exception as e:
        return generate_response(500, {"error": str(e)})

def register_user(email, password, username):
    try:
        table.put_item(
            Item={
                "email": email,
                "password": password, 
                "username": username
            }
        )
        return generate_response(200, {"message": "User registered successfully"})
    except Exception as e:
        return generate_response(500, {"error": str(e)})

def login_user(email, password):
    try:
        response = table.get_item(Key={"email": email})
        user = response.get("Item")

        if user and user.get("password") == password:
            return generate_response(200, {"message": "Login successful", "username": user["username"]})
        else:
            return generate_response(401, {"error": "Invalid credentials"})
    
    except Exception as e:
        return generate_response(500, {"error": str(e)})

def generate_response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",  # Enable CORS
            "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
        "body": json.dumps(body)
    }
