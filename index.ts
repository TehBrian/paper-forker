#!/usr/bin/env node

"use strict";

namespace Elements {
    function getById(id: string): HTMLElement {
        console.debug("Getting element " + id);
        return document.getElementById(id);
    }

    /* Buttons */
    export const forkPaperButton = getById("fork-paper");
    export const writeCodeButton = getById("write-code");
    export const finishForkButton = getById("finish-fork");
    export const upgradeDeveloperSkillLevelButton = getById(
        "upgrade-developer-skill-level"
    );
    export const getDeveloperFriendButton = getById("get-developer-friend");
    export const upgradeFriendsButton = getById("upgrade-friends");

    /* Paragraphs */
    export const linesOfCode = getById("lines-of-code");
    export const forksCompleted = getById("forks-completed");
    export const friendProduction = getById("friend-production");
}

namespace Constants {
    export const upgradeDeveloperSkillLevelBaseCost: number = 20;
    export const getDeveloperFriendBaseCost: number = 300;
    export const upgradeFriendsBaseCost: number = 650;
}

class GameData {
    linesOfCode: number;
    forksCompleted: number;
    developerSkillLevel: number;
    developerFriends: number;
    friendUpgrades: number;

    constructor(
        linesOfCode: number,
        forksCompleted: number,
        developerSkillLevel: number,
        developerFriends: number,
        friendUpgrades: number
    ) {
        this.linesOfCode = linesOfCode;
        this.forksCompleted = forksCompleted;
        this.developerSkillLevel = developerSkillLevel;
        this.developerFriends = developerFriends;
        this.friendUpgrades = friendUpgrades;
    }

    calculateUpgradeDeveloperSkillLevelCost(): number {
        return (
            Constants.upgradeDeveloperSkillLevelBaseCost +
            Math.floor(this.developerSkillLevel ** 2)
        );
    }

    calculateGetDeveloperFriendCost(): number {
        return (
            Constants.getDeveloperFriendBaseCost +
            Math.floor(this.developerFriends ** 2.5)
        );
    }

    calculateUpgradeFriendsCost(): number {
        return (
            Constants.upgradeFriendsBaseCost +
            Math.floor(this.friendUpgrades ** 3)
        );
    }

    calculateLinesOfCodePerSecond(): number {
        return Math.floor(
            (this.friendUpgrades + 1) ** 1.5 * this.developerFriends
        );
    }
}

var gameData: GameData;

function newGame() {
    localStorage.removeItem("paperForkerSave");
    gameData = new GameData(0, 0, 0, 0, 0);
    saveGame();
    console.log("Started up a new game!");
}

function forkPaper() {}

function writeCode() {
    gameData.linesOfCode += gameData.developerSkillLevel + 1;
    updateDisplays();
}

function finishFork() {
    Elements.linesOfCode.innerHTML;
}

function upgradeDeveloperSkillLevel() {
    const cost: number = gameData.calculateUpgradeDeveloperSkillLevelCost();
    if (gameData.linesOfCode >= cost) {
        gameData.linesOfCode -= cost;
        gameData.developerSkillLevel += 1;
        updateDisplays();
    }
}

function getDeveloperFriend() {
    const cost: number = gameData.calculateGetDeveloperFriendCost();
    if (gameData.linesOfCode >= cost) {
        gameData.linesOfCode -= cost;
        gameData.developerFriends += 1;
        updateDisplays();
    }
}

function upgradeFriends() {
    const cost: number = gameData.calculateUpgradeFriendsCost();
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
    var json: any = JSON.parse(localStorage.getItem("paperForkerSave"));
    if (json !== null) {
        var gameSave = new GameData(
            json.linesOfCode,
            json.forksCompleted,
            json.developerSkillLevel,
            json.developerFriends,
            json.friendUpgrades
        );

        gameData = gameSave;
        return true;
    } else {
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

    Elements.upgradeDeveloperSkillLevelButton.addEventListener(
        "click",
        upgradeDeveloperSkillLevel
    );
    Elements.getDeveloperFriendButton.addEventListener(
        "click",
        getDeveloperFriend
    );
    Elements.upgradeFriendsButton.addEventListener("click", upgradeFriends);

    updateDisplays();
}

onLoad();
