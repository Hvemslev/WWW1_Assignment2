var points = 0;

document.querySelector(".circle").addEventListener("click", function(){
    points++
    document.getElementById("Score").innerText=points+"!"
})