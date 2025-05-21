---
title: "Exploiting Command Injection in a Router Web Interface"
date: "2025-04-17"
---

# Introduction

During a security assessment of a router's web interface, a critical command injection vulnerability was discovered in the "Ping Test" feature. This flaw allowed arbitrary system commands to be executed on the router, potentially leading to full system compromise. The vulnerability was successfully exploited using Burp Suite to intercept and modify HTTP requests.

# Steps to Identify the Vulnerability

1. Accessing the Vulnerable Page
   - Logged into the router's web panel.
   - Navigated to the "Ping Test" section.

2. Intercepting Requests with Burp Suite
   - Enabled intercept mode in Burp Suite.
   - Entered a standard IP address (e.g., 8.8.8.8) in the input field.
   - Captured and examined the HTTP request.

3. Testing for Command Injection
   - Modified the request by appending a command separator ( ; ) followed by a system command:
   - Forwarded the request and analyzed the server's response.
   - The response contained a directory listing, confirming that command injection was possible.

```javascript
8.8.8.8; ls -la 
```

![Alt Text]({{baseUrl}}/blogImages/blog6/0.png)

![Alt Text]({{baseUrl}}/blogImages/blog6/1.png)

As you can see positive response i tried another cmd , here am going with “ls -al”.

![Alt Text]({{baseUrl}}/blogImages/blog6/2.png)

Am able to list the files

![Alt Text]({{baseUrl}}/blogImages/blog6/3.png)

So simply ii tried to cat it out ,

![Alt Text]({{baseUrl}}/blogImages/blog6/4.png)

and its worked well !!!

# Conclusion

This command injection vulnerability highlights the importance of secure coding in embedded systems. By properly sanitizing user input and implementing robust security practices, such critical flaws can be mitigated effectively. Regular security assessments and updates are essential to maintaining a secure network environment.