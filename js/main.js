var width = window.innerWidth;
var height = window.innerHeight;

document.getElementById("homepage").style.height = width + "px";
document.getElementById("homepage").style.width = height +"px";

function resize(d) {

  document.getElementById(d).style.height = height + "px";
  document.getElementById(d).style.width = width + "px";
};
 resize("homepage");

 window.onresize = function() {
   resize("homepage");
   
 };
