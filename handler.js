const { DynamoDBClient, PutItemCommand, ScanCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');

// Skapa en ny DynamoDB-klient
const dynamoDbClient = new DynamoDBClient({ region: 'eu-north-1' });

const TableName = process.env.DYNAMODB_TABLE;

// Exportera alla funktioner individuellt
exports.handler = async (event) => {
  const allowedOrigins = ['http://localhost:3000', 'http://my-message-board-bucket.s3-website.eu-north-1.amazonaws.com'];
  const origin = event.headers.origin;

  // Grundläggande CORS headers
  const headers = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
  };

  // Hantera CORS preflight-begäran
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ message: "CORS preflight check successful" }),
    };
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        return await getMessages();
      case 'POST':
        return await createMessage(event);
      case 'PUT':
        return await updateMessage(event);
      default:
        return {
          statusCode: 405,
          headers: headers,
          body: JSON.stringify({ message: `Method ${event.httpMethod} not allowed` }),
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};

// Skapa ett nytt meddelande
async function createMessage(event) {
  const { username, text } = JSON.parse(event.body);
  const id = uuidv4();
  const createdAt = Date.now();

  const params = {
    TableName,
    Item: {
      id: { S: id },
      username: { S: username },
      text: { S: text },
      createdAt: { N: createdAt.toString() },
    },
  };

  try {
    await dynamoDbClient.send(new PutItemCommand(params));
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: 'Could not create message', details: error.message }),
    };
  }
}

// Hämta alla meddelanden
async function getMessages() {
  const params = {
    TableName,
  };

  try {
    // Använd ScanCommand för att hämta alla objekt i tabellen
    const result = await dynamoDbClient.send(new ScanCommand(params));
    console.log("Scan result:", JSON.stringify(result, null, 2));
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error("Error fetching messages:", JSON.stringify(error, null, 2));
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: 'Could not retrieve messages', details: error.message }),
    };
  }
}

// Uppdatera ett meddelande
async function updateMessage(event) {
  try {
    const { id, createdAt, text } = JSON.parse(event.body);

    // Kontrollera att id, createdAt och text är tillgängliga
    if (!id || !createdAt || !text) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
        },
        body: JSON.stringify({ error: 'Invalid request. ID, createdAt, and text are required.' }),
      };
    }

    const updateParams = {
      TableName,
      Key: { 
        id: { S: id }, 
        createdAt: { N: createdAt.toString() }
      },
      UpdateExpression: 'set #textAttr = :text',
      ExpressionAttributeNames: { 
        '#textAttr': 'text' 
      },
      ExpressionAttributeValues: {
        ':text': { S: text }, 
      },
      ReturnValues: 'ALL_NEW',
    };

    const result = await dynamoDbClient.send(new UpdateItemCommand(updateParams));

    // Returnera uppdaterat objekt
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
      },
      body: JSON.stringify(result.Attributes),
    };

  } catch (error) {
    console.error("Error updating message:", error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
      },
      body: JSON.stringify({ error: 'Could not update message', details: error.message }),
    };
  }
}

module.exports = {
  createMessage,
  getMessages,
  updateMessage
};