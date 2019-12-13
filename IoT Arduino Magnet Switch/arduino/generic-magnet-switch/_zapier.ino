const char *hostZapier = "hooks.zapier.com";

// copied from web browser certificate thumbprint
const char fingerprint[] PROGMEM = "af 21 4a 6c 2c e4 ce 6e 99 7b b8 ea 58 cf 57 6b c2 35 a4 0d";


void onFail() {
  statusLights('r', 3);
  delay(2000);
  statusLights('r', 1);
  delay(2000);
  statusLights('g', 3);
}

void zapier() {
  statusLights('y', 1);

  WiFiClientSecure clientsecure;
  clientsecure.setFingerprint(fingerprint);

  Serial.println("zapping...");
  
  if (!clientsecure.connect(hostZapier, httpsPort)) {
    Serial.println("Zapier connection failed");
    statusLights('r', 1);
    delay(3000);
    statusLights('g', 3);
    return;
  }
  
  String urlZapier = zapierHook + "?status=" + statusText +
                     "&statusNum=" + currentSwitchValue +
                     "&endpoint=" + urlencode(endpoint) +
                     "&auth=" + auth +
                     "&actorName=" + urlencode(actorName) + 
                     "&actorMbox=" + urlencode(actorMbox) + 
                     "&activityName=" + urlencode(activityName);

  Serial.println(urlZapier);
  
  clientsecure.print(String("GET ") + urlZapier + " HTTP/1.1\r\n" +
               "Host: " + hostZapier + "\r\n" +
               "Connection: close\r\n\r\n");

  unsigned long timeout = millis();
  while (clientsecure.available() == 0) {
    if (millis() - timeout > 5000) {
      Serial.println(">>> Client Timeout !");
      clientsecure.stop();
      onFail();
      return;
    }
  }
  bool zapSuccess = false;
  while (clientsecure.available()) {
    String line = clientsecure.readStringUntil('\r');
    if (line.indexOf("success") > 0) {
      zapSuccess = true;
    }
    Serial.print(line);
  }

  Serial.println();

  if (zapSuccess == true) {
    Serial.println("ZAP SUCCESS");
    statusLights('g', 3);
  } else {
    Serial.println("ZAP FAILED......");
    onFail();
  }

  Serial.println();

}
