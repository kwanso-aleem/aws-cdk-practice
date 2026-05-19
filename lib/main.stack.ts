import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { IamStack } from './iam.stack';

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new IamStack(this, 'IamStack');
  }
}
