var bestGuess;
var bestTime;
var games;
var counter = 0;
var seconds = 00;
var minutes = 00;
var appendMinutes = document.getElementById("minutes");
var appendSeconds = document.getElementById("seconds");
var buttonStart = document.getElementById('button-start');
var buttonStop = document.getElementById('button-stop');
var Interval ;
var paused = true;
                

function canvasGradient(){
    var canvas = document.getElementById("firstCanvas");
    var context = canvas.getContext("2d");
    
    //Gradient
    var gradient = context.createRadialGradient(238, 50, 10, 238, 50, 300);
    gradient.addColorStop(0, "Orange");
    gradient.addColorStop(1, "Yellow");
    
    //Add the Gradient
    context.fillStyle = gradient;
    context.fillRect(10,10,canvas.width,canvas.height);
    
    //Add text
    context.fillStyle = "black";
    context.font = "110px Arial";
    context.strokeText("CIT 261", 15, 150);
}



/* CSS Animations/Transitions/Transformation code*/
/**
* Randomize array element order in-place.
* Using Durstenfeld shuffle algorithm.
* https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
*/
function shuffleArray(array) {
   for (var i = array.length - 1; i > 0; i--) {
       var j = Math.floor(Math.random() * (i + 1));
       var temp = array[i];
       array[i] = array[j];
       array[j] = temp;
   }
   return array;
}

function cardFlip(card){
    if((minutes == 00 && seconds == 00) || paused){
        beginTimer();
        if(!document.getElementById("gamesPlayed").classList.contains("closed")){
           document.getElementById("menuIcon").click();
        }
    }
    if (card.classList.contains("found") == false){
        card.classList.add("flipped");
    }
    var active = document.getElementsByClassName("flipped");
    var found = document.getElementsByClassName("found");
    if (active.length == "2"){
        var first = active[0];
        var second = active[1];
        counter++;
        document.getElementById("counter").innerHTML = counter;
        if (first.firstChild.firstChild.innerHTML === second.firstChild.firstChild.innerHTML){
            first.firstChild.setAttribute("style","background-color:green");
            second.firstChild.setAttribute("style","background-color: green");
            first.classList.add("found");
            first.classList.remove("flipped");
            second.classList.add("found");
            second.classList.remove("flipped");

            if(found.length == 18){
                clearInterval(Interval);
                time = bestTime.split(":");
                console.log(time);
                convertedBest = (parseInt(time[0])*60)+parseInt(time[1]);
                console.log(convertedBest);
                convertedTime = (minutes*60)+seconds;
                console.log(convertedTime);
                if (convertedTime < convertedBest || convertedBest === 0){
                    bestTime = minutes + ":" + seconds;
                    localStorage.setItem("bestTime", bestTime);
                    document.getElementById("bestTime").innerHTML = bestTime;
                }
                //paused = true;
                if (counter < bestGuess || bestGuess === 0){
                    localStorage.setItem("bestGuess", counter);
                    document.getElementById("bestGuess").innerHTML = counter;
                    bestGuess = counter;
                }
                fullTime = minutes + ":" + seconds;
                games.push({"guesses" : counter, "time" : fullTime});
                var gamesJSON = JSON.stringify(games);
                localStorage.setItem("games", gamesJSON);
                
                addGames(counter, fullTime);
                
                if(document.getElementById("gamesPlayed").classList.contains("closed")){
                    document.getElementById("menuIcon").click();
                }
                
                setTimeout(function(){
                    if (confirm("Congrats!\n\nYou have found all the matches!\n\nWould you like to start a new game?")){
                        makeGame();
                    }
                },800);
            } 
        }
        else{
            setTimeout(function(){
                 first.classList.remove("flipped");
                 },500);
            setTimeout(function(){
                 second.classList.remove("flipped");
            },500);
        }
    }
}

