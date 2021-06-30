#!/usr/bin/env node
//
// HEY!
// If you're interested in checking out how this works,
// I recommend that you look at the source directly:
// https://github.com/ItsTehBrian/paper-forker
//
"use strict";
var Elements;
(function (Elements) {
    function getById(id) {
        console.debug("Getting element " + id);
        return document.getElementById(id);
    }
    Elements.loadingScreen = getById("loading-screen");
    /* Fork Stuff */
    Elements.forkPaper = getById("fork-paper");
    Elements.forkText = getById("fork-text");
    /* Headers */
    Elements.statsHeader = getById("stats-header");
    Elements.upgradeHeader = getById("upgrades-header");
    /* Stats */
    Elements.linesOfCode = getById("lines-of-code");
    Elements.forks = getById("forks");
    Elements.friendProduction = getById("friend-production");
    /* Upgrades */
    Elements.upgradeDeveloperSkillLevel = getById("upgrade-developer-skill-level");
    Elements.getDeveloperFriend = getById("get-developer-friend");
    Elements.upgradeFriends = getById("upgrade-friends");
    /* Code */
    Elements.codeArea = getById("code-area");
    Elements.code = getById("code");
    Elements.cursor = getById("cursor");
})(Elements || (Elements = {}));
var GameData = /** @class */ (function () {
    function GameData(linesOfCode, forks, developerSkillLevel, developerFriends, friendUpgrades) {
        this.linesOfCode = linesOfCode;
        this.forks = forks;
        this.developerSkillLevel = developerSkillLevel;
        this.developerFriends = developerFriends;
        this.friendUpgrades = friendUpgrades;
    }
    GameData.prototype.calculateUpgradeDeveloperSkillLevelCost = function () {
        return 10 + Math.floor(Math.pow(this.developerSkillLevel, 2));
    };
    GameData.prototype.calculateGetDeveloperFriendCost = function () {
        return 300 + Math.floor(Math.pow(this.developerFriends, 2.5));
    };
    GameData.prototype.calculateUpgradeFriendsCost = function () {
        return 650 + Math.floor(Math.pow(this.friendUpgrades, 3));
    };
    GameData.prototype.calculateFriendCodePerSecond = function () {
        return Math.floor(Math.pow((this.friendUpgrades + 1), 1.5) * this.developerFriends);
    };
    GameData.prototype.calculateForkPaperRequirement = function () {
        return 10000;
    };
    GameData.prototype.canForkPaper = function () {
        if (this.forks === 0) {
            return true;
        }
        return this.linesOfCode >= this.calculateForkPaperRequirement();
    };
    return GameData;
}());
var Game;
(function (Game) {
    var itemName = "paperForkerSave";
    /**
     * Sets all GameData back to the game's starting point.
     */
    function reset() {
        localStorage.removeItem(itemName);
        Game.data = new GameData(0, 0, 0, 0, 0);
        save();
        console.log("Started up a new game!");
        Code.reset();
        hideStuff();
    }
    Game.reset = reset;
    /**
     * Saves the GameData to local storage.
     */
    function save() {
        localStorage.setItem(itemName, JSON.stringify(Game.data));
        console.log("Saved GameData to local storage.");
    }
    Game.save = save;
    /**
     * Loads the GameData from local storage.
     * @returns whether there was an available save
     */
    function load() {
        var json = JSON.parse(localStorage.getItem(itemName));
        if (json !== null) {
            var gameSave = new GameData(json.linesOfCode, json.forks, json.developerSkillLevel, json.developerFriends, json.friendUpgrades);
            Game.data = gameSave;
            console.log("Successfully loaded GameData from local storage.");
            return true;
        }
        else {
            console.log("Found no GameData in local storage.");
            return false;
        }
    }
    Game.load = load;
    /**
     * Tries to load the GameData from local storage, but if unavailable, resets the GameData to default state.
     */
    function loadOrReset() {
        if (!load()) {
            reset();
        }
    }
    Game.loadOrReset = loadOrReset;
})(Game || (Game = {}));
var Buttons;
(function (Buttons) {
    function forkPaper() {
        if (Game.data.forks === 0) {
            showStuff();
            Game.data.forks++;
            updateHTML();
        }
        else {
            var requirement = Game.data.calculateForkPaperRequirement();
            if (Game.data.linesOfCode >= requirement) {
                Game.data.linesOfCode = 0;
                Game.data.developerFriends = 0;
                Game.data.developerSkillLevel = 0;
                Game.data.friendUpgrades = 0;
                Game.data.forks++;
                Code.reset();
                updateHTML();
            }
        }
    }
    Buttons.forkPaper = forkPaper;
    function upgradeDeveloperSkillLevel() {
        var cost = Game.data.calculateUpgradeDeveloperSkillLevelCost();
        if (Game.data.linesOfCode >= cost) {
            Game.data.linesOfCode -= cost;
            Game.data.developerSkillLevel++;
            updateHTML();
        }
    }
    Buttons.upgradeDeveloperSkillLevel = upgradeDeveloperSkillLevel;
    function getDeveloperFriend() {
        var cost = Game.data.calculateGetDeveloperFriendCost();
        if (Game.data.linesOfCode >= cost) {
            Game.data.linesOfCode -= cost;
            Game.data.developerFriends++;
            updateHTML();
        }
    }
    Buttons.getDeveloperFriend = getDeveloperFriend;
    function upgradeFriends() {
        var cost = Game.data.calculateUpgradeFriendsCost();
        if (Game.data.linesOfCode >= cost) {
            Game.data.linesOfCode -= cost;
            Game.data.friendUpgrades++;
            updateHTML();
        }
    }
    Buttons.upgradeFriends = upgradeFriends;
})(Buttons || (Buttons = {}));
function gameLoop() {
    if (Game.data.calculateFriendCodePerSecond() >= 1) {
        Code.type(Game.data.calculateFriendCodePerSecond());
    }
    updateHTML();
}
function updateHTML() {
    Elements.forkPaper.disabled = !Game.data.canForkPaper();
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
var Code;
(function (Code) {
    function randomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    function countNewLines(str) {
        var re = /\n/g;
        return ((str || "").match(re) || []).length;
    }
    var sourceLinks = [
        "https://raw.githubusercontent.com/Hexaoxide/Carbon/rewrite/bukkit/src/main/java/net/draycia/carbon/bukkit/CarbonChatBukkit.java",
        "https://raw.githubusercontent.com/Hexaoxide/Carbon/rewrite/bukkit/src/main/java/net/draycia/carbon/bukkit/listeners/BukkitChatListener.java",
        "https://raw.githubusercontent.com/ItsTehBrian/RestrictionHelper/main/restrictionhelper-core/src/main/java/xyz/tehbrian/restrictionhelper/core/RestrictionLoader.java",
        "https://raw.githubusercontent.com/HangarMC/Hangar/master/src/main/java/io/papermc/hangar/service/internal/versions/VersionFactory.java",
        "https://raw.githubusercontent.com/monkegame/monkeOneTap/main/src/main/java/online/monkegame/monkebotplugin2/plugin Class.java",
    ];
    var source;
    var index = 0;
    var lastKey;
    function onKey(event) {
        if (lastKey !== event.key) {
            lastKey = event.key;
            type(Game.data.developerSkillLevel + 1);
        }
    }
    Code.onKey = onKey;
    function type(speed) {
        var newCode = source
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
        var newLines = countNewLines(newCode);
        // Check if there's a new line in it. (or multiple)
        if (newLines >= 1) {
            Game.data.linesOfCode += newLines;
            updateHTML();
        }
        Elements.code.innerHTML += newCode;
        index += speed;
        // Scroll the code area down to latest code.
        Elements.codeArea.scrollTop = Elements.codeArea.scrollHeight;
    }
    Code.type = type;
    function reset() {
        index = 0;
        Elements.code.innerHTML = "";
    }
    Code.reset = reset;
    function fetchSource() {
        fetch(randomFromArray(sourceLinks))
            .then(function (newSource) { return newSource.text(); })
            .then(function (newSource) {
            // Remove awful \r and \r\n.
            newSource = newSource.replaceAll(/(\r|\r\n)/gim, "");
            // Replace triple or more \n with just two \n.
            newSource = newSource.replaceAll(/\n{3,}/gim, "\n\n");
            // Get rid of icky import and package statements.
            newSource = newSource.replaceAll(/^(import|package).*\n/gim, "");
            // Remove empty lines at the start.
            source = newSource.replaceAll(/^\n*/gi, "");
            reset();
        });
    }
    Code.fetchSource = fetchSource;
    function toggleCursor() {
        Elements.cursor.style.color =
            "transparent" === Elements.cursor.style.color
                ? "inherit"
                : "transparent";
    }
    Code.toggleCursor = toggleCursor;
})(Code || (Code = {}));
function onLoad() {
    Game.loadOrReset();
    window.setInterval(Game.save, 2000);
    window.setInterval(gameLoop, 1000);
    Code.fetchSource();
    window.setInterval(Code.toggleCursor, 750);
    Elements.codeArea.addEventListener("keydown", Code.onKey);
    Elements.forkPaper.addEventListener("click", Buttons.forkPaper);
    Elements.upgradeDeveloperSkillLevel.addEventListener("click", Buttons.upgradeDeveloperSkillLevel);
    Elements.getDeveloperFriend.addEventListener("click", Buttons.getDeveloperFriend);
    Elements.upgradeFriends.addEventListener("click", Buttons.upgradeFriends);
    if (Game.data.forks >= 1) {
        showStuff();
    }
    else {
        hideStuff();
    }
    updateHTML();
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
