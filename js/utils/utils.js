function getTimeNow() {
    let time = new Date();
    let inTime = Math.floor(time.getTime() / 1000);
    return inTime;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}



function secondsToDHms(second) {
    second = Number(second);
    let d = Math.floor(second / 86400);
    let h = Math.floor(second % 86400 / 3600);
    let m = Math.floor(second % 3600 / 60);
    let s = Math.floor(second % 3600 % 60);

    let dDisplay = d > 0 ? d + (d == 1 ? "d" : "d") + (h > 0  || m > 0 || s > 0 ? " " : "") : "";
    let hDisplay = h > 0 ? h + (h == 1 ? "h" : "h") + (m > 0 || s > 0 ? " " : "") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? "m" : "m") + (s > 0 ? " " : "") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
    return dDisplay +  hDisplay + mDisplay + sDisplay; 
}

function getCookingSkillMaxExperience(level) {
    level = level ? level : 1;
    let expNextLevel = (level * 200) - 100;

    return expNextLevel;
}

function getMiningSkillMaxExperience(level) {
    level = level ? level : 1;
    let expNextLevel = (level * 300) - 100;

    return expNextLevel;
}

function getWoodCuttingSkillMaxExperience(level) {
    level = level ? level : 1;
    let expNextLevel = (level * 250) - 100;

    return expNextLevel;
}

function getFishingSkillMaxExperience(level) {
    level = level ? level : 1;
    let expNextLevel = (level * 450) - 100;

    return expNextLevel;
}

export {
    getTimeNow,
    secondsToDHms,
    formatDate,
    getCookingSkillMaxExperience,
    getMiningSkillMaxExperience,
    getWoodCuttingSkillMaxExperience,
    getFishingSkillMaxExperience
}