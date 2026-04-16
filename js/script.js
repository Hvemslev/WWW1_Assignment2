
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
    setPointString()
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
                                    "<h1>" + calcUpgradeCost(upgrade).toFixed(2) + "</h1>" +
                                    "<h2>" + upgrades[upgrade].name + "</h2>" +
                                    "<p>" + upgrades[upgrade].description + "</p>" +
                                    "<a href=\"#\" onclick=\"buyUpgrade('" + upgrade + "')\">Buy</a>" + // hacky dont read too much into it
                            "</div>\n";
    }

    upgradeBox.innerHTML = upgradeButtons;
}

function buyUpgrade(upgradeId) {
    let upgrade = upgrades[upgradeId];
    let cost = calcUpgradeCost(upgradeId);
    if (points >= cost) {
        points -= cost;
        unlockedUpgrades[upgradeId] = (unlockedUpgrades[upgradeId] || 0) + 1;
        saveLocalstorage();
        displayUpgrades();
    } else {
        alert("Not enough points to buy this upgrade!");
    }
    setPointString();
}

function calcUpgradeCost(upgradeId) {
    let baseCost = upgrades[upgradeId].cost;
    let amountOwned = unlockedUpgrades[upgradeId] || 0;

    let multiplier = 1;
    const scaling = upgrades[upgradeId].costScaling || {};
    const scaleFactor = scaling.base || scaling.factor || 1;
    if (scaling.type === "exponential") multiplier = Math.pow(scaleFactor, amountOwned);
    if (scaling.type === "linear") multiplier = 1 + (scaleFactor * amountOwned);

    return baseCost * multiplier;
}


function autoMoney() {
    var earningsPerSecond = calculateEarningsPerSecond();
    var increaseBy = parseFloat(earningsPerSecond * (AUTO_MONEY_INTERVAL / 1000));
    points += increaseBy;
    setPointString();
}

function calculatePointPerClick() {
    let clickValue = BASE_CLICK_VALUE;
    for (var upgrade in unlockedUpgrades) {
        let amount = unlockedUpgrades[upgrade];
        let upgradeEffect = upgrades[upgrade].effect || {};
        clickValue += (upgradeEffect.clickValue || 0) * amount;
    }
    return clickValue;
}

function calculateEarningsPerSecond() {
    let earningsPerSecond = 0;
    for (var upgrade in unlockedUpgrades) {
        let amount = unlockedUpgrades[upgrade];
        let upgradeEffect = upgrades[upgrade].effect || {};
        earningsPerSecond += (upgradeEffect.pointsPerSecond || 0) * amount;
    }
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

function setPointString() {
    document.getElementById("Score").innerText=points.toFixed(2);
}

window.addEventListener("load", function() {
    loadLocalStorage();
    loadUpgradesFromJson();
    calculateOfflineEarnings();
    setPointString();
});

setInterval(saveLocalstorage, LOCAL_STORAGE_SAVE_INTERVAL);
setInterval(autoMoney, AUTO_MONEY_INTERVAL)
setInterval(update, AUTO_MONEY_INTERVAL)
