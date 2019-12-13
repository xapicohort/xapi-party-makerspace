const char* hostDweet = "dweet.io";

void dweet() {
  WiFiClient client;

  Serial.println("dweeting...");
  if (!client.connect(hostDweet, httpPort)) {
    Serial.println("Dweet connection failed");
    return;
  }

  String urlDweet = "/dweet/for/" + dweetChannel + "?status=" + statusText +
                    "&statusNum=" + currentSwitchValue;

  client.print(String("GET ") + urlDweet + " HTTP/1.1\r\n" +
               "Host: " + hostDweet + "\r\n" +
               "Connection: close\r\n\r\n");

  delay(1000);
  statusLights('y', 2);
  delay(2000);
  statusLights('g', 3);
    
  unsigned long timeout = millis();
  while (client.available() == 0) {
    if (millis() - timeout > 5000) {
      Serial.println(">>> Client Timeout !");
      client.stop();
      return;
    }
  }
}
