import json
import boto3
import logging

# Initialize AWS clients
sqs = boto3.client('sqs')
sns = boto3.client('sns')

# Replace with actual AWS resource details
BOOKING_QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/your-id/BookingQueue"
BOOKING_CONFIRMATION_TOPIC_ARN = "arn:aws:sns:us-east-1::your-id:BookingConfirmationTopic"

# Logging setup
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        # Receive messages from SQS
        response = sqs.receive_message(
            QueueUrl=BOOKING_QUEUE_URL,
            MaxNumberOfMessages=5,
            WaitTimeSeconds=5,
            VisibilityTimeout=60  # Ensure message stays invisible while processing
        )

        if 'Messages' not in response:
            logger.info("No messages to process")
            return {"statusCode": 200, "body": "No messages to process"}

        for message in response['Messages']:
            try:
                booking_data = json.loads(message['Body'])
                email = booking_data.get('email', 'N/A')
                booking_id = booking_data.get('ticket_id', 'Unknown')
                flight_id = booking_data.get('flightId', 'Unknown')
                journey_date = booking_data.get('journeyDate', 'Unknown')
                total_price = booking_data.get('totalPrice', 'Unknown')

                # Send booking confirmation via SNS
                sns.publish(
                    TopicArn=BOOKING_CONFIRMATION_TOPIC_ARN,
                    Subject="Flight Booking Confirmation",
                    Message=f"Your flight booking (ID: {booking_id}) for Flight {flight_id} on {journey_date} is confirmed. Total price: ${total_price}."
                )

                # Delete processed message from SQS to avoid duplicates
                sqs.delete_message(
                    QueueUrl=BOOKING_QUEUE_URL,
                    ReceiptHandle=message['ReceiptHandle']
                )
                logger.info(f"Processed & deleted message: {message['MessageId']}")

            except Exception as e:
                logger.error(f"Failed to process message {message['MessageId']}: {e}")

        return {"statusCode": 200, "body": "Booking confirmations sent successfully"}

    except Exception as e:
        logger.error(f"Lambda error: {e}")
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
