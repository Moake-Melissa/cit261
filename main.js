var best;
var counter;


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
                if (counter < best || best === 0){
                    localStorage.setItem("bestGuess", counter);
                    document.getElementById("best").innerHTML = counter;
                    best = counter;
                }
                
                setTimeout(function(){
                if (confirm("Congrats!\n\nYou have found all the matches!\n\nWould you like to start a new game?")){
                    makeGame();
                }
                },200);
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
   counter = 0;
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
   if(game.classList.contains("restack") === false){
       loadCardBacks("cardBacks.json");
       console.log("no restack");
   }
   if(game.innerHTML !== ""){
      setTimeout(function(){
            game.classList.add("restack");
        }, 500);
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
            back.setAttribute("class", "back");
            div.appendChild(front);
            div.appendChild(back);
            game.appendChild(div);
   }
   setTimeout(function(){
        /*if(game.classList.contains("restack") === true){
            var restack = document.getElementsByClassName("restack");
            console.log(restack);
            restack.addEventListener("webkitTransitionEnd", loadCardBacks("cardBacks.json"));
            restack.addEventListener("transitionEnd", loadCardBacks("cardBacks.json"));
            console.log("restack");
        }*/
        game.classList.remove("restack");
    }, 3000);
   setTimeout(function(){
        game.classList.remove("stacked");
    }, 500);
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
                        cards[i].lastChild.classList.add(imageClass);
                        
                    }
            }
        }
        srvrRequest.open("GET", url, true);
        srvrRequest.send();
}