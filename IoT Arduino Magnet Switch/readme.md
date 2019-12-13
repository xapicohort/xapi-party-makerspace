# xAPI IoT Magnet Switch
## TorranceLearning xAPI Party (Spring 2019)
The following instructions and details describe setting up a Wi-Fi microcontroller board to detect when a magnet switch separates/connects (i.e., a door opening/closing) and to send an [xAPI](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md) statement to an LRS (Learning Record Store).

This project was used in a half-day workshop during the Spring 2019 [xAPI Party](https://www.torrancelearning.com/xapi-party/), a small mini-conference to meet with participants after the culmination of the Spring 2019 [xAPI Cohort](https://www.torrancelearning.com/xapi-cohort/), both hosted by [TorranceLearning](https://www.torrancelearning.com).

---
## Parts List
* [NodeMCU ESP8266 12E Wi-Fi Microcontroller](https://www.amazon.com/dp/B07LCMNXTN)
* [USB cable](https://www.amazon.com/dp/B00UFG5GVM)
* [Wall Charger](https://www.amazon.com/dp/B076C58YMX)
* [Magnet Switch](https://www.amazon.com/dp/B00LYCUSBY)
* [LEDs](https://www.amazon.com/dp/B01N0XRH5R)
* [Prototype breadboard](https://www.amazon.com/dp/B01EV640I6)
* [Wiring](https://www.amazon.com/dp/B01EV70C78)

---
## Arduino IDE
You can download the **Arduino IDE** for Window, Mac and Linux to edit and run your projects:

https://www.arduino.cc/en/Main/Software

(Currently, the **Arduino Web Editor** can't be used for this project, since the ESP8266 board we're using can't be loaded there. If you're using another supported board, feel free to try the Web Editor instead.)

## Arduino Libraries and Setup
### ESP8266 Boards List
First, load the **ESP8266 Board Manager** manually by adding the below link to your Preferences.

*File > Preferences > Settings*

http://arduino.esp8266.com/stable/package_esp8266com_index.json

![alt text](images/esp8266-arduino-library_screenshot.png "ESP8266 Arduino Library")

### Libraries Used
These libraries are included when you load the **ESP8266 Arduino Core** from the above Board Manager.

[ESP8266 Arduino Core Documentation](https://arduino-esp8266.readthedocs.io/en/latest/)

* ESP8266WiFi
* ESP8266WebServer
* DNSServer
* WiFiClientSecure
* Ticker

The **WiFiManager** can be installed separately in the Arduino IDE, from the included library list:

*Tools > Manage Libraries...*

* [WiFiManager](https://github.com/tzapu/WiFiManager)

---
## Arduino Code
### Main entry file
#### `generic-magnet-switch.ino`

This file (in the `generic-magnet-switch` folder) is the entry point that can be loaded into the Arduino IDE. It should automatically bring in the other support files that are in that folder.

Near the top of the file are the variables that can be changed and hard-coded (or see below for Zapier options) to set up your unique board configuration.

### Support files
#### `_dweet.ino`
This file contains code to send real-time signals (via [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)) to a free service called [dweet.io](https://dweet.io). This could then be used in projects to create visualizations, save activity, or trigger other activity using their client libraries (Node.js, JavaScript, Python or Ruby). You can also view device activity in their web interface.

#### `_zapier.ino`
This is where the relevant data is sent to [Zapier](https://zapier.com), where it is then processed to send an xAPI statement (and other actions, if desired).

#### `_status_lights.ino`
This file controls the basic green/yellow/red LED activity.

#### `_urlencode.ino`
This is a helper file to encode URL components for HTTP requests (Zapier).

---
## Zapier
https://zapier.com

Initially, the code is set up to send to TorranceLearning's Zapier account.

**To send to your own Zapier webhook:**

* Create a new Zap
* Add a **Webhooks by Zapier** Trigger step ("Catch Hook")
  * Copy/paste the relevant parts of the new Webhook address into the `generic-magnet-switch.ino` file (`zapierHook` variable)
  * Run your Arduino code from the board, and trigger the magnet switch
  * Test the "Webhook" step to get sample data from your trigger
  * ***NOTE:** You can add any intermediate steps here if you have a Zapier plan with multi-steps: send a Slack message, update a Google Sheet, send an email, etc.*
* Add a **Code by Zapier** Action step ("Run Javascript")
  * In "Edit Template" (using the sample data from the "Webhook" step), add the "Input Data" field names and their counterpart sample data values:
    * status
    * statusNum
    * endpoint
    * auth
    * actorMbox
    * actorName
    * activityName
  * ***NOTE:** If you do not wish to use hard-coded values in your Arduino code, you can override them with your own values in Zapier here instead. This is the preferred method generally, since it makes remote updates a lot easier without having write new code to the board.*
  * Copy/paste the `generic-magnet-switch.js` JavaScript file contents into the "Code" text area on this step
* Test this final step to check for errors
  * If there **are** errors, make sure there are no typos and that your `endpoint` and `auth` values are correct
  * If there **are no** errors, you should see the test statement in your LRS
* Make sure the Zap is enabled at the end, and it should now fire the Zap when the magnet switch status changes
  * You can always check the "Task History" in Zapier to check for errors/successes