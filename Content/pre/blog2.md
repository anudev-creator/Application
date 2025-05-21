---
title: "XYZ router Command Injection"
date: "2025-04-17"
---

# Introduction


At Astraliva, we conduct extensive security assessments on IoT devices. In this article, we are presenting a command injection bug we discovered in the firmware of an XYZ IoT device, along with the root cause of the issue. The device is referred to as XYZ throughout this article because we have not received a proper patch from the vendor to date, and the vendor is not happy about us publishing it.


Also, we wanted to highlight the root cause of the bug in the firmware rather than blindly exploiting it. The XYZ device is a router imported from China, rebranded, and sold in India.


# Root cause

The bug exist in the http webserver named boa.


![Alt Text]({{baseUrl}}/blogImages/blog2/(0).png)



We initially discovered the bug blindly, but for this article, we focused on identifying its root cause. The bug exists in the ping functionality within the device’s diagnostic features. This type of command injection is common in cheap IoT devices and relatively easy to find. After identifying the vulnerability, we extracted the firmware from the device’s SPI flash for further analysis. The hardware hacking aspects of the device will be covered in Part 2 of this article.


By probing the device via UART, we gained dynamic access and listed the running services, discovering that Boa was the web server in use. As the next step, we began reverse engineering the Boa web server.


![Alt Text]({{baseUrl}}/blogImages/blog2/(1).webp)


After understanding how the web server works, we immediately spotted the bug. The function named **formPing** parses the ping request from the diagnostics page. After an **snprintf** operation, the buffer named final_buffer is passed to va_cmd (a wrapper for execve) without any sanitization. Since **final_buffer** contains the input we given via the diagnostics page, and **va_cmd** executes it directly, this leads to command injection.


# Conclusion


In this article, we presented one of the most common and well-known bug classes found in routers. In upcoming articles, we will cover hardware hacking, firmware reverse engineering, and memory corruption bugs.