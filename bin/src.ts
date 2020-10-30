#!/usr/bin/env node
import * as cdk from '@aws-cdk/core'
import { AdminStack } from '~/lib/src-stack'

export const init = () => {
  const app = new cdk.App()
  new AdminStack(app, 'AdminStack', {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION
    }
  })

  // new AccountStack(app, 'sample')
}
