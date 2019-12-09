import { LambdaRestApi } from "@aws-cdk/aws-apigateway";
import { AttributeType, Table } from "@aws-cdk/aws-dynamodb";
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { Construct, RemovalPolicy, Stack, StackProps } from "@aws-cdk/core";

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sessionsTable = new Table(this, "SessionsTable", {
      partitionKey: { name: "id", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      tableName: "sessions"
    });

    const sessionHandler = new Function(this, "DonateSessionHandler", {
      code: Code.fromAsset("../donate-session/lib"),
      environment: {
        PRIMARY_KEY: "id",
        TABLE_NAME: sessionsTable.tableName
      },
      handler: "session.handler",
      runtime: Runtime.NODEJS_10_X
    });

    sessionsTable.grantReadWriteData(sessionHandler);

    new LambdaRestApi(this, "DonateSessionEndpoint", {
      handler: sessionHandler
    });
  }
}
