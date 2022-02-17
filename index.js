#!/usr/bin/env node
//
// HEY!
// If you're interested in checking out how this works,
// I recommend that you look at the source directly:
// https://github.com/TehBrian/paper-forker
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
    Elements.upgradeDeveloperSkillLevel = (getById("upgrade-developer-skill-level"));
    Elements.getDeveloperFriend = (getById("get-developer-friend"));
    Elements.upgradeFriends = getById("upgrade-friends");
    /* Code */
    Elements.codeArea = getById("code-area");
    Elements.code = getById("code");
    Elements.cursor = getById("cursor");
})(Elements || (Elements = {}));
var View;
(function (View) {
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
    function show(elements) {
        for (var element of elements) {
            element.style.visibility = "visible";
        }
    }
    /**
     * Hide an array of elements.
     * @param elements the array of elements
     */
    function hide(elements) {
        for (var element of elements) {
            element.style.visibility = "hidden";
        }
    }
    /**
     * Show the main game elements.
     */
    function showMain() {
        show(mainElements);
    }
    View.showMain = showMain;
    /**
     * Hide the main game elements.
     */
    function hideMain() {
        hide(mainElements);
    }
    View.hideMain = hideMain;
    function showLoadingScreen() {
        Elements.loadingScreen.style.visibility = "visible";
    }
    View.showLoadingScreen = showLoadingScreen;
    function hideLoadingScreen() {
        Elements.loadingScreen.style.visibility = "hidden";
    }
    View.hideLoadingScreen = hideLoadingScreen;
    /**
     * Updates the view.
     */
    function update() {
        Elements.linesOfCode.innerHTML =
            Game.data.linesOfCode + " Lines of Code Written";
        Elements.forks.innerHTML =
            Game.data.forks + " Paper Fork" + (Game.data.forks > 1 ? "s" : "");
        Elements.friendProduction.innerHTML =
            "Your friends are currently mashing their keyboard " +
                GameLoop.calculateCodePerSecond() +
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
        Elements.forkPaper.disabled = !Prestige.canForkPaper();
        Elements.upgradeDeveloperSkillLevel.disabled =
            !Purchase.upgradeDeveloperSkillLevel.canPurchase();
        Elements.getDeveloperFriend.disabled =
            !Purchase.getDeveloperFriend.canPurchase();
        Elements.upgradeFriends.disabled =
            !Purchase.upgradeFriends.canPurchase();
    }
    View.update = update;
})(View || (View = {}));
class GameData {
    constructor(linesOfCode, forks, developerSkillLevel, developerFriends, friendUpgrades) {
        this.linesOfCode = linesOfCode;
        this.forks = forks;
        this.developerSkillLevel = developerSkillLevel;
        this.developerFriends = developerFriends;
        this.friendUpgrades = friendUpgrades;
    }
}
var Prestige;
(function (Prestige) {
    function calculateRequirement() {
        return 2000 + Math.floor(Game.data.forks ** 1.7);
    }
    Prestige.calculateRequirement = calculateRequirement;
    function forkPaper() {
        if (this.canForkPaper()) {
            Game.data.linesOfCode = 0;
            Game.data.developerFriends = 0;
            Game.data.developerSkillLevel = 0;
            Game.data.friendUpgrades = 0;
            Game.data.forks++;
            CodeArea.reset();
        }
    }
    Prestige.forkPaper = forkPaper;
    function canForkPaper() {
        if (Game.data.forks === 0) {
            return true;
        }
        return Game.data.linesOfCode >= this.calculateRequirement();
    }
    Prestige.canForkPaper = canForkPaper;
})(Prestige || (Prestige = {}));
var Purchase;
(function (Purchase) {
    class AbstractPurchase {
    }
    class UpgradeDeveloperSkillLevel extends AbstractPurchase {
        calculateCost() {
            return 10 + Math.floor(Game.data.developerSkillLevel ** 1.6);
        }
        purchase() {
            if (this.canPurchase()) {
                Game.data.linesOfCode -= this.calculateCost();
                Game.data.developerSkillLevel++;
            }
        }
        canPurchase() {
            return Game.data.linesOfCode >= this.calculateCost();
        }
    }
    class GetDeveloperFriend extends AbstractPurchase {
        calculateCost() {
            return 80 + Math.floor(Game.data.developerFriends ** 1.9);
        }
        purchase() {
            if (this.canPurchase()) {
                Game.data.linesOfCode -= this.calculateCost();
                Game.data.developerFriends++;
            }
        }
        canPurchase() {
            return Game.data.linesOfCode >= this.calculateCost();
        }
    }
    class UpgradeFriends extends AbstractPurchase {
        calculateCost() {
            return 160 + Math.floor(Game.data.friendUpgrades ** 2.2);
        }
        purchase() {
            if (this.canPurchase()) {
                Game.data.linesOfCode -= this.calculateCost();
                Game.data.friendUpgrades++;
            }
        }
        canPurchase() {
            return Game.data.linesOfCode >= this.calculateCost();
        }
    }
    Purchase.upgradeDeveloperSkillLevel = new UpgradeDeveloperSkillLevel();
    Purchase.getDeveloperFriend = new GetDeveloperFriend();
    Purchase.upgradeFriends = new UpgradeFriends();
})(Purchase || (Purchase = {}));
var Game;
(function (Game) {
    const itemName = "paperForkerSave";
    /**
     * Sets the game back to the its starting point.
     */
    function reset() {
        localStorage.removeItem(itemName);
        Game.data = new GameData(0, 0, 0, 0, 0);
        save();
        CodeArea.reset();
        View.hideMain();
        View.update();
        console.log("Started up a new game!");
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
var Button;
(function (Button) {
    function forkPaper() {
        if (Game.data.forks === 0) {
            View.showMain();
        }
        Prestige.forkPaper();
        View.update();
    }
    Button.forkPaper = forkPaper;
    function upgradeDeveloperSkillLevel() {
        Purchase.upgradeDeveloperSkillLevel.purchase();
        View.update();
    }
    Button.upgradeDeveloperSkillLevel = upgradeDeveloperSkillLevel;
    function getDeveloperFriend() {
        Purchase.getDeveloperFriend.purchase();
        View.update();
    }
    Button.getDeveloperFriend = getDeveloperFriend;
    function upgradeFriends() {
        Purchase.upgradeFriends.purchase();
        View.update();
    }
    Button.upgradeFriends = upgradeFriends;
})(Button || (Button = {}));
var GameLoop;
(function (GameLoop) {
    function calculateCodePerSecond() {
        return Math.floor((Game.data.friendUpgrades + 1) ** 2 * Game.data.developerFriends);
    }
    GameLoop.calculateCodePerSecond = calculateCodePerSecond;
    function run() {
        if (calculateCodePerSecond() >= 1) {
            CodeArea.type(calculateCodePerSecond());
        }
        View.update();
        Game.save();
    }
    GameLoop.run = run;
})(GameLoop || (GameLoop = {}));
var CodeArea;
(function (CodeArea) {
    function randomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    function countNewLines(str) {
        const re = /\n/g;
        return ((str || "").match(re) || []).length;
    }
    const sourceLinks = [
        "https://raw.githubusercontent.com/Hexaoxide/Carbon/rewrite/bukkit/src/main/java/net/draycia/carbon/bukkit/CarbonChatBukkit.java",
        "https://raw.githubusercontent.com/Hexaoxide/Carbon/rewrite/bukkit/src/main/java/net/draycia/carbon/bukkit/listeners/BukkitChatListener.java",
        "https://raw.githubusercontent.com/TehBrian/RestrictionHelper/main/restrictionhelper-core/src/main/java/xyz/tehbrian/restrictionhelper/core/RestrictionLoader.java",
        "https://raw.githubusercontent.com/HangarMC/Hangar/master/src/main/java/io/papermc/hangar/service/internal/versions/VersionFactory.java",
        "https://raw.githubusercontent.com/monkegame/monkeOneTap/main/src/main/java/online/monkegame/monkebotplugin2/pluginClass.java",
        "https://raw.githubusercontent.com/monkegame/monkebotJ/main/src/main/java/online/monkegame/monkebot/CommandHandler.java",
        "https://raw.githubusercontent.com/monkegame/monkebotJ/main/src/main/java/online/monkegame/monkebot/VariableStorage.java",
        "code/meme.java",
    ];
    let source;
    let index = 0;
    let lastKey;
    function onKey(event) {
        if (lastKey !== event.key) {
            lastKey = event.key;
            type(Game.data.developerSkillLevel + 1);
        }
    }
    CodeArea.onKey = onKey;
    function type(speed) {
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
            View.update();
        }
        Elements.code.innerHTML += newCode;
        index += speed;
        // Scroll the code area down to latest code.
        Elements.codeArea.scrollTop = Elements.codeArea.scrollHeight;
    }
    CodeArea.type = type;
    function reset() {
        index = 0;
        Elements.code.innerHTML = "";
    }
    CodeArea.reset = reset;
    function fetchSource() {
        fetch(randomFromArray(sourceLinks))
            .then((newSource) => newSource.text())
            .then((newSource) => {
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
    CodeArea.fetchSource = fetchSource;
    function toggleCursor() {
        Elements.cursor.style.color =
            "transparent" === Elements.cursor.style.color
                ? "inherit"
                : "transparent";
    }
    CodeArea.toggleCursor = toggleCursor;
})(CodeArea || (CodeArea = {}));
function onLoad() {
    Game.loadOrReset();
    window.setInterval(GameLoop.run, 1000);
    CodeArea.fetchSource();
    window.setInterval(CodeArea.toggleCursor, 750);
    Elements.codeArea.addEventListener("keydown", CodeArea.onKey);
    Elements.forkPaper.addEventListener("click", Button.forkPaper);
    Elements.upgradeDeveloperSkillLevel.addEventListener("click", Button.upgradeDeveloperSkillLevel);
    Elements.getDeveloperFriend.addEventListener("click", Button.getDeveloperFriend);
    Elements.upgradeFriends.addEventListener("click", Button.upgradeFriends);
    if (Game.data.forks >= 1) {
        View.showMain();
    }
    else {
        View.hideMain();
    }
    View.update();
    View.hideLoadingScreen();
}
onLoad();
//# sourceMappingURL=index.js.map