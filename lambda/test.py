import requests
import json

# Define the API Gateway endpoint URL
api_url = "https://apb0tdhoch.execute-api.us-east-2.amazonaws.com/default/EVPP-GalleryAPI"

# Define the DynamoDB table name
table_name = "PatternGallery"

# Define the item to be put into the DynamoDB table
payload = {
    "patternId": "bobington",
    "title": "Item 3",
    "description": "Description for Item 3",
    "canvasId": "canvas1",
    "settings": {
        "activeColor": "#000000",
        "inactiveColor": "#00000",
        "columns": 10,
        "maxIterations": 50,
        "populationSize": 1000,
        "mutationRate": 50,
        "crossoverRate": 50,
        "constraints": [],
        "inactiveNeighborhoods": [],
        "activeNeighborhoods": []
    },
    "grid": [[]]
}

# Convert the item to JSON
json_payload = json.dumps(payload)

# Make the PUT request with the payload in the request body
response = requests.post(api_url, data=json_payload)

# Print the response
print("POST Test:")
print(response.status_code)
print(response.json())  # If the response is JSON

response = requests.get(api_url)
print("GET test")
print(response.status_code)
print(response.json())  # If the response is JSON