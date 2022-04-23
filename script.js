// global constants
const cluePauseTime = 333; //how long to pause in between clues
const patternLength=8;
const numButtons=4; 
 
//global variables
var pattern = [];
var progress = 0; 
var gamePlaying = false;
var tonePlaying=false; 
var volume=0.5; // must be >0 <1
var guessCounter=0; 
var nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
var clueHoldTime = 1000; //how long to hold each clue's light/sound





function isDifferent() {
    var first, compared;
  

    for(first = 0 ; first < (patternLength-1 ) ; first++ ) {
        for( compared = (first + 1) ; compared < patternLength ; compared++ ) {
            if (pattern[compared] == pattern[first]) { // compares the words to find alphabetical ASCII
                if (pattern[compared] == 1)
                {
                  pattern[compared] = 4;
                  
                }
              if(pattern[compared] == 3)
                {
                pattern[compared] = 2; 
                }
            }
        }
    }
  
}
  
  
  
function randomArray(){
  pattern=[]; 
  
  for (var i = 0; i<patternLength; i++ ){
    
    pattern.push(Math.floor(Math.random() * 4)); 
    if (pattern[i] == 0){
      pattern[i]=1; 
    }
      
  }
  isDifferent(); 
}
       
    


// swap the Start and Stop buttons

function startGame(){
  progress = 0;
  gamePlaying=true;
  pattern=[];
  
  
  randomArray();
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
  
}

function stopGame(){
  gamePlaying=false; 
  
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}


// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  context.resume()
  guessCounter=0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
   
    delay += clueHoldTime 
    delay += cluePauseTime;
    
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Congratulations! You won.");
}


function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  if (btn !== pattern[guessCounter]){ // if guess is wrong 
  
      loseGame();
    }
  else {
    if(guessCounter == progress) {
       if(progress < (pattern.length-1) ){ // if guess is right, and hasn't reached end. 
        progress++;
        playClueSequence(); 
      }
        else  { // if end of pattern reached. 
        winGame();
      }   
       }
      
      else{
        guessCounter++; 
      }
    }
     
    

}
  
  
