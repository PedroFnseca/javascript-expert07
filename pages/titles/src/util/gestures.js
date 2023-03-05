const { GestureDescription, Finger, FingerCurl } = window.fp;

const ScrollDown = new GestureDescription('scroll-down'); // ✊️
const ScrollUp = new GestureDescription('scroll-up'); // 🖐

// Rock
// -----------------------------------------------------------------------------

// thumb: half curled
// accept no curl with a bit lower confidence
ScrollDown.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
ScrollDown.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

// all other fingers: curled
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  ScrollDown.addCurl(finger, FingerCurl.FullCurl, 1.0);
  ScrollDown.addCurl(finger, FingerCurl.HalfCurl, 0.8);
}


// Paper
// -----------------------------------------------------------------------------

// no finger should be curled
for(let finger of Finger.all) {
  ScrollUp.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

const knownGestures = [
  ScrollDown,
  ScrollUp,
]

const gestureStrings = {
  'scroll-up': '🖐',
  'scroll-down': '✊️'
}

export {
  knownGestures,
  gestureStrings
}