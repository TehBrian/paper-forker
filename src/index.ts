#!/usr/bin/env node

"use strict";

namespace Elements {
    function getById(id: string): HTMLElement {
        console.debug("Getting element " + id);
        return document.getElementById(id);
    }

    export const loadingScreen = getById("loading-screen");

    /* Fork Stuff */
    export const forkPaper = <HTMLButtonElement>getById("fork-paper");
    export const forkText = getById("fork-text");

    /* Headers */
    export const statsHeader = getById("stats-header");
    export const upgradeHeader = getById("upgrades-header");

    /* Stats */
    export const linesOfCode = getById("lines-of-code");
    export const forks = getById("forks");
    export const friendProduction = getById("friend-production");

    /* Upgrades */
    export const upgradeDeveloperSkillLevel = getById(
        "upgrade-developer-skill-level"
    );
    export const getDeveloperFriend = getById("get-developer-friend");
    export const upgradeFriends = getById("upgrade-friends");

    /* Code */
    export const codeArea = getById("code-area");
    export const code = getById("code");
    export const cursor = getById("cursor");
}

namespace Constants {
    export const upgradeDeveloperSkillLevelBaseCost: number = 10;
    export const getDeveloperFriendBaseCost: number = 300;
    export const upgradeFriendsBaseCost: number = 650;
}

class GameData {
    linesOfCode: number;
    forks: number;
    developerSkillLevel: number;
    developerFriends: number;
    friendUpgrades: number;

