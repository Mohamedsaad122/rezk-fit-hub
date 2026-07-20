# main.tf provisions the EKS cluster, VPC network, and storage buckets.

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name        = "rezk-fit-hub-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "rezk-fit-hub-public"
  }
}

resource "aws_s3_bucket" "assets" {
  bucket        = "rezk-fit-hub-assets-prod"
  force_destroy = true

  tags = {
    Environment = var.environment
  }
}
