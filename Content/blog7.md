---
title: "AWS S3 Bucket Security Test Cases "
date: "2025-04-23"
---

![Alt Text]({{baseUrl}}/blogImages/blog7/(1).png)


![Alt Text]({{baseUrl}}/blogImages/blog7/(2).png)


This document outlines essential security test cases for AWS S3 buckets, ensuring data confidentiality, integrity, and availability. These tests aim to identify and mitigate potential vulnerabilities that could expose sensitive information or disrupt service. 

Lots of companies use AWS S3 to store their data, but it's easy to set it up wrong, which can let hackers see private information. That's why people who test cloud security need to know how to look for these mistakes in S3 storage areas. 

If you have an S3 **bucket URL** of a company (e.g., https://xyz-companybucket.s3.amazonaws.com), you can perform various security test cases to identify
misconfigurations and vulnerabilities. Below are some example scenarios and corresponding
test cases:

# Scenario 1: Checking for Publicly Accessible Files

**Vulnerability Name: Unrestricted Public Access** → Sensitive data leakage.

**Test Case:** Check if the bucket is publicly accessible

**🔹 Steps:**

1. Open the bucket URL (https://xyz-company-bucket.s3.amazonaws.com) in a browser.
2. If the bucket is public, it may list its contents or return an accessible object.
3. Try appending common filenames like:
    - https://xyz-company-bucket.s3.amazonaws.com/config.json
    - https://xyz-company-bucket.s3.amazonaws.com/backup.zip
    - https://xyz-company-bucket.s3.amazonaws.com/.env

# Scenario 2: Listing Bucket Contents (Insecure ACLs/Policies)

**Vulnerability Name: Public ListBucket Access** → Attackers can enumerate files.

**Test Case:** Check if anonymous users can list files in the bucket.

**🔹Steps:**

1. Use awscli to attempt bucket listing:
2. aws s3 ls s3://xyz-company-bucket --no-sign-request
3. If files are listed, the bucket has overly permissive ACLs.
4. Alternatively, try:\

    - curl -X GET https://xyz-company-bucket.s3.amazonaws.com
    - If it returns a list of object names, the bucket is misconfigured.


# Scenario 3: Testing for Write Permissions (Bucket Takeover)

**Vulnerability Name:** Public Write Access → Could lead to bucket takeover or malware
injection.


**Test Case:** Check if unauthorized users can upload files.

**🔹 Steps:**

1. Try uploading a test file using:
2. echo "Test File" > test.txt
3. aws s3 cp test.txt s3://xyz-company-bucket/ --no-sign-request
4. If successful, attempt to overwrite existing files:
5. aws s3 cp test.txt s3://xyz-company-bucket/index.html --no-sign-request
6. If the file uploads successfully, anyone can upload/overwrite files.


# Scenario 4: Checking for Unrestricted CORS Policy

**Vulnerability Name: Cross-Origin Data Theft** → Attackers can steal sensitive data from an
exposed bucket.


**Test Case:** Check if cross-origin requests expose sensitive data.
**🔹 Steps:**

1. Open browser console and run:


```
fetch("https://xyz-company-bucket.s3.amazonaws.com/sensitive-data.json", {
 method: "GET",
 mode: "cors",
credentials: "include"
})
```

2. If it succeeds without proper authentication, CORS is misconfigured.

# Scenario 5: Testing for Sensitive Information Exposure

**Vulnerability Name: Exposure of Secrets/API Keys** → Attackers can gain unauthorized access.

**Test Case:** Scan for sensitive files inside the bucket.

**🔹 Steps:**

1. Use Google Dorkingto search for public files:
2. site:s3.amazonaws.com "xyz-company-bucket"
3. Search for sensitive files like:
4. site:s3.amazonaws.com "xyz-company-bucket" ext:json OR ext:env OR ext:log
5. If sensitive files are found, data leakage is confirmed.

# Scenario 6: Checking for Unencrypted Storage

**Vulnerability Name:** Unencrypted Data at Rest → Data theft risks if breached.

**Test Case:** Verify if stored objects are encrypted.

**🔹 Steps:**
1. Run:

        aws s3api get-bucket-encryption --bucket xyz-company-bucket

2. If it returns An error occurred (ServerSideEncryptionConfigurationNotFoundError), encryption is disabled.

# Scenario 7: Exploiting Misconfigured Signed URLs

**Vulnerability Name: Long-lived Signed URLs** → Attackers can steal sensitive data.

**Test Case:** Test if signed URLs have long expiration times or can be reused.

**🔹 Steps:**

1. If you find a signed URL, extract the Expires parameter:

2. https://xyz-company-bucket.s3.amazonaws.com/private-data.pdf?X-Amz-Expires=3600

3. Modify the timestamp (Expires=9999999999) and test if the link still works.

4. If the modified URL works, signed URLs are insecurely configured.

# Scenario 8: Checking for Logging & Monitoring Issues

**Vulnerability Name: Lack of Logging & Monitoring** → No tracking of unauthorized access
attempts.

**Test Case:** Verify if access logging is enabled.

**🔹 Steps:**

1. Run:

```
aws s3api get-bucket-logging --bucket xyz-company-bucket
```

2. If logging is not enabled, security monitoring is weak.


# Scenario 9: API Gateway & S3 Integration Vulnerability
**Vulnerability Name: Unprotected API-to-S3 Integration** → Attackers can access data without authentication.

**Test Case:** Test if API responses expose bucket information.

**🔹 Steps:**

1. Check API responses for exposed S3 URLs using:
2. curl -X GET https://api.xyz-company.com/getFiles
3. If it leaks S3 bucket URLs, attackers can directly access the bucket.

# Scenario 10: Testing for Unrestricted Lambda Triggers on S3 Events

**Vulnerability Name: Event-Driven Attack Surface** → Attackers can manipulate automated workflows.

**Test Case:** Verify if Lambda functions triggered by S3 can be abused.
**🔹 Steps:**
1. If write access is found, upload a test file:
2. echo "PWNED" > malicious.txt
3. aws s3 cp malicious.txt s3://xyz-company-bucket/
4. If a function is misconfigured, it might process the file without validation, leading to arbitrary code execution.

# Scenario 11: Enumerating Bucket Name Variations

**Vulnerability Name: Enumerating Bucket Names** → Organizations often use multiple buckets for different purposes (e.g., backup, logs, dev).

**Test Case:** Use tools like Bucket Finder to discover variations:

1. python3 bucket_finder.py -w wordlist.txt -r us-east-1
2. Or use Nuclei for automated S3 enumeration:
3. nuclei -t s3-bucket-takeover.yaml -u http://<bucket-name>.s3.amazonaws.com

# Scenario 12: Searching for Leaked AWS Keys

**Vulnerability Name: Leaked AWS Keys** → S3 buckets often contain API keys or IAM credentials.

**Test Case:** Search on GitHub for Leaked Keys:

1. git clone https://github.com/michenriksen/gitrob
2. gitrob scan <organization-name>
3. Or use Google Dorking:

```
aws_access_key_id site:github.com "<organization-name>"
```

4. If leaked AWS keys are found, responsibly disclose the issue.

# Conclusion:

These scenarios and test cases help you identify and exploit misconfigurations in an AWS S3
bucket. Without AWS credentials, you'll be limited to inferring security configurations based
on observable behavior.

The most critical test is to determine if the bucket or any of its objects are publicly
accessible. By carefully considering these scenarios and test cases, you can gain a better
understanding of the security posture of an S3 bucket, even with limited access

## Warning!

Only perform these tests on buckets that you have explicit permission to test. Unauthorized
access is illegal and unethical.