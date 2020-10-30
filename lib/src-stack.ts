import * as ec2 from '@aws-cdk/aws-ec2'
import * as ecs from '@aws-cdk/aws-ecs'
import * as elb from '@aws-cdk/aws-elasticloadbalancingv2'
import * as cdk from '@aws-cdk/core'
import { resolve } from 'path'

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

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef')

    const container = taskDefinition.addContainer('DefaultContainer', {
      image: ecs.ContainerImage.fromAsset(resolve('.')),
      memoryLimitMiB: 512,
      cpu: 256
    })

    container.addPortMappings({
      containerPort: 3000
    })

    const ecsService = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition,
      desiredCount: 2
    })

    const lb = new elb.ApplicationLoadBalancer(this, 'LB', {
      vpc: cluster.vpc,
      internetFacing: true
    })

    const listener = lb.addListener('Listener', { port: 80 })

    listener.addTargets('ECS', {
      protocol: elb.ApplicationProtocol.HTTP,
      port: 3000,
      targets: [ecsService]
    })

    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: lb.loadBalancerDnsName
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
