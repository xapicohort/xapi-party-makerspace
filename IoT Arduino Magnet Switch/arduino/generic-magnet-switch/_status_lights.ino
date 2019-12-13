int redStatus = 0;
int yellowStatus = 0;
int greenStatus = 0;

int onValue = 100;

bool toggleLights = false;

void setColor(int newRed, int newYellow, int newGreen) {
  redStatus = newRed;
  greenStatus = newGreen;
  yellowStatus = newYellow;
}

void writeColor(int newRed, int newYellow, int newGreen) {
  analogWrite(redLED, newRed);
  analogWrite(yellowLED, newYellow);
  analogWrite(greenLED, newGreen);
}

void tickToggle() { //toggle state
  toggleLights = !toggleLights;

  if (toggleLights) {
    writeColor(redStatus, yellowStatus, greenStatus);
  } else {
    writeColor(0, 0, 0);
  }
}

void statusLights(char color, int type) {
  switch (color) {
    case 'f': // off
      setColor(0, 0, 0);
    case 'r':
      setColor(onValue, 0, 0);
      break;
    case 'y':
      setColor(0, onValue, 0);
      break;
    case 'g':
      setColor(0, 0, onValue);
      break;
    case 'n': // on
      setColor(onValue, onValue, onValue);
  }

  switch (type) {
    case 1:
      ticker.attach(0.2, tickToggle);
      break;
    case 2:
      ticker.attach(0.5, tickToggle);
      break;
    case 3:
      ticker.detach();
      writeColor(redStatus, yellowStatus, greenStatus);
      break;
  }
}
