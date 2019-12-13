/* TorranceLearning magnetic switch notification */

#include <ESP8266WiFi.h>

#include <DNSServer.h>            //Local DNS Server used for redirecting all requests to the configuration portal
#include <ESP8266WebServer.h>     //Local WebServer used to serve the configuration portal
#include <WiFiManager.h>          //https://github.com/tzapu/WiFiManager WiFi Configuration Magic

#include <WiFiClientSecure.h> // used for Dweet and Zapier

//for LED status
#include <Ticker.h>
Ticker ticker;

// User variables =================================== /

char ssid[] = "xxxxxxxxxxxxxxxxx"; // WiFi ID to connect board to web via a device (no spaces allowed)
char password[] = "xxxxxxxxxxxxxxxxx"; // Password to allow above connection
String dweetChannel = "xxxxxxxxxxxxxxxxx"; // Real-time ping to web, viewable at http://dweet.io/follow/xxxxxxxxx
String zapierHook = "/hooks/catch/xxxxxxxxxxxxxxxxx/xxxxxxxxxxxxxxxxx"; // Currently TorranceLearning Zapier hook - replace to send to your own

int dweetInterval = 30; // Dweet every 30 seconds

// xAPI Setup
String activityName = "xxxxxxxxxxxxxxxxx"; // this will also create the unique ID
String actorName = "xxxxxxxxxxxxxxxxx";
String actorMbox = "xxxxxxxxxxxxxxxxx"; // exclude "mailto:" prefix
String endpoint = "xxxxxxxxxxxxxxxxx";
String auth = "xxxxxxxxxxxxxxxxx"; // Base64 encoded (key:secret)

// Global variables =================================== /

const int httpPort = 80;
const int httpsPort = 443;

// MAGNET SWITCH
const int inputPin = 5; // D1 on ESP-12E
int oldSwitchValue;
int currentSwitchValue;
String statusText;

// LEDs
const int greenLED = 15;
const int yellowLED = 13;
const int redLED = 12;

int onboardLED = 2;

unsigned long Tick = 0;

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println("Booting...");

  pinMode(inputPin, INPUT_PULLUP);

  pinMode(redLED, OUTPUT);
  pinMode(yellowLED, OUTPUT);
  pinMode(greenLED, OUTPUT);

  setupWiFi();
  delay(200);

  checkCurrentValue();
  dweet();
}

void loop() {
  Tick++;

  getValueChanges();
  delay(1000);
}

void configModeCallback(WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.print("Address: "); Serial.println(WiFi.softAPIP());
  Serial.print("SSID: "); Serial.println(myWiFiManager->getConfigPortalSSID());
  statusLights('y', 2);
}

void setupWiFi() { // called from setup
  statusLights('r', 1);

  WiFiManager wifiManager;
  wifiManager.setAPCallback(configModeCallback);

  // fetches ssid and pass and tries to connect
  // if it does not connect it starts an access point with the specified name
  // and goes into a blocking loop awaiting configuration

  if (!wifiManager.autoConnect(ssid, password)) {
    Serial.println("failed to connect and hit timeout");
    wifiManager.startConfigPortal(ssid, password);
  }

  Serial.println();
  Serial.println("Connected to WiFi");
  Serial.print("IP address: "); Serial.println(WiFi.localIP());

  statusLights('g', 3);
}

void checkCurrentValue() {
  currentSwitchValue = digitalRead(inputPin);
  
  if (currentSwitchValue == 1) {
    statusText = "open";
  } else if (currentSwitchValue == 0) {
    statusText = "closed";
  }
}

void getValueChanges() {
  checkCurrentValue();

  if (Tick % dweetInterval == 0) { // every 30s
    dweet();
  }

  if (currentSwitchValue != oldSwitchValue) {
    dweet();
    delay(100);
    
    Serial.println("status change, send to Zapier...");
    zapier();
    delay(500);
  }
  oldSwitchValue = currentSwitchValue;
}
