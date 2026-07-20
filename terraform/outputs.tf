output "vpc_id" {
  value       = "vpc-mock123"
  description = "The VPC ID"
}

output "eks_cluster_endpoint" {
  value       = "https://eks-mock.us-east-1.eks.amazonaws.com"
  description = "EKS Cluster endpoint"
}

output "load_balancer_dns" {
  value       = "rezk-fit-hub-alb-12345.us-east-1.elb.amazonaws.com"
  description = "Application Load Balancer DNS endpoint"
}
