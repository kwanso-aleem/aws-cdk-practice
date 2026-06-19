import * as cdk from "aws-cdk-lib/core";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class EC2Stack extends cdk.NestedStack {
  constructor(scope: Construct, id: string, props?: cdk.NestedStackProps) {
    super(scope, id, props);

    // create an ec2 instance type
    const instanceType = ec2.InstanceType.of(
      ec2.InstanceClass.T3,
      ec2.InstanceSize.MICRO,
    );

    // choose an Amazon Machine Image (AMI) for the EC2 instance
    const machineImage = ec2.MachineImage.latestAmazonLinux2023({
      // userData
    });

    // use default VPC, which will create a new VPC with public and private subnets across 2 AZs
    const vpc = ec2.Vpc.fromLookup(this, "DefaultVPC", {
      isDefault: true,
    });

    new ec2.Instance(this, "MyInstance", {
      instanceType,
      machineImage,
      vpc,
    });
  }
}
