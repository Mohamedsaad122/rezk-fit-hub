variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "Target deployment region"
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Target environment label"
}

variable "cluster_name" {
  type        = string
  default     = "rezk-fit-hub-cluster"
  description = "EKS cluster name"
}
