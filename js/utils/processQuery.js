import queryData from "../helper/query.js"
import { getTimeNow } from "./utils.js";

function updateStat2(playerId, statField, statValue) {
    queryData(`INSERT stat2 SET player_id=${playerId}, ${statField}=${statValue} ON DUPLICATE KEY UPDATE ${statField}=${statField} + ${statValue}`);
}

function equipProcedure(slotField, playerId, equipId, armoryId, armoryItemId, equipmentItemId, armoryModifierId, equipmentModifierId) {
    queryData(`CALL equip_procedure(${playerId}, ${equipId}, ${armoryId}, ${armoryItemId}, ${equipmentItemId}, ${armoryModifierId}, ${equipmentModifierId}, "${slotField}")`);
}

function unequipProcedure(playerId, itemID, modifierID, equipTypeName) {
    queryData(`CALL unequip_procedure(${playerId}, ${itemID}, ${modifierID}, "${equipTypeName}")`)
}

async function insertLogs(playerId) {
    let date = new Date();
    date = formatDate(date);
    console.log(date);
    let todayLogs = await queryData(`SELECT date WHERE date=${date} AND player_id=${playerId} LIMIT 1`);
    todayLogs = todayLogs.length > 0 ? todayLogs[0] : undefined;
    if (todayLogs) {
        queryData(`UPDATE logs SET hit=hit + 1 WHERE player_id=${playerId} AND date=${date} LIMIT 1`);
    } else {
        queryData(`INSERT INTO logs SET player_id=${playerId}, date=${date}, hit=1`);
    }
}

async function getPlayerBuffs(playerId) { 
        // GET BUFF
        let timeNow = getTimeNow();
        let activeBuff = await queryData(`SELECT SUM(cfg_buff.attack) as buff_attack, SUM(cfg_buff.def) as buff_def, SUM(cfg_buff.max_hp) as buff_max_hp
        FROM active_buff
            LEFT JOIN cfg_buff ON (active_buff.buff_id=cfg_buff.id)
            WHERE player_id=${playerId} AND expire_time > ${timeNow} LIMIT 10`);
    activeBuff = activeBuff.length > 0 ? activeBuff[0] : undefined;
    
    return activeBuff;

}

export {
    updateStat2,
    equipProcedure,
    unequipProcedure,
    getPlayerBuffs,
    insertLogs
}
