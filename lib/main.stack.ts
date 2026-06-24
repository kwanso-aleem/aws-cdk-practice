import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { EC2Stack } from "./ec2.stack";

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new EC2Stack(this, "EC2Stack");
  }
}
