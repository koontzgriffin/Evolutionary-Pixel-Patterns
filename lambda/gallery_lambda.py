import boto3
import base64
import json
from decimal import Decimal

print('Loading function')

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return str(o)
        return super(DecimalEncoder, self).default(o)

def lambda_handler(event, context):
    print(event)
    dynamo = boto3.resource('dynamodb')
    table = dynamo.Table('PatternGallery')

    method = event['httpMethod']

    if method == 'GET':
        # Get all items from the DB
        print('Processing GET request...')
        response = table.scan()
        # Convert Decimal objects to string
        serialized_items = json.dumps(response['Items'], cls=DecimalEncoder)
        return {
            'statusCode': 200,
            'body': serialized_items,
            'headers': {
                'Content-Type': 'application/json'
            }
        }
    elif method == 'POST':
        # Create a new item in the DB
        body = event['body']
        if event['isBase64Encoded']:
            body = base64.b64decode(body).decode('utf-8')
        payload = json.loads(body)
        print(f'Processing POST request for object\nbody={payload}')
        response = table.put_item(Item=payload)
        print('processed.')
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Item added successfully'}),
            'headers': {
                'Content-Type': 'application/json'
            }
        }
    else:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Unsupported method "{}"'.format(method)}),
            'headers': {
                'Content-Type': 'application/json'
            }
        }
