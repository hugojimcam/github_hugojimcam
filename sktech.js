let bgImage;

function preload() {
  bgImage = loadImage('background.jpg'); 
}
let videos = [];
let videoAvailable = [];
let currentVideoIndex = -1;

let videoDescriptions = [
  "Track 1: Cab Fare – Souls of Mischief",
  "Track 1 Sample: Angela (Theme from Taxi) – Bob James",
  "Track 2: One Beer – MF DOOM",
  "Track 2 Sample: Huit Octobre 1971 – Cortex",
  "Track 3: World Domination – Joey Bada$$",
  "Track 3 Sample: Datura Stramonium – MF DOOM",
  "Track 4: Me Myself and I – De La Soul",
  "Track 4 Sample: (Not Just) Knee Deep – Funkadelic",
  "Track 5: Gangsta's Paradise – Coolio",
  "Track 5 Sample: Pastime Paradise – Stevie Wonder",
  "Track 6: Can You Kick it? - Tribe Called Quest",
  "Track 6 Sample: Walk on the Wild Side - Lou Reed",
  "Track 7: Can You Give Me One More Chance/ Stay With Me - The Notorious B.I.G.",
  "Track 7 Sample: Stay With Me - Debarge",
  "Track 8: Atlienz - OutKast",
  "Track 8 Sample: Around the World - Attilio Mineo",
  "Track 9: C.R.E.A.M - Wu Tang Clan",
  "Track 9 Sample: As Long as I've Got You - The Charmels",
  "Track 10: How I could Just Kill A Man - Cypress Hill",
  "Track 10 Sample: Are You Experienced - Jimi Hendrix",
  "Track 11: Passin' Me Bye - The Pharcyde",
  "Track 11 Sample: Summer In the City - Quincy Jones"
];

let fft;

function setup() {
  createCanvas(640, 480);
  textSize(20);
  textAlign(CENTER, CENTER);
  fft = new p5.FFT();

  for (let i = 1; i <= 22; i++) {
    let vid = createVideo("video" + i + ".mp4");
    vid.hide();
    vid.volume(1);
    vid.size(320, 240);
    videoAvailable.push(true);

    vid.elt.onerror = function() {
      videoAvailable[i - 1] = false;
    };

    videos.push(vid);
  }
}

function draw() {
  background(35, 38, 42);

  if (currentVideoIndex !== -1 && videoAvailable[currentVideoIndex]) {
    image(videos[currentVideoIndex], width / 2 - 160, height / 2 - 160);
    fill(255);
    textSize(16);
    textAlign(CENTER, TOP);
    text(videoDescriptions[currentVideoIndex], width / 2, height / 2 + 100);
    drawVisualizer();
  } else {
    tint(100,150);
    image(bgImage, 0, 0, width, height);
    noTint();
    fill(255);
    let margin = 40;
    let textBoxWidth = width - 2 * margin;
    textAlign(CENTER, TOP);
    textSize(26);
    text("Hip Hop Songs and Their Samples  🎶", width / 2, margin);

    textAlign(LEFT, TOP);
    textSize(18);
    let introText = "My favorite part of music is that it creates more music... Each hip hop track will be folowed by it's sample.. Press keys 1–9, 0, Q–P, A, or S to play the tracks and repress them to stop the music";
    text(introText, margin, margin + 50, textBoxWidth); 
  }
}

function keyPressed() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  let numberKeys = '1234567890';
  let letterKeys = 'QWERTYUIOPAS';

  let numIndex = numberKeys.indexOf(key);
  if (numIndex !== -1) {
    let videoIndex = (numIndex === 9) ? 9 : numIndex;
    if (videoAvailable[videoIndex]) {
      playVideoAtIndex(videoIndex);
    }
  }

  let upperKey = key.toUpperCase();
  let letterIndex = letterKeys.indexOf(upperKey);
  if (letterIndex !== -1) {
    let videoIndex = letterIndex + 10;
    if (videoAvailable[videoIndex]) {
      playVideoAtIndex(videoIndex);
    }
  }
}

function playVideoAtIndex(index) {
  if (currentVideoIndex === index) {
    videos[currentVideoIndex].stop();
    currentVideoIndex = -1;
  } else {
    if (currentVideoIndex !== -1) {
      videos[currentVideoIndex].stop();
    }
    currentVideoIndex = index;
    videos[currentVideoIndex].volume(1);
    videos[currentVideoIndex].loop();
    fft.setInput(videos[currentVideoIndex]);
  }
}

function drawVisualizer() {
  let spectrum = fft.analyze();

  noStroke();
  fill(100, 255, 200, 180);
  let bars = 64;
  let gap = width / bars;

  for (let i = 0; i < bars; i++) {
    let amp = spectrum[i];
    let h = map(amp, 0, 256, 0, height / 4);
    rect(i * gap, height - h, gap - 2, h);
  }
}
