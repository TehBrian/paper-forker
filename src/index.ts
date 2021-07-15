#!/usr/bin/env node
//
// HEY!
// If you're interested in checking out how this works,
// I recommend that you look at the source directly:
// https://github.com/ItsTehBrian/paper-forker
//
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

namespace VisibilityController {
    /**
     * The main game elements that should be immediately shown.
     */
    const mainElements = [
        Elements.forkText,
        Elements.linesOfCode,
        Elements.friendProduction,
        Elements.upgradeFriends,
        Elements.getDeveloperFriend,
        Elements.upgradeDeveloperSkillLevel,
        Elements.code,
        Elements.codeArea,
        Elements.forks,
        Elements.upgradeHeader,
        Elements.statsHeader,
    ];

    /**
     * Show an array of elements.
     * @param elements the array of elements
     */
    function show(elements: HTMLElement[]) {
        for (var element of elements) {
            element.style.visibility = "visible";
        }
    }

    /**
     * Hide an array of elements.
     * @param elements the array of elements
     */
    function hide(elements: HTMLElement[]) {
        for (var element of elements) {
            element.style.visibility = "hidden";
        }
    }

    /**
     * Show the main game elements.
     */
    export function showMain() {
        show(mainElements);
    }

    /**
     * Hide the main gane elements.
     */
    export function hideMain() {
        hide(mainElements);
    }
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
}

namespace Prestige {
    export function calculateRequirement(): number {
        return 2000 + Math.floor(Game.data.forks ** 1.7);
    }

    export function forkPaper(): void {
        if (this.canForkPaper()) {
            Game.data.linesOfCode = 0;
            Game.data.developerFriends = 0;
            Game.data.developerSkillLevel = 0;
            Game.data.friendUpgrades = 0;
            Game.data.forks++;
            CodeArea.reset();
        }
    }

    export function canForkPaper(): boolean {
        if (Game.data.forks === 0) {
            return true;
        }
        return Game.data.linesOfCode >= this.calculateRequirement();
    }
}

namespace Purchase {
    abstract class AbstractPurchase {
        abstract calculateCost(): number;

        abstract purchase(): void;

        abstract canPurchase(): void;
    }

    class UpgradeDeveloperSkillLevel extends AbstractPurchase {
        calculateCost(): number {
            return 10 + Math.floor(Game.data.developerSkillLevel ** 1.6);
        }
        purchase(): void {
            if (this.canPurchase()) {
                Game.data.linesOfCode -= this.calculateCost();
                Game.data.developerSkillLevel++;
            }
        }
        canPurchase(): boolean {
            return Game.data.linesOfCode >= this.calculateCost();
        }
    }

    class GetDeveloperFriend extends AbstractPurchase {
        calculateCost(): number {
            return 80 + Math.floor(Game.data.developerFriends ** 1.9);
        }
        purchase(): void {
            if (this.canPurchase()) {
                Game.data.linesOfCode -= this.calculateCost();
                Game.data.developerFriends++;
            }
        }
        canPurchase(): boolean {
            return Game.data.linesOfCode >= this.calculateCost();
        }
    }

    class UpgradeFriends extends AbstractPurchase {
        calculateCost(): number {
            return 160 + Math.floor(Game.data.friendUpgrades ** 2.2);
        }
        purchase(): void {
            if (this.canPurchase()) {
                Game.data.linesOfCode -= this.calculateCost();
                Game.data.friendUpgrades++;
            }
        }
        canPurchase(): boolean {
            return Game.data.linesOfCode >= this.calculateCost();
        }
    }

    export const upgradeDeveloperSkillLevel: UpgradeDeveloperSkillLevel =
        new UpgradeDeveloperSkillLevel();
    export const getDeveloperFriend: GetDeveloperFriend =
        new GetDeveloperFriend();
    export const upgradeFriends: UpgradeFriends = new UpgradeFriends();
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
        CodeArea.reset();
        VisibilityController.hideMain();
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
            VisibilityController.showMain();
        }
        Prestige.forkPaper();
        updateView();
    }

    export function upgradeDeveloperSkillLevel() {
        Purchase.upgradeDeveloperSkillLevel.purchase();
        updateView();
    }

    export function getDeveloperFriend() {
        Purchase.getDeveloperFriend.purchase();
        updateView();
    }

    export function upgradeFriends() {
        Purchase.upgradeFriends.purchase();
        updateView();
    }
}

