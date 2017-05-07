window.onload = function(){
  canvasGradient();  
};



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


