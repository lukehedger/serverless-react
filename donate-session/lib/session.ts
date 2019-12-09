import {
  BatchWriteItemCommand,
  DynamoDBClient
} from "@aws-sdk/client-dynamodb-node";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler
} from "aws-lambda";
import * as cuid from "cuid";

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (event.body) {
      const dynamoDB = new DynamoDBClient({ region: "eu-west-2" });

      const sessionID = cuid();

      const batchWriteItemInput = {
        RequestItems: {
          [`${process.env.PRIMARY_KEY}`]: sessionID,
          ...JSON.parse(event.body)
        },
        TableName: process.env.TABLE_NAME
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
