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

namespace Game {
    export var data: GameData;
    const itemName: string = "paperForkerSave";

    /**
     * Sets all GameData back to the game's starting point.
     */
    export function reset(): void {
        localStorage.removeItem(itemName);
        data = new GameData(0, 0, 0, 0, 0);
        save();
        console.log("Started up a new game!");
    }

    /**
     * Saves the GameData to local storage.
     */
    export function save(): void {
        localStorage.setItem(itemName, JSON.stringify(data));
        console.log("Saved GameData to local storage.")
    }

    /**
     * Loads the GameData from local storage.
     * @returns whether there was an available save
     */
    export function load(): boolean {
        var json: any = JSON.parse(localStorage.getItem(itemName));
        if (json !== null) {
            var gameSave = new GameData(
                json.linesOfCode,
                json.forksCompleted,
                json.developerSkillLevel,
                json.developerFriends,
                json.friendUpgrades
            );

            data = gameSave;
            console.log("Successfully loaded GameData from local storage.");
            return true;
        } else {
            console.log("Found no GameData in local storage.");
            return false;
        }
    }

    /**
     * Tries to load the GameData from local storage, but if unavailable, resets the GameData to default state.
     */
    export function loadOrReset(): void {
        if (!load()) {
            reset();
        }
    }
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

function onLoad() {
   Game.loadOrReset();

    window.setInterval(Game.save, 1000);
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
