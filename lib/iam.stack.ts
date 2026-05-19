import * as cdk from 'aws-cdk-lib/core';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class IamStack extends cdk.NestedStack {
  constructor(scope: Construct, id: string, props?: cdk.NestedStackProps) {
    super(scope, id, props);

    const developerGroup = new iam.Group(this, 'DeveloperGroup', {
      groupName: 'Developers',
    });

    developerGroup.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ReadOnlyAccess')
    );
  }
}
