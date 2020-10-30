import * as ec2 from '@aws-cdk/aws-ec2'
import * as ecs from '@aws-cdk/aws-ecs'
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns'
import * as cdk from '@aws-cdk/core'

export class AdminStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const vpc = ec2.Vpc.fromLookup(this, 'DefaultVpc', {
      vpcName: 'default-vpc'
    })

    const cluster = new ecs.Cluster(this, 'AdminCluster', {
      vpc,
      clusterName: 'admin'
    })

    // Create a load-balanced Fargate service and make it public
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'MyFargateService', {
      serviceName: 'sample-service',
      cluster: cluster,
      cpu: 256,
      desiredCount: 1,
      taskImageOptions: { image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample') },
      memoryLimitMiB: 512,
      publicLoadBalancer: true
    })
  }
}

export class AccountStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    new cdk.CfnOutput(this, 'MyStackAccount', {
      description: 'Account of this stack',
      value: this.account
    })
  }
}