function calculateFriendCodePerSecond(): number {
    return Math.floor(
        (Game.data.friendUpgrades + 1) ** 2 * Game.data.developerFriends
    );
}

function gameLoop(): void {
    if (calculateFriendCodePerSecond() >= 1) {
        CodeArea.type(calculateFriendCodePerSecond());
    }
    updateView();
}

function updateView() {
    Elements.forkPaper.disabled = !Prestige.canForkPaper();

    Elements.linesOfCode.innerHTML =
        Game.data.linesOfCode + " Lines of Code Written";
    Elements.forks.innerHTML =
        Game.data.forks + " Paper Fork" + (Game.data.forks > 1 ? "s" : "");
    Elements.friendProduction.innerHTML =
        "Your friends are currently mashing their keyboard " +
        calculateFriendCodePerSecond() +
        "x per second";

    Elements.upgradeDeveloperSkillLevel.innerHTML =
        "Upgrade Developer Skill Level (Currently Level " +
        Game.data.developerSkillLevel +
        ") Cost: " +
        Purchase.upgradeDeveloperSkillLevel.calculateCost() +
        " LoC";
    Elements.getDeveloperFriend.innerHTML =
        "Get Developer Friend (Currently Have " +
        Game.data.developerFriends +
        ") Cost: " +
        Purchase.getDeveloperFriend.calculateCost() +
        " LoC";
    Elements.upgradeFriends.innerHTML =
        "Upgrade Friends (Currently Level " +
        Game.data.friendUpgrades +
        ") Cost: " +
        Purchase.upgradeFriends.calculateCost() +
        " LoC";
    Elements.forkText.innerHTML =
        "After " +
        Prestige.calculateRequirement() +
        " lines of code, you can reasonably call this fork finished and begin anew.";
}

namespace CodeArea {
    function randomFromArray(array: string | any[]) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function countNewLines(str: string): number {
        const re = /\n/g;
        return ((str || "").match(re) || []).length;
    }

    const sourceLinks = [
        "https://raw.githubusercontent.com/Hexaoxide/Carbon/rewrite/bukkit/src/main/java/net/draycia/carbon/bukkit/CarbonChatBukkit.java",
        "https://raw.githubusercontent.com/Hexaoxide/Carbon/rewrite/bukkit/src/main/java/net/draycia/carbon/bukkit/listeners/BukkitChatListener.java",
        "https://raw.githubusercontent.com/ItsTehBrian/RestrictionHelper/main/restrictionhelper-core/src/main/java/xyz/tehbrian/restrictionhelper/core/RestrictionLoader.java",
        "https://raw.githubusercontent.com/HangarMC/Hangar/master/src/main/java/io/papermc/hangar/service/internal/versions/VersionFactory.java",
        "https://raw.githubusercontent.com/monkegame/monkeOneTap/main/src/main/java/online/monkegame/monkebotplugin2/pluginClass.java",
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
            updateView();
        }

        Elements.code.innerHTML += newCode;
        index += speed;
        // Scroll the code area down to latest code.
        Elements.codeArea.scrollTop = Elements.codeArea.scrollHeight;
    }

    export function reset(): void {
        index = 0;
        Elements.code.innerHTML = "";
    }

    export function fetchSource(): void {
        fetch(randomFromArray(sourceLinks))
            .then((newSource) => newSource.text())
            .then((newSource) => {
                // Remove awful \r and \r\n.
                newSource = newSource.replaceAll(/(\r|\r\n)/gim, "");

                // Replace triple or more \n with just two \n.
                newSource = newSource.replaceAll(/\n{3,}/gim, "\n\n");

                // Get rid of icky import and package statements.
                newSource = newSource.replaceAll(
                    /^(import|package).*\n/gim,
                    ""
                );

                // Remove empty lines at the start.
                source = newSource.replaceAll(/^\n*/gi, "");

                reset();
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

    CodeArea.fetchSource();

    window.setInterval(CodeArea.toggleCursor, 750);
    Elements.codeArea.addEventListener("keydown", CodeArea.onKey);

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
        VisibilityController.showMain();
    } else {
        VisibilityController.hideMain();
    }

    updateView();

    Elements.loadingScreen.style.visibility = "hidden";
}

onLoad();
