import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as Src from '~/lib/src-stack'

test('VPC created', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new Src.AdminStack(app, 'MyTestStack')
  // THEN
  expectCDK(stack).to(haveResource('AWS::EC2::VPC'))
})
