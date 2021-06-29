#!/usr/bin/env node
"use strict";
var Elements;
(function (Elements) {
    function getById(id) {
        console.debug("Getting element " + id);
        return document.getElementById(id);
    }
    /* Buttons */
    Elements.forkPaperButton = getById("fork-paper");
    Elements.writeCodeButton = getById("write-code");
    Elements.finishForkButton = getById("finish-fork");
    Elements.upgradeDeveloperSkillLevelButton = getById("upgrade-developer-skill-level");
    Elements.getDeveloperFriendButton = getById("get-developer-friend");
    Elements.upgradeFriendsButton = getById("upgrade-friends");
    /* Paragraphs */
    Elements.linesOfCode = getById("lines-of-code");
    Elements.forksCompleted = getById("forks-completed");
    Elements.friendProduction = getById("friend-production");
})(Elements || (Elements = {}));
var Constants;
(function (Constants) {
    Constants.upgradeDeveloperSkillLevelBaseCost = 20;
    Constants.getDeveloperFriendBaseCost = 300;
    Constants.upgradeFriendsBaseCost = 650;
})(Constants || (Constants = {}));
var GameData = /** @class */ (function () {
    function GameData(linesOfCode, forksCompleted, developerSkillLevel, developerFriends, friendUpgrades) {
        this.linesOfCode = linesOfCode;
        this.forksCompleted = forksCompleted;
        this.developerSkillLevel = developerSkillLevel;
        this.developerFriends = developerFriends;
        this.friendUpgrades = friendUpgrades;
    }
    GameData.prototype.calculateUpgradeDeveloperSkillLevelCost = function () {
        return (Constants.upgradeDeveloperSkillLevelBaseCost +
            Math.floor(Math.pow(this.developerSkillLevel, 2)));
    };
    GameData.prototype.calculateGetDeveloperFriendCost = function () {
        return (Constants.getDeveloperFriendBaseCost +
            Math.floor(Math.pow(this.developerFriends, 2.5)));
    };
    GameData.prototype.calculateUpgradeFriendsCost = function () {
        return (Constants.upgradeFriendsBaseCost +
            Math.floor(Math.pow(this.friendUpgrades, 3)));
    };
    GameData.prototype.calculateLinesOfCodePerSecond = function () {
        return Math.floor((Math.pow((gameData.friendUpgrades + 1), 1.5)) * gameData.developerFriends);
    };
    return GameData;
}());
var gameData;
function newGame() {
    localStorage.removeItem("paperForkerSave");
    gameData = new GameData(0, 0, 0, 0, 0);
    saveGame();
    console.log("Started up a new game!");
}
function forkPaper() { }
function writeCode() {
    gameData.linesOfCode += gameData.developerSkillLevel + 1;
    updateDisplays();
}
function finishFork() {
    Elements.linesOfCode.innerHTML;
}
function upgradeDeveloperSkillLevel() {
    var cost = gameData.calculateUpgradeDeveloperSkillLevelCost();
    if (gameData.linesOfCode >= cost) {
        gameData.linesOfCode -= cost;
        gameData.developerSkillLevel += 1;
        updateDisplays();
    }
}
function getDeveloperFriend() {
    var cost = gameData.calculateGetDeveloperFriendCost();
    if (gameData.linesOfCode >= cost) {
        gameData.linesOfCode -= cost;
        gameData.developerFriends += 1;
        updateDisplays();
    }
}
function upgradeFriends() {
    var cost = gameData.calculateUpgradeFriendsCost();
    if (gameData.linesOfCode >= cost) {
        gameData.linesOfCode -= cost;
        gameData.friendUpgrades += 1;
        updateDisplays();
    }
}
function gameLoop() {
    gameData.linesOfCode += gameData.calculateLinesOfCodePerSecond();
    updateDisplays();
}
function updateDisplays() {
    Elements.linesOfCode.innerHTML =
        gameData.linesOfCode + " Lines of Code Written";
    Elements.forksCompleted.innerHTML =
        gameData.forksCompleted + " Forks Completed";
    Elements.friendProduction.innerHTML =
        "Your friends are currently producing " +
            gameData.calculateLinesOfCodePerSecond() +
            " LoC/s";
    Elements.upgradeDeveloperSkillLevelButton.innerHTML =
        "Upgrade Developer Skill Level (Currently Level " +
            gameData.developerSkillLevel +
            ") Cost: " +
            gameData.calculateUpgradeDeveloperSkillLevelCost() +
            " LoC";
    Elements.getDeveloperFriendButton.innerHTML =
        "Get Developer Friend (Currently Have " +
            gameData.developerFriends +
            ") Cost: " +
            gameData.calculateGetDeveloperFriendCost() +
            " LoC";
    Elements.upgradeFriendsButton.innerHTML =
        "Upgrade Friends (Currently Level " +
            gameData.friendUpgrades +
            ") Cost: " +
            gameData.calculateUpgradeFriendsCost() +
            " LoC";
}
function saveGame() {
    localStorage.setItem("paperForkerSave", JSON.stringify(gameData));
}
function loadGame() {
    var json = JSON.parse(localStorage.getItem("paperForkerSave"));
    if (json !== null) {
        var gameSave = new GameData(json.linesOfCode, json.forksCompleted, json.developerSkillLevel, json.developerFriends, json.friendUpgrades);
        gameData = gameSave;
        return true;
    }
    else {
        return false;
    }
}
function onLoad() {
    if (!loadGame()) {
        newGame();
    }
    window.setInterval(saveGame, 2000);
    window.setInterval(gameLoop, 1000);
    Elements.forkPaperButton.addEventListener("click", forkPaper);
    Elements.writeCodeButton.addEventListener("click", writeCode);
    Elements.finishForkButton.addEventListener("click", finishFork);
    Elements.upgradeDeveloperSkillLevelButton.addEventListener("click", upgradeDeveloperSkillLevel);
    Elements.getDeveloperFriendButton.addEventListener("click", getDeveloperFriend);
    Elements.upgradeFriendsButton.addEventListener("click", upgradeFriends);
    updateDisplays();
}
onLoad();
