#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import * as dotenv from "dotenv";
import { MainStack } from "../lib/main.stack";

dotenv.config();

const app = new cdk.App();
new MainStack(app, "MainStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
