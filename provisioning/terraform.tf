## Core
##

terraform {
  required_version = "~> 1.9"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state backend
  # Source: https://gitlab.data.bas.ac.uk/WSF/terraform-remote-state
  backend "s3" {
    bucket = "bas-terraform-remote-state-prod"
    key    = "v2/BAS-EMBEDDED-MAPS/terraform.tfstate"
    region = "eu-west-1"
  }
}

provider "aws" {
  region = "eu-west-1"
}

# Alias for use with resources or data-sources that require the 'us-east-1' region,
# which is used as a control region by AWS for some services.
provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
}

# Source: https://gitlab.data.bas.ac.uk/WSF/bas-aws
data "terraform_remote_state" "BAS-AWS" {
  backend = "s3"

  config = {
    bucket = "bas-terraform-remote-state-prod"
    key    = "v2/BAS-AWS/terraform.tfstate"
    region = "eu-west-1"
  }
}

# Source: https://gitlab.data.bas.ac.uk/WSF/bas-core-domains
data "terraform_remote_state" "BAS-CORE-DOMAINS" {
  backend = "s3"

  config = {
    bucket = "bas-terraform-remote-state-prod"
    key    = "v2/BAS-CORE-DOMAINS/terraform.tfstate"
    region = "eu-west-1"
  }
}

## S3 buckets
##

resource "aws_s3_bucket" "testing" {
  bucket = "embedded-maps-testing.data.bas.ac.uk"

  tags = {
    Name         = "embedded-maps-testing"
    X-Project    = "BAS Embedded Maps"
    X-Managed-By = "Terraform"
  }
}

resource "aws_s3_bucket_public_access_block" "testing" {
  bucket = aws_s3_bucket.testing.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "testing" {
  bucket = aws_s3_bucket.testing.bucket

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.testing.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_website_configuration" "testing" {
  bucket = aws_s3_bucket.testing.bucket
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_cors_configuration" "testing" {
  bucket = aws_s3_bucket.testing.bucket

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket" "production" {
  bucket = "embedded-maps.data.bas.ac.uk"

  tags = {
    Name         = "embedded-maps"
    X-Project    = "BAS Embedded Maps"
    X-Managed-By = "Terraform"
  }
}

resource "aws_s3_bucket_public_access_block" "production" {
  bucket = aws_s3_bucket.production.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "production" {
  bucket = aws_s3_bucket.production.bucket

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.production.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_website_configuration" "production" {
  bucket = aws_s3_bucket.production.bucket
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_cors_configuration" "production" {
  bucket = aws_s3_bucket.production.bucket

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

## DNS & TLS
##

resource "aws_route53_record" "testing" {
  zone_id = data.terraform_remote_state.BAS-CORE-DOMAINS.outputs.DATA-BAS-AC-UK-ID
  name    = "embedded-maps-testing"
  type    = "CNAME"
  ttl     = 300
  records = [
    aws_cloudfront_distribution.testing.domain_name
  ]
}

resource "aws_route53_record" "production" {
  zone_id = data.terraform_remote_state.BAS-CORE-DOMAINS.outputs.DATA-BAS-AC-UK-ID
  name    = "embedded-maps"
  type    = "CNAME"
  ttl     = 300
  records = [
    aws_cloudfront_distribution.production.domain_name
  ]
}

resource "aws_acm_certificate" "testing" {
  provider          = aws.us-east-1
  domain_name       = aws_s3_bucket.testing.bucket
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name         = "embedded-maps-testing"
    X-Project    = "BAS Embedded Maps"
    X-Managed-By = "Terraform"
  }
}

resource "aws_route53_record" "acm-testing" {
  for_each = {
    for dvo in aws_acm_certificate.testing.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.terraform_remote_state.BAS-CORE-DOMAINS.outputs.DATA-BAS-AC-UK-ID
}

resource "aws_acm_certificate_validation" "testing" {
  provider                = aws.us-east-1
  certificate_arn         = aws_acm_certificate.testing.arn
  validation_record_fqdns = [for record in aws_route53_record.acm-testing : record.fqdn]
}

resource "aws_acm_certificate" "production" {
  provider          = aws.us-east-1
  domain_name       = aws_s3_bucket.production.bucket
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name         = "embedded-maps"
    X-Project    = "BAS Embedded Maps"
    X-Managed-By = "Terraform"
  }
}

resource "aws_route53_record" "acm-production" {
  for_each = {
    for dvo in aws_acm_certificate.production.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.terraform_remote_state.BAS-CORE-DOMAINS.outputs.DATA-BAS-AC-UK-ID
}

resource "aws_acm_certificate_validation" "production" {
  provider = aws.us-east-1

  certificate_arn         = aws_acm_certificate.production.arn
  validation_record_fqdns = [for record in aws_route53_record.acm-production : record.fqdn]
}

## CloudFront
##

resource "aws_cloudfront_distribution" "testing" {
  enabled             = true
  comment             = "BAS Embedded Maps (Testing)"
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # US and EU edge locations only
  aliases             = [aws_s3_bucket.testing.bucket]

  origin {
    domain_name = aws_s3_bucket_website_configuration.testing.website_endpoint
    origin_id   = "S3_${aws_s3_bucket.testing.bucket}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "S3_${aws_s3_bucket.testing.bucket}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 31536000
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }
  }

  # Restrictions (not used but must be defined by Terraform)
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
    acm_certificate_arn      = aws_acm_certificate_validation.testing.certificate_arn
  }

  # Add custom error response for SPA routing
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
}

resource "aws_cloudfront_distribution" "production" {
  enabled             = true
  comment             = "BAS Embedded Maps"
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # US and EU edge locations only
  aliases             = [aws_s3_bucket.production.bucket]

  origin {
    domain_name = aws_s3_bucket_website_configuration.production.website_endpoint
    origin_id   = "S3_${aws_s3_bucket.production.bucket}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "S3_${aws_s3_bucket.production.bucket}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 31536000
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }
  }

  # Restrictions (not used but must be defined by Terraform)
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
    acm_certificate_arn      = aws_acm_certificate_validation.production.certificate_arn
  }

  # Add custom error response for SPA routing
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
}

## IAM
##

resource "aws_iam_user" "gitlab-ci" {
  name = "bas-gitlab-ci-bas-embedded-maps"
}

resource "aws_iam_user_policy" "ci-testing" {
  name = "ci-policy-testing"
  user = aws_iam_user.gitlab-ci.name
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "MinimalContinuousDeploymentPermissions",
        "Effect" : "Allow",
        "Action" : [
          "s3:ListBucket",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:GetObjectAcl",
          "s3:PutObjectAcl"
        ],
        "Resource" : [
          "${aws_s3_bucket.testing.arn}",
          "${aws_s3_bucket.testing.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_user_policy" "ci-production" {
  name = "ci-policy-production"
  user = aws_iam_user.gitlab-ci.name
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "MinimalContinuousDeploymentPermissions",
        "Effect" : "Allow",
        "Action" : [
          "s3:ListBucket",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:GetObjectAcl",
          "s3:PutObjectAcl"
        ],
        "Resource" : [
          "${aws_s3_bucket.production.arn}",
          "${aws_s3_bucket.production.arn}/*"
        ]
      }
    ]
  })
}
