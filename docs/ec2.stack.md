Scenario: Web Server on a Custom VPC

You're setting up a simple web server that serves a static "Hello World" page. Here's what to build:

## Infrastructure

- A new VPC (not the default) with 1 public subnet across 1 AZ
- A security group that allows inbound HTTP (port 80) and blocks everything else
- A t3.micro Amazon Linux 2023 EC2 instance placed in that public subnet
- An IAM role with AmazonSSMManagedInstanceCore so you can connect via SSM Session Manager (no SSH key needed)
- A userData script that installs and starts nginx on launch

## Resources block — 12 resources generated from your ~30 lines of CDK

| Logical ID                                        | Resource Type                          | Description                                                                                      |
| ------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| EC2VpcFFB3EF08                                    | AWS::EC2::VPC                          | new ec2.Vpc(...) — CIDR 10.0.0.0/16 auto-assigned                                                |
| EC2VpcPublicSubnetSubnet1Subnet...                | AWS::EC2::Subnet                       | subnetType: PUBLIC — note AvailabilityZone: "dummy1a" (no real AZ yet — needs credentials)       |
| EC2VpcPublicSubnetSubnet1RouteTable...            | AWS::EC2::RouteTable                   | Auto-created by CDK for the public subnet                                                        |
| EC2VpcPublicSubnetSubnet1RouteTableAssociation... | AWS::EC2::SubnetRouteTableAssociation  | Wires the subnet to the route table                                                              |
| EC2VpcPublicSubnetSubnet1DefaultRoute...          | AWS::EC2::Route                        | 0.0.0.0/0 → IGW — makes the subnet public                                                        |
| EC2VpcIGW53D90023                                 | AWS::EC2::InternetGateway              | Auto-created by CDK for any PUBLIC subnet                                                        |
| EC2VpcVPCGW52F9120B                               | AWS::EC2::VPCGatewayAttachment         | Attaches the IGW to the VPC                                                                      |
| EC2VpcRestrictDefaultSecurityGroup...             | Custom::VpcRestrictDefaultSG           | From @aws-cdk/aws-ec2:restrictDefaultSecurityGroup: true in cdk.json — locks down the default SG |
| CustomVpcRestrictDefaultSG...Role + Handler       | AWS::IAM::Role + AWS::Lambda::Function | A Lambda CDK spins up to enforce the above                                                       |
| SecurityGroupDD263621                             | AWS::EC2::SecurityGroup                | Your new ec2.SecurityGroup(...) — port 80 ingress, all outbound                                  |
| InstanceRole3CCE2F1D                              | AWS::IAM::Role                         | Your IAM role with AmazonSSMManagedInstanceCore                                                  |
| MyInstanceInstanceProfile2784C631                 | AWS::IAM::InstanceProfile              | Auto-created by CDK — wraps the IAM role so EC2 can use it                                       |
| MyInstanceA12EC128                                | AWS::EC2::Instance                     | Your new ec2.Instance(...) — includes UserData as Base64                                         |

## Generated CloudFormation Template

See the CloudFormation template in `templates/ec2.stack.json` for the complete synthesized output.