    constructor(
        linesOfCode: number,
        forks: number,
        developerSkillLevel: number,
        developerFriends: number,
        friendUpgrades: number
    ) {
        this.linesOfCode = linesOfCode;
        this.forks = forks;
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

    calculateFriendCodePerSecond(): number {
        return Math.floor(
            (this.friendUpgrades + 1) ** 1.5 * this.developerFriends
        );
    }

    calculateForkPaperRequirement(): number {
        return 10000;
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
        hideStuff();
        Elements.forkPaper.disabled = false;
    }

    /**
     * Saves the GameData to local storage.
     */
    export function save(): void {
        localStorage.setItem(itemName, JSON.stringify(data));
        console.log("Saved GameData to local storage.");
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
                json.forks,
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

namespace Buttons {
    export function forkPaper() {
        if (Game.data.forks === 0) {
            showStuff();
            Elements.forkPaper.disabled = true;
            Game.data.forks++;
            updateDisplays();
        } else {
            const requirement: number =
                Game.data.calculateForkPaperRequirement();
            if (Game.data.forks >= requirement) {
                Game.data.linesOfCode = 0;
                Game.data.developerFriends = 0;
                Game.data.developerSkillLevel = 0;
                Game.data.forks++;
                updateDisplays();
            }
        }
    }

    export function upgradeDeveloperSkillLevel() {
        const cost: number =
            Game.data.calculateUpgradeDeveloperSkillLevelCost();
        if (Game.data.linesOfCode >= cost) {
            Game.data.linesOfCode -= cost;
            Game.data.developerSkillLevel++;
            updateDisplays();
        }
    }

    export function getDeveloperFriend() {
        const cost: number = Game.data.calculateGetDeveloperFriendCost();
        if (Game.data.linesOfCode >= cost) {
            Game.data.linesOfCode -= cost;
            Game.data.developerFriends++;
            updateDisplays();
        }
    }

    export function upgradeFriends() {
        const cost: number = Game.data.calculateUpgradeFriendsCost();
        if (Game.data.linesOfCode >= cost) {
            Game.data.linesOfCode -= cost;
            Game.data.friendUpgrades++;
            updateDisplays();
        }
    }
}

function gameLoop() {
    if (Game.data.calculateFriendCodePerSecond() >= 1) {
        Code.type(Game.data.calculateFriendCodePerSecond());
    }
    updateDisplays();
}

function updateDisplays() {
    Elements.linesOfCode.innerHTML =
        Game.data.linesOfCode + " Lines of Code Written";
    Elements.forks.innerHTML =
        Game.data.forks + " Paper Fork" + (Game.data.forks > 1 ? "s" : "");
    Elements.friendProduction.innerHTML =
        "Your friends are currently mashing their keyboard " +
        Game.data.calculateFriendCodePerSecond() +
        "x per second";

    Elements.upgradeDeveloperSkillLevel.innerHTML =
        "Upgrade Developer Skill Level (Currently Level " +
        Game.data.developerSkillLevel +
        ") Cost: " +
        Game.data.calculateUpgradeDeveloperSkillLevelCost() +
        " LoC";
    Elements.getDeveloperFriend.innerHTML =
        "Get Developer Friend (Currently Have " +
        Game.data.developerFriends +
        ") Cost: " +
        Game.data.calculateGetDeveloperFriendCost() +
        " LoC";
    Elements.upgradeFriends.innerHTML =
        "Upgrade Friends (Currently Level " +
        Game.data.friendUpgrades +
        ") Cost: " +
        Game.data.calculateUpgradeFriendsCost() +
        " LoC";
    Elements.forkText.innerHTML =
        "After " +
        Game.data.calculateForkPaperRequirement() +
        " lines of code, you can reasonably call this fork finished and begin anew.";
}

namespace Code {
    function randomFromArray(array: string | any[]) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function countNewLines(str): number {
        const re = /\n/g;
        return ((str || "").match(re) || []).length;
    }

    const sourceLinks = [
        "https://raw.githubusercontent.com/Hexaoxide/Carbon/rewrite/bukkit/src/main/java/net/draycia/carbon/bukkit/CarbonChatBukkit.java",
        "https://raw.githubusercontent.com/Hexaoxide/Carbon/rewrite/bukkit/src/main/java/net/draycia/carbon/bukkit/listeners/BukkitChatListener.java",
        "https://raw.githubusercontent.com/ItsTehBrian/RestrictionHelper/main/restrictionhelper-core/src/main/java/xyz/tehbrian/restrictionhelper/core/RestrictionLoader.java",
    ];

    let source: string;
    let index = 0;
    let lastKey: string;

    export function onKey(event: KeyboardEvent): void {
        if (lastKey !== event.key) {
            lastKey = event.key;
            type(Game.data.developerSkillLevel + 1);
        }
    }

    export function type(speed: number): void {
        let newCode = source
            .substring(index, index + speed)
            // Shamelessly stolen from hackertyper.net. All credit goes to the creator for this magical little .replace <3
            .replace(/[\u00A0-\u9999<>\&]/gim, function (a) {
                return "&#" + a.charCodeAt(0) + ";";
            });

        // True if string is empty.
        if (!newCode) {
            fetchSource();
            return;
        }

        const newLines = countNewLines(newCode);
        // Check if there's a new line in it. (or multiple)
        if (newLines >= 1) {
            Game.data.linesOfCode += newLines;
            updateDisplays();
        }

        Elements.code.innerHTML += newCode;
        index += speed;
        // Scroll the code area down to latest code.
        Elements.codeArea.scrollTop = Elements.codeArea.scrollHeight;
    }

    export function fetchSource(): void {
        fetch(randomFromArray(sourceLinks))
            .then((newSource) => newSource.text())
            .then((newSource) => {
                index = 0;
                Elements.code.innerHTML = "";

                // Get rid of icky import and package statements.
                newSource = newSource.replaceAll(
                    /^(import|package).*\n/gim,
                    ""
                );

                // Remove empty lines at the start.
                source = newSource.replaceAll(/^\n*/gi, "");
            });
    }

    export function toggleCursor(): void {
        Elements.cursor.style.color =
            "transparent" === Elements.cursor.style.color
                ? "inherit"
                : "transparent";
    }
}

function onLoad() {
    Game.loadOrReset();

    window.setInterval(Game.save, 2000);
    window.setInterval(gameLoop, 1000);

    Code.fetchSource();

    window.setInterval(Code.toggleCursor, 750);
    Elements.codeArea.addEventListener("keydown", Code.onKey);

    Elements.forkPaper.addEventListener("click", Buttons.forkPaper);

    Elements.upgradeDeveloperSkillLevel.addEventListener(
        "click",
        Buttons.upgradeDeveloperSkillLevel
    );
    Elements.getDeveloperFriend.addEventListener(
        "click",
        Buttons.getDeveloperFriend
    );
    Elements.upgradeFriends.addEventListener("click", Buttons.upgradeFriends);

    if (Game.data.forks >= 1) {
        showStuff();
    } else {
        hideStuff();
    }

    updateDisplays();

    Elements.loadingScreen.style.visibility = "hidden";
}

function hideStuff() {
    Elements.forkText.style.visibility = "hidden";
    Elements.linesOfCode.style.visibility = "hidden";
    Elements.friendProduction.style.visibility = "hidden";
    Elements.upgradeFriends.style.visibility = "hidden";
    Elements.getDeveloperFriend.style.visibility = "hidden";
    Elements.upgradeDeveloperSkillLevel.style.visibility = "hidden";
    Elements.code.style.visibility = "hidden";
    Elements.codeArea.style.visibility = "hidden";
    Elements.forks.style.visibility = "hidden";
    Elements.upgradeHeader.style.visibility = "hidden";
    Elements.statsHeader.style.visibility = "hidden";
}

function showStuff() {
    Elements.forkText.style.visibility = "visible";
    Elements.linesOfCode.style.visibility = "visible";
    Elements.friendProduction.style.visibility = "visible";
    Elements.upgradeFriends.style.visibility = "visible";
    Elements.getDeveloperFriend.style.visibility = "visible";
    Elements.upgradeDeveloperSkillLevel.style.visibility = "visible";
    Elements.code.style.visibility = "visible";
    Elements.codeArea.style.visibility = "visible";
    Elements.forks.style.visibility = "visible";
    Elements.upgradeHeader.style.visibility = "visible";
    Elements.statsHeader.style.visibility = "visible";
}

onLoad();
