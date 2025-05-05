---
title: "Use-After-Free: A Small Oversight, A Hacker’s Dream"
date: "2025-04-17"
---

# Introduction

This article takes an attacker's perspective on the Use-After-Free (UAF) vulnerability class, moving beyond generic explanations found on wiki pages. According to the CWE Top 25 Most Dangerous Software Weaknesses of 2024, UAF ranks 8th if we exclude web application vulnerabilities, UAF dominate the top three spots. UAF bugs can manifest in any software written in C or C++, ranging from UEFI firmware, hypervisors, and operating system kernels to embedded systems.

Even widely used software such as Adobe Acrobat, Google Chrome, the Linux kernel, and Microsoft Word have been vulnerable to UAF bugs in the past. These vulnerabilities arise when a reference to deallocated memory is used after it has been freed, leading to unintended behavior. While some cases might result in benign crashes, a well-crafted exploit can achieve remote code execution under the right conditions.

For developers, understanding UAF is crucial in mitigating risks and securing software products. Likewise, this knowledge is invaluable for security researchers looking to analyze and exploit these vulnerabilities.

# What and Why of Use-After-Free?


A Use-After-Free (UAF) vulnerability occurs when a program continues to access heap-allocated memory after it has been freed. While often mistaken for simply reusing freed memory, the real danger lies in how memory is allocated, freed, and later used.

### Example 1: A Basic UAF Condition

``` java
#include <stdlib.h>
#include <stdio.h>

int main() {","char *ptr = NULL;
    ptr = malloc(100); // Allocating 100 bytes dynamically
    free(ptr); // Freeing the allocated object
    ptr = "Astraliva "; // 💣 Using the freed object
    printf("%s", ptr);
}
```

In this example, we allocate 100 bytes of memory using **malloc()** and immediately free it. We then attempt to store the string "Astraliva" in the freed memory. While the program may not crash immediately, it introduces a UAF condition—the behaviour becomes unpredictable and could lead to security risks.

![Alt Text]({{baseUrl}}/blogImages/blog5/0.png)


Example 2: Heap Behaviour and First-Fit Allocation


``` java
#include <stdlib.h>
#include <stdio.h>

int main() {
    char *ptr = NULL;
    ptr = malloc(100); // Allocating 100 bytes dynamically
    free(ptr); // Freeing the allocated object
    ptr = malloc(100); // Allocating new memory after freeing
    strcpy(ptr, "Astraliva\n"); // Copying string into newly allocated memory
    printf("%s", ptr);
    free(ptr); // Freeing the newly allocated memory
    ptr = NULL; // Avoid dangling pointer
}
```

At first glance, this may look like a UAF vulnerability since both **ptr** and **ptr2** point to the same memory address. However, since we never use **ptr** after freeing it, the program avoids triggering a UAF condition.

![Alt Text]({{baseUrl}}/blogImages/blog5/1.png)


pointer 1 and pointer 2 is pointing to same memory region. This behaviour is due to Linux's heap memory manager, which uses the First Fit strategy—reallocating freed memory regions when new allocations of similar size are requested.

### Example 3: A Real UAF Condition

``` java
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

int main() {
    char *ptr = NULL;
    char *ptr2 = NULL;
    ptr = malloc(100); // Allocating 100 bytes dynamically
    printf("pointer 1 %p\n", ptr);
    strcpy(ptr, "Hello world");
    printf("content of malloc 1 %s\n", ptr);
    free(ptr); // Freeing the allocated object
    ptr2 = malloc(100);
    printf("pointer 2 %p\n", ptr2);
    strcpy(ptr2, "Astraliva");
    printf("content of malloc 1 %s\n", ptr); // UAF => using reference of a freed memory
    free(ptr2);
}
```

In this example, **ptr** initially holds the string "Hello world" before being freed. Later, **ptr2** is allocated at the same memory location, and the string "Astraliva" is copied into it. When we attempt to print **ptr** (which refers to the freed memory), it unexpectedly prints "Astraliva" instead of "Hello world".


![Alt Text]({{baseUrl}}/blogImages/blog5/2.png)

This occurs because ptr and ptr2 point to the same memory address, causing unexpected behavior—a classic UAF scenario.

## Why Is UAF Dangerous?

A simple string leak may not seem threatening, but heap memory is used for far more critical tasks than storing text. Unlike stack memory, heap memory is globally accessible across different functions. Many key program components, such as function pointers and complex data structures, reside in the heap.

A well-crafted UAF exploit can:

- Corrupt heap data – Altering sensitive data structures.
- Leak sensitive information – Extracting function pointers to bypass ASLR.
- Gain control of execution flow – Overwriting function pointers to execute arbitrary code.


By corrupting heap structures or leaking function pointer addresses, an attacker can bypass modern exploit mitigations and achieve remote code execution (RCE)


# Conclusion


Understanding UAF vulnerabilities is essential for both developers and security researchers. While debugging tools like AddressSanitizer (ASan) help detect these issues, a solid grasp of heap memory behaviour and secure memory management practices is the best defence against UAF exploits. As software complexity increases, so does the attack surface, making UAF a persistent and evolving threat in cybersecurity.



Stay tuned as we continue to explore memory corruption vulnerabilities in greater depth, uncovering various classes, exploitation techniques, and mitigation strategies.