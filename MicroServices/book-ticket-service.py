import json
import boto3
import time
import os

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
sqs = boto3.client('sqs')

# Environment variables for AWS resources
BOOKING_TABLE = 'Tickets'
BOOKING_QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/your-id/BookingQueue'

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])

        email = body['email']
        flight_id = body['flightId']
        journey_date = body['journeyDate']
        number_of_passengers = body['numberOfPassengers']
        coach_type = body['coachType']
        total_price = body['totalPrice']
        passengers = body['passengers']

        # Generate unique booking ID
        booking_id = f"BOOK-{int(time.time())}"

        booking_data = {
            'ticket_id': booking_id,  # Ensure it matches the primary key in DynamoDB
            'email': email,
            'flightId': flight_id,
            'journeyDate': journey_date,
            'numberOfPassengers': number_of_passengers,
            'coachType': coach_type,
            'totalPrice': total_price,
            'passengers': passengers
        }

        # Save booking to DynamoDB
        table = dynamodb.Table(BOOKING_TABLE)
        table.put_item(Item=booking_data)

        # Send booking confirmation to SQS
        response = sqs.send_message(
        QueueUrl=BOOKING_QUEUE_URL,
        MessageBody=json.dumps(booking_data)
        )

        print("SQS Response:", response)  # Debugging output


        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Booking successful", "bookingId": booking_id})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

