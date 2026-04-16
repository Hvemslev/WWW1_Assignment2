
/*document.querySelector(".circle").addEventListener("click", function(){
    points++
    document.getElementById("Score").innerText=points+"!"
    diameter = 5.5
})*/

const OFFLINE_EARNING_EFFICIENCY = 0.25; 
const MIN_OFFLINE_EARNING_TIME = 60000; // 1 minute in milliseconds
const LOCAL_STORAGE_SAVE_INTERVAL = 1000; // Save every second
const AUTO_MONEY_INTERVAL = 25; // Auto money every 25ms for smooth increase
const BASE_CLICK_VALUE = 1;

var points = 0
var diameter = 5

var upgrades = {} // fetched upgrade structure from json/upgrades.json
var unlockedUpgrades = {} // {upgradeName: amount} - upgradeName refers to name in upgrades.json


document.querySelector(".circle").addEventListener("click", function(){
    points += parseFloat(calculatePointPerClick());
    document.getElementById("Score").innerText=points+"!"
    diameter = 5.5
    console.log(points);
})

function update() {
  requestAnimationFrame(() => {
    if(diameter>5){
        diameter-=0.02
    }
    document.querySelector(".circle").style.width=diameter+"rem"
    document.querySelector(".circle").style.height=diameter+"rem"
  });
}

function saveLocalstorage() {
    localStorage.setItem("points", points);
    localStorage.setItem("lastTimestamp", new Date().getTime());
    localStorage.setItem("unlockedUpgrades", JSON.stringify(unlockedUpgrades));
}

function loadLocalStorage() {
    points = parseFloat(localStorage.getItem("points") || 0);
    unlockedUpgrades = localStorage.getItem("unlockedUpgrades") ? JSON.parse(localStorage.getItem("unlockedUpgrades")) : {};
}

function loadUpgradesFromJson() {
    fetch("json/upgrades.json")
        .then(response => response.json())
        .then(data => {
            upgrades = data;
            console.log(upgrades);
            displayUpgrades();
        });
}


function displayUpgrades() {
    let upgradeBox = document.getElementById("upgrades");
    let upgradeButtons = "";
    for (var upgrade in upgrades) {
        console.log(upgrade);
        upgradeButtons +=   "<div>" + 
                                    "<h1>" + upgrades[upgrade].cost + "</h1>" +
                                    "<h2>" + upgrades[upgrade].name + "</h2>" +
                            "</div>\n";
    }

    upgradeBox.innerHTML = upgradeButtons;

    document.querySelectorAll("#upgrades div").forEach(function(button) {
        button.addEventListener("click", function(){
        // Put upgrade function here
        })
    });
}

function autoMoney() {
    var earningsPerSecond = calculateEarningsPerSecond();
    points += parseFloat(earningsPerSecond* (AUTO_MONEY_INTERVAL / 1000));
}

function calculatePointPerClick() {
    let clickValue = BASE_CLICK_VALUE;
    // loop through upgrades, multiply by amount of upgrades
    return clickValue;
}

function calculateEarningsPerSecond() {
    let earningsPerSecond = 0;
    // loop through upgrades, multiply by amount of upgrades
    return earningsPerSecond;
}

function calculateOfflineEarnings() {
    var lastVisit = localStorage.getItem("lastTimestamp");

    if (lastVisit) {
        var currentTime = new Date().getTime();
        var timeDifference = currentTime - lastVisit;

        if (timeDifference > MIN_OFFLINE_EARNING_TIME) {
            var offlineEarnings = Math.floor(calculateEarningsPerSecond() * (timeDifference / 1000) * OFFLINE_EARNING_EFFICIENCY);
            points += offlineEarnings;
            alert(`Welcome back! You've earned ${offlineEarnings} points while you were away.`);
        }
    }
}


window.addEventListener("load", function() {
    loadLocalStorage();
    loadUpgradesFromJson();
    calculateOfflineEarnings();
    document.getElementById("Score").innerText=points+"!"
});

setInterval(saveLocalstorage, LOCAL_STORAGE_SAVE_INTERVAL);
setInterval(autoMoney, AUTO_MONEY_INTERVAL)
setInterval(update, AUTO_MONEY_INTERVAL)
