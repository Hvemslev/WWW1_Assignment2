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

function Save_GameData() {
    const dataToStore = {score: points};
    const dataInJSON = JSON.stringify(dataToStore);

    localStorage.setItem("gameData", dataInJSON);
}

function Get_GameData() {
    const gameDataText = localStorage.getItem("gameData");

    const gameDataObject = JSON.parse(gameDataText);
    points = gameDataObject.score;

    document.getElementById("Score").innerText = points + "!"
}

document.querySelector(".save").addEventListener("click", Save_GameData());
document.querySelector(".get").addEventListener("click", Get_GameData());

/*fetch("../json/data.json")
    .then(response => {
        if(!response.ok) {
            if(response.status === 404) {
                throw new Error("Resource not found (404)");
            }
            throw new Error("HTTP error! Status " + response.status);
        }
        return response.json();
    })
    .then(data => {

    })
    .catch(error => {
        console.error("Fetch error:", error.message);
    })*/