function makeGame(){
   if(!document.getElementById("gamesPlayed").classList.contains("closed")){
      document.getElementById("menuIcon").click();
   }
   buttonReset();
   counter = 0;
   var transition = 0;
   var backgroundImageURL;
   var backgroundClass;
   document.getElementById("counter").innerHTML = counter;
   var numbers = [];
   for(var i=0; i<9; i++){
       var num = Math.floor((Math.random() * 100) + 1);
       //push twice so there will be a match
       numbers.push(num);
       numbers.push(num);
   }
   var shuffled = shuffleArray(numbers);
   var game = document.getElementById("game");
   if (game.innerHTML == ""){
       game.classList.remove("stacked");
       loadCardBacks("cardBacks.json");
       //Interval = setInterval(startTimer, 1000);
   }
   if(game.innerHTML !== ""){
        backgroundImageURL = game.firstChild.lastChild.style.background;
        backgroundClass = game.firstChild.lastChild.classList;
        game.classList.add("restack");
        game.firstChild.lastChild.style.background = backgroundImageURL;
        if (game.classList.contains("restack") == true){
            game.addEventListener("transitionend", function(event) {
                transition++;
                if (transition == 1){
                    //clearInterval(Interval);
                    //Interval = setInterval(startTimer, 1000);
                    game.classList.remove("restack");
                    loadCardBacks("cardBacks.json");
                }
            }, false);
        }
   }
   game.innerHTML = "";
   for (var i = 0; i <= shuffled.length - 1; i++) {
       var div = document.createElement("div");
            div.setAttribute("class", "card");
            div.setAttribute("onclick", "cardFlip(this)");
       var front = document.createElement("div");
            front.setAttribute("class", "front");
       var span = document.createElement("span");
       var spanText = document.createTextNode(shuffled[i]);
            span.appendChild(spanText);
            front.appendChild(span);
       var back = document.createElement("div");
            back.setAttribute("class", "back " + backgroundClass);
            back.style.background = backgroundImageURL;
            div.appendChild(front);
            div.appendChild(back);
            game.appendChild(div);
            
   }
}


function loadCardBacks(url){
    var srvrRequest = new XMLHttpRequest();
        srvrRequest.onreadystatechange = function()
        {	
            if (srvrRequest.readyState === srvrRequest.DONE && srvrRequest.statusText === "OK"){
                var obj = JSON.parse(srvrRequest.responseText);
                var cards = document.getElementsByClassName("card");
                var rand = obj[Math.floor(Math.random() * obj.length)];
                    var imageURL = rand.imageURL;
                    var imageClass = rand.imageClass;
                    for (var i = 0; i < cards.length; i++) {
                        cards[i].lastChild.style.background = "url('" + imageURL + "')";
                        cards[i].lastChild.setAttribute("class", "back " + imageClass);
                        
                    }
            }
        }
        srvrRequest.open("GET", url, true);
        srvrRequest.send();
}
  
  //Adapted from http://www.cssscript.com/a-minimal-pure-javascript-stopwatch/
  function startTimer () {
    buttonStop.style.display = "inline-block";
    seconds++;
    
    if(seconds <= 9){
      appendSeconds.innerHTML = "0" + seconds;
    }
    
    if (seconds > 9){
      appendSeconds.innerHTML = seconds;
    }
  
    if (seconds > 59) {
      console.log("minutes");
      minutes++;
      appendMinutes.innerHTML = "0" + minutes;
      seconds = 0;
      appendSeconds.innerHTML = "0" + 0;
    }
    if (minutes > 9){
      appendMinutes.innerHTML = minutes;
    }
  }
  
function buttonReset() {
     clearInterval(Interval);
    minutes = "00";
    seconds = "00";
    appendMinutes.innerHTML = minutes;
    appendSeconds.innerHTML = seconds;
}

function beginTimer() {
    paused = false;
    buttonStop.removeAttribute("disabled");
    console.log("clicked");
    clearInterval(Interval);
    Interval = setInterval(startTimer, 1000);
};

function loadGames(obj){
    document.getElementById("gamesTable").innerHTML = "";
    if(obj.length === 0){
        addGames("", "");
    }
    else{
        for (var item in obj){
            var guesses = obj[item].guesses;
            var time = obj[item].time;
            addGames(guesses, time);
        }
    }
}

function addGames(guesses, time){
    if(guesses == "" && time == ""){
        var newRow = document.createElement("tr");
        newRow.setAttribute("id", "noGames");
        var newCell = document.createElement("td");
        newCell.setAttribute("colspan", "2");
        var text = document.createTextNode("No Games Played Yet! Go play!");
        newCell.appendChild(text);
        newRow.appendChild(newCell);
    }
    else{
        if (document.getElementById("noGames") !== null){
            document.getElementById("gamesTable").innerHTML = "";
        }
        // Create Row
        var newRow = document.createElement("tr");

        // Create first name cell and append text
        var newCell = document.createElement("td");
        var gText = document.createTextNode(guesses);
        newCell.appendChild(gText);
        newRow.appendChild(newCell);

        // Create last name cell and append text
        var newCell2 = document.createElement("td");
        var tText = document.createTextNode(time);
        newCell2.appendChild(tText);
        newRow.appendChild(newCell2);
    }
        // Find the table body element
        // Append the new row before the new input row
        var tableBody = document.getElementById("gamesTable");

        // Insert in reverse order
        tableBody.insertBefore(newRow, tableBody.firstChild);
}