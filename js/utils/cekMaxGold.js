import queryData from "../helper/query.js";

export default
async function cekMaxGold(message, playerId, goldAdd) {
    // CEK MAXIMUM GOLD REACHABLE
    let playerInfo = await queryData(`SELECT player.subscribe_level, stat.gold, stat.bank FROM stat LEFT JOIN player ON stat.player_id=player.id WHERE player_id=${playerId} LIMIT 1`);
    playerInfo = playerInfo.length > 0 ? playerInfo[0] : 0;
    let totalGold = playerInfo.gold + playerInfo.bank;
    let maxGold = 0;
    if (playerInfo.subscribe_level == 0) {
        maxGold = 1000000000;
    } else if (playerInfo.subscribe_level == 1) {
        maxGold = 5000000000;
    } else if (playerInfo.subscribe_level == 2) {
        maxGold = 10000000000;
    } else if (playerInfo.subscribe_level == 3) {
        maxGold = 15000000000;
    } else if (playerInfo.subscribe_level == 4) {
        maxGold = 20000000000;
    } else if (playerInfo.subscribe_level == 5) {
        maxGold = 25000000000;
    }

    if (totalGold >= maxGold) {
        goldAdd = maxGold - totalGold;
        message.reply('You have reached the maximum gold you can hold on your account.\n Please upgrade your account to unlock your maximum gold');
    } else if (totalGold + goldAdd >= maxGold) {
        goldAdd = (totalGold + goldAdd) - maxGold;
        // goldAdd = goldAdd < 0 ? 0 : goldAdd;
    }
    return goldAdd;
}

