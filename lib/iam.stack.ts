import * as cdk from "aws-cdk-lib/core";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
/**
 * This stack demonstrates how to create an IAM role with trust policies and attach policies to it.
 * It creates a role that can be assumed by an EC2 instance, allowing it to access a specific S3 bucket.

Here are some good IAM scenarios to try with CDK, roughly ordered by complexity:

1. IAM Roles with Trust Policies (EC2 / Lambda)
Create a role that an EC2 instance or Lambda function assumes to access S3 or DynamoDB. Teaches: iam.Role, trust relationships, service principals, instance profiles.

2. Custom Managed Policies
Write your own policy documents instead of using AWS-managed ones — e.g., allow read-only access to a specific S3 bucket prefix only. Teaches: iam.ManagedPolicy, iam.PolicyStatement, conditions, resource ARNs.

3. Permission Boundaries
Attach a permission boundary to users/roles so they can never escalate beyond a defined ceiling — even if someone adds AdministratorAccess to them. Teaches: the difference between identity policies and boundaries, a common real-world security control.

4. Cross-Account Role Assumption
Create a role in Account A that trusts Account B to assume it. Teaches: cross-account principals in trust policies, sts:AssumeRole, external IDs (anti-confused-deputy pattern).

5. IAM Identity Center (SSO) Permission Sets via CDK
Define permission sets and account assignments for AWS SSO. More modern than IAM users — how real orgs manage access. Teaches: sso.CfnPermissionSet, sso.CfnAccountAssignment.

6. Attribute-Based Access Control (ABAC)
Tag users and resources, then write a single policy that grants access based on matching tags (aws:RequestedRegion, aws:PrincipalTag). Teaches: conditions with tag keys, a scalable alternative to group-per-team policies.

My recommendation: start with #1 (Roles + Trust Policies) — it's the most commonly used IAM pattern in real AWS workloads (every Lambda and EC2 instance needs one), and it directly builds on what you've already done with users and groups.

Want me to scaffold the starter code for any of these?

**/

export class IamStack extends cdk.NestedStack {
  constructor(scope: Construct, id: string, props?: cdk.NestedStackProps) {
    super(scope, id, props);

    // create an iam role, which give access to the ec2 instance to access s3 bucket
    const role = new iam.Role(this, "MyRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      description: "Role for EC2 instance to access S3 bucket",
    });

    // create a custom managed policy that allows access to the S3 bucket objects
    const managedPolicy = new iam.ManagedPolicy(this, "MyManagedPolicy", {
      description:
        "Managed policy for EC2 instance to access S3 bucket objects",
      statements: [
        new iam.PolicyStatement({
          actions: ["s3:ListBucket"],
          resources: ["arn:aws:s3:::test-bucket"],
        }),

        new iam.PolicyStatement({
          actions: ["s3:GetObject"],
          resources: ["arn:aws:s3:::test-bucket/*"],
        }),
      ],
    });

    // attach a policy to the role that allows to list the  S3 bucket and list the objects in the bucket
    role.addManagedPolicy(managedPolicy);

    // Step 3: Permission Boundaries
    // Defines the maximum permissions ceiling — even AdministratorAccess cannot exceed this boundary
    const permissionBoundary = new iam.ManagedPolicy(this, "PermissionBoundary", {
      description: "Limits any role to S3 and read-only EC2 access at most",
      statements: [
        new iam.PolicyStatement({
          actions: ["s3:*"],
          resources: ["*"],
        }),
        new iam.PolicyStatement({
          actions: ["ec2:Describe*"],
          resources: ["*"],
        }),
      ],
    });

    // This role has AdministratorAccess attached, but effective permissions are
    // only S3 + EC2 Describe because the boundary acts as a hard ceiling.
    // Effective permissions = identity policy AND boundary (intersection).
    const developerRole = new iam.Role(this, "DeveloperRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      description: "Developer role constrained by a permission boundary",
      permissionsBoundary: permissionBoundary,
    });

    developerRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
    );
  }
}
