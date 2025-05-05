---
title: "Game hacking: Assult Cube"
date: "2025-04-17"
---

In this write-up, weʼll explore the fundamentals of game hacking using Assault Cube as our target. Weʼll start by learning how to identify dynamic addresses for elements like health and ammo and then progress to finding their static counterparts. Once we have the addresses, weʼll create a simple Lua script to automate value manipulation. By the end of this guide, youʼll understand how to modify in-game values like health and ammo, giving you the ability to customize your gaming experience as you wish. Before we begin, make sure you have the required tools. You can download Assault Cube from here .

![Alt Text]({{baseUrl}}/blogImages/blog1/(1).png)

Cheat Engine from [here.](https://assault.cubers.net/download.html)

&nbsp;

While installing Cheat Engine, your system might flag it as a virus. Donʼt worry —this happens because Cheat Engine requires access to system memory to allow you to edit and manipulate values, which some antivirus software misinterprets as malicious behavior. However, you should be cautious about ads on the Cheat Engine website and make sure to decline any additional applications offered during the installation process. Once youʼve done that, proceed with the installation. Lets dive to our topic, open the game and the cheat engine. You will get a view of cheat engine like this .


![Alt Text]({{baseUrl}}/blogImages/blog1/(2).png)

Add the game process to the cheat engine.

![Alt Text]({{baseUrl}}/blogImages/blog1/(3).png)


![Alt Text]({{baseUrl}}/blogImages/blog1/(4).png)

After that setup some basic things in our game for trial activities. Select and enable things as shown bellow.

![Alt Text]({{baseUrl}}/blogImages/blog1/(5).png)


![Alt Text]({{baseUrl}}/blogImages/blog1/(6).png)


![Alt Text]({{baseUrl}}/blogImages/blog1/(7).png)

After setup , you will get a nice view like this .

![Alt Text]({{baseUrl}}/blogImages/blog1/(8).png)

Now itʼs the time to get our hands dirty. For first what we gonna do is find our health addr and then finding the static addr, for that we going to damage ourself using granade and search for the health value in cheat engine.

![Alt Text]({{baseUrl}}/blogImages/blog1/(9).png)

First search 100, cause our current health value is 100.

![Alt Text]({{baseUrl}}/blogImages/blog1/(10).png)


![Alt Text]({{baseUrl}}/blogImages/blog1/(11).png)

After damaging ourself go to cheat engine and enter the new health value and hit next scan. If you die while damaging no problem try again until you get a single value.

![Alt Text]({{baseUrl}}/blogImages/blog1/(12).png)

Here you can see the one single value , here mine is 56 you may get different its completely fine. Double click on it and you can see its now in the address list , click on the value and enter a new value . Now you can see the value get changed in the game too.

![Alt Text]({{baseUrl}}/blogImages/blog1/(13).png)


![Alt Text]({{baseUrl}}/blogImages/blog1/(14).png)


![Alt Text]({{baseUrl}}/blogImages/blog1/(15).png)


As you see , now we have the dynamic health addr . Now you can give a Description to it like , Dynamic Health or what you need. Next we need to find the static addr . Why ? , Because everytime the game get load to the memory the dynamic addr also get changed so we canʼt create a cheat or we cant always use the current addr to change the value , so we need to find the static one. For that right click on the Dynamic Health , Here you can see bunch of options , In the list you can see two options , “Find out what accesses this addressˮ “Find out what writes to this addressˮ


![Alt Text]({{baseUrl}}/blogImages/blog1/(16).png)


We are going to choose the first one , “Find out what accesses this address


![Alt Text]({{baseUrl}}/blogImages/blog1/(17).png)


![Alt Text]({{baseUrl}}/blogImages/blog1/(18).png)


After selecting that , then damage agian, now you can see that some access that.

![Alt Text]({{baseUrl}}/blogImages/blog1/(19).png)


Here you can see, cmp dword ptr [esi+000000EC,00 this means esi + offset “ECˮ get compared , so am gonna take this and analysis . I know this one is the correct , but you should mess around with stuff all if you new to this , thatʼs how you gonna learn new things . Here esi going to the local local player and EC is the offset for the health addr. We got the the local player right and if we add EC to that ofcourse its going to the health addr and we can modify it , But that not enough because it is dynamic one, we need to find the static. For the learning purpose we can try this for more understanding , click on “Add Address Manuallyˮ and paste the local player addr  EC .


![Alt Text]({{baseUrl}}/blogImages/blog1/(20).png)


Enter it and you can see that on the address list , close your game and open it again and import to Cheat Engine . Now you can see that the adrr are no longer work , so that why need to find the static addr.(am not showing this here , you can try it by yourself). Letʼs find that static address. Copy the ESI value and search it , remember to enable the hex because addr are hexadecimal . You can see that green highlighted , thats are statics , we can concentrate on those , the both three will gonna work but maybe after some days or week some wonʼt work . So we need to pick the most logical one, you will understand if you do more reverse stuff, for now i know the right one, ac_client.exe+195404 ac_client.exe is the module and 195404 is the offset to the player object.


![Alt Text]({{baseUrl}}/blogImages/blog1/(21).png)


Add that to the addr list.



![Alt Text]({{baseUrl}}/blogImages/blog1/(22).png)



![Alt Text]({{baseUrl}}/blogImages/blog1/(23).png)


Now we have the static offset to the local player object , we already know the health offset is ' EC , you can do the same thing which we done for the dynamic one , using the add addr manually option. Only a little change . enable the pionter , Because it is [ ac_client.exe+195404  , its pointing to the location (to an another pointe) of player object and we need to add another offset to get health which is ‘ECʼ for me . You can compare the image for better understanding , In the previous one we used the dynamic addr  EC  007B2244EC   health. Here we are using the static offset “195404ˮ to get the player object [ another pointer ] and then we are adding the offset EC to get the health. [ ac_client.exe+195404   007B2158 007B2158  EC  Health. Maybe this help a little bit more, [ ac_client.exe+195404 ] = 007B2158 007B2158 + EC = 007B2244 007B2244 is addr which storing the health value . 007B2244 = 1035 The bellow image is when the game restarted itself thatʼs why the health is 100. You can click ok to save this now or cancel it , am not saving it now (itʼs not a problem anyway).


![Alt Text]({{baseUrl}}/blogImages/blog1/(24).png)


20 If youʼre familiar with registers and pointer it will be easy, if youʼre not this gonna be a little hard , but read it again and do your own research. Itʼs ok to feel intimidating, try do the same thing again and again that how you gonna understand the topics. So we find the static local player object and through that we find the health addr also , so what we do if we need to find ammo or coordinates or anything else? , For that you can click on the Memory View. Click Tools.




![Alt Text]({{baseUrl}}/blogImages/blog1/(25).png)


Select the option shown bellow.



![Alt Text]({{baseUrl}}/blogImages/blog1/(26).png)


![Alt Text]({{baseUrl}}/blogImages/blog1/(27).png)


Name whatever you want , by default its playerent . Now you can see a lot of information , like coordinates and many other values. I found the health addr , we already knew the offset so i try to look for EC , but if you donʼt know the offest look for the value.


![Alt Text]({{baseUrl}}/blogImages/blog1/(28).png)


Here i found the gun ammo , look for initial ammo and shoot observer is there any values getting decreased , then you can find the gun ammo.


![Alt Text]({{baseUrl}}/blogImages/blog1/(29).png)


![Alt Text]({{baseUrl}}/blogImages/blog1/(30).png)


After finding the correct offset for the ammo , look the offset and use ‘add addr manuallyʼ option, do the same as we done before . Everything is same except the offset . Note  Your offset may different regarding with the game version, am using AssaultCube 1.3.0.2 . You can make a list like this , use the change color option to make it look cool or like a pro hacker . You can drag and put it in the center of the ‘Local Player Objectʼ to get like this , i mean the addr you created .


![Alt Text]({{baseUrl}}/blogImages/blog1/(31).png)


You can add more details as you want , mess around with all things here and spend time until you get a better traction on this. For now am just only added some basics things .



![Alt Text]({{baseUrl}}/blogImages/blog1/(32).png)