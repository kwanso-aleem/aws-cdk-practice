import * as cdk from "aws-cdk-lib/core";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

const GROUPS = [
  { id: "DeveloperGroup", name: "Developers" },
  { id: "AdminsGroup", name: "Admins" },
  { id: "OperationsGroup", name: "Operations" },
];

const USERS = [
  { id: "Alice", name: "alice" },
  { id: "Bob", name: "bob" },
  { id: "Charlie", name: "charlie" },
  { id: "David", name: "david" },
  { id: "Edward", name: "edward" },
  { id: "Fred", name: "fred" },
];

const DEVELOPERS = ["alice", "bob", "charlie"];
const ADMINS = ["charlie", "david"];
const OPERATIONS = ["david", "edward"];

export class IamStack extends cdk.NestedStack {
  constructor(scope: Construct, id: string, props?: cdk.NestedStackProps) {
    super(scope, id, props);

    // Create IAM groups
    const groupMap = new Map(
      GROUPS.map(({ id: groupId, name }) => [
        groupId,
        new iam.Group(this, groupId, { groupName: name }),
      ]),
    );

    const developerGroup = groupMap.get("DeveloperGroup")!;
    const adminGroup = groupMap.get("AdminsGroup")!;
    const operationsGroup = groupMap.get("OperationsGroup")!;

    // Add policies to the groups
    developerGroup.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEC2ReadOnlyAccess"),
    );
    adminGroup.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
    );
    operationsGroup.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3ReadOnlyAccess"),
    );

    // Create IAM users, keyed by name to avoid CFN token comparison
    const userMap = new Map(
      USERS.map(({ id: userId, name }) => [
        name,
        new iam.User(this, userId, { userName: name }),
      ]),
    );

    // Add users to groups
    const addUsersToGroup = (names: string[], group: iam.Group) => {
      names.forEach((name) => {
        const user = userMap.get(name);
        if (!user) throw new Error(`User "${name}" not found in USERS`);
        group.addUser(user);
      });
    };

    addUsersToGroup(DEVELOPERS, developerGroup);
    addUsersToGroup(ADMINS, adminGroup);
    addUsersToGroup(OPERATIONS, operationsGroup);
  }
}
