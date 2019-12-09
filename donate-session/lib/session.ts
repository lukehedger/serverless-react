import {
  BatchWriteItemCommand,
  DynamoDBClient
} from "@aws-sdk/client-dynamodb-node";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler
} from "aws-lambda";
import cuid from "cuid";

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (event.body) {
      const dynamoDB = new DynamoDBClient({ region: "eu-west-2" });

      const sessionID = cuid();

      // TODO: Implement event.body to DynamoDB key/value parsing

      const batchWriteItemInput = {
        RequestItems: {
          [`${process.env.TABLE_NAME}`]: [
            {
              PutRequest: {
                Item: {
                  [`${process.env.PRIMARY_KEY}`]: {
                    S: sessionID
                  }
                }
              }
            }
          ]
        }
      };

      const batchWriteItemCommand = new BatchWriteItemCommand(
        batchWriteItemInput
      );

      await dynamoDB.send(batchWriteItemCommand);

      return {
        body: JSON.stringify({ sessionID: sessionID }),
        headers: {
          "Content-Type": "application/json"
        },
        statusCode: 200
      };
    } else {
      throw new Error("Request body is empty");
    }
  } catch (error) {
    return {
      body: JSON.stringify(error),
      headers: {
        "Content-Type": "application/json"
      },
      statusCode: 500
    };
  }
};
