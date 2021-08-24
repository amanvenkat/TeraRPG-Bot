import queryData from "./query.js";
import { cooldown } from "./variable.js";

async function isCommandsReady(playerId, commands, zone) {
    let field = '';
    let timeLimit = '';
    let timeCooldowns = 0;
    let currentTime = new Date().getTime() / 1000;
    if (commands === 'explore') {
        field = 'explore'
        timeLimit = cooldown.explore
    } else if (commands === 'work') {
        field = 'work'
        timeLimit = cooldown.work
    } else if (commands === 'vote') {
        field = 'vote'
        timeLimit = cooldown.vote
    } else if (commands === 'hourly') {
        field = 'hourly'
        timeLimit = cooldown.hourly
    } else if (commands === 'daily') {
        field = 'daily'
        timeLimit = cooldown.daily
    } else if (commands === 'weekly') {
        field = 'weekly'
        timeLimit = cooldown.weekly
    } else if (commands === 'fish') {
        field = 'fish'
        timeLimit = cooldown.fish
    } else if (commands === 'junken') {
        field = 'junken'
        timeLimit = cooldown.junken
    } else if (commands === 'dungeon') {
        field = 'dungeon'
        timeLimit = cooldown.dungeon
    } else if (commands === 'expedition') {
        field = 'expedition'
        timeLimit = cooldown.expedition
    } else if (commands === 'quest') {
        field = 'quest'
        timeLimit = cooldown.quest
    }
    
    let playerInfo = await queryData(`SELECT cooldowns.${field}, player.subscribe_level FROM cooldowns 
        LEFT JOIN player ON cooldowns.player_id=player.id
        WHERE player_id="${playerId}" LIMIT 1`);
    playerInfo = playerInfo.length > 0 ? playerInfo[0] : undefined;
    let lastTime = 0;

    if (playerInfo) {
        lastTime = playerInfo[field];
        // REDUCE COOLDOWN BASED SUBSCRIPTION LEVEL
        if (playerInfo.subscribe_level == 1 || playerInfo.subscribe_level == 2) {
            timeLimit = timeLimit - timeLimit * 10 / 100;
        } else if (playerInfo.subscribe_level == 3) {
            timeLimit = timeLimit - timeLimit * 15 / 100;
        }
    }

    timeCooldowns = Math.round(currentTime - lastTime);
    let waitingTime = secondsToDHms(timeLimit - timeCooldowns);
    return {
        isReady: timeCooldowns > timeLimit,
        currentTime,
        lastTime,
        timeCooldowns,
        waitingTime
    }
}

function secondsToDHms(second) {
    second = Number(second);
    let d = Math.floor(second / 86400);
    let h = Math.floor(second % 86400 / 3600);
    let m = Math.floor(second % 3600 / 60);
    let s = Math.floor(second % 3600 % 60);

    let dDisplay = d > 0 ? d + (d == 1 ? " day" : " days") + (h > 0  || m > 0 || s > 0 ? ", " : "") : "";
    let hDisplay = h > 0 ? h + (h == 1 ? " hr" : " hrs") + (m > 0 || s > 0 ? ", " : "") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") + (s > 0 ? ", " : "") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
    return dDisplay +  hDisplay + mDisplay + sDisplay; 
}
function secondsToHms(d) {
    d = Number(d); var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    var hDisplay = h > 0 ? h + (h == 1 ? " hr" : " hrs") + (m > 0 || s > 0 ? ", " : "") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") + (s > 0 ? ", " : "") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
    return hDisplay + mDisplay + sDisplay;
}

export default isCommandsReady;