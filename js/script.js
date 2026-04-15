var points = 0;
var diameter = 5

document.querySelector(".circle").addEventListener("click", function(){
    points++
    document.getElementById("Score").innerText=points+"!"
    diameter = 5.5
})




function update() {
  requestAnimationFrame(() => {
    if(diameter>5){
        diameter-=0.1
    }
    document.querySelector(".circle").style.width=diameter+"rem"
    document.querySelector(".circle").style.height=diameter+"rem"

    update();
  });
}
update();



