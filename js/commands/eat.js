import currencyFormat from "../helper/currency.js";
import { getMaxHP } from "../helper/getBattleStat.js";
import queryData from "../helper/query.js";
import secondsToDHms from "../helper/secondsToDHms.js";
import emojiCharacter from "../utils/emojiCharacter.js";

async function eatFood(message, stat, commandsBody) {
    let argument = commandsBody
    let qty = argument.match(/\d+/g);
    qty = qty ? qty[0] : 1;
    let arrayName = argument.match(/[a-zA-Z]+/g);
    let itemName = '';
    arrayName = arrayName.splice(1);
    arrayName.forEach(element => {
        if (itemName) {
            itemName += ' ';
        }
        if (element != 'all') {
            itemName += element;
        }
    });
    if (!itemName) { return  message.channel.send(`${emojiCharacter.noEntry} | please provide the item you want to eat!`) }
    let isItemExist = await queryData(`SELECT name FROM item WHERE name="${itemName}" LIMIT 1`);
    if (!isItemExist.length > 0) { return message.channel.send(`${emojiCharacter.noEntry} | Invalid item name!`) };

    let item = await queryData(`SELECT IFNULL(quantity,0) as quantity, item.emoji, item.name,item.id, IFNULL(food.hp,0) as hp, food.duration,
     cfg_buff.name as buff_name, cfg_buff.emoji as buff_emoji, cfg_buff.def, cfg_buff.attack, cfg_buff.max_hp, food.buff_id
    FROM item
    LEFT JOIN food ON (item.id=food.item_id)
    LEFT JOIN cfg_buff ON (food.buff_id=cfg_buff.id)
    LEFT JOIN backpack ON (item.id=backpack.item_id)
    WHERE player_id=${message.author.id} AND item.name="${itemName}" LIMIT 1`);
    item = item.length > 0 ? item[0] : undefined;
    let qtyUsed = qty;
    if (!item || item.quantity < qty) {
        return message.channel.send(`${emojiCharacter.noEntry} | you don't have that much items on your backpack!`);
    }
    if (item.buff_name) {
        applyBuff(message.author.id, item.buff_id, item.duration, qty);
        message.channel.send(`**${message.author.username}**, has eaten x${qtyUsed} ${item.emoji}**${item.name}** and applied ${item.buff_emoji}__${item.buff_name}__ buff!`);
    } else {
        let itemHP = item.hp * qty;
        let maxHP = getMaxHP(stat.basic_hp, stat.level);
        let restoredHP = parseInt(itemHP);
        restoredHP = parseInt(stat.hp) + parseInt(restoredHP) > maxHP ? maxHP - stat.hp : restoredHP;
        if (restoredHP <= 0) { return message.channel.send(`**${message.author.username}** current HP is maxed out.`) };
        qtyUsed = Math.ceil(restoredHP / item.hp);
        
        queryData(`UPDATE stat SET hp=hp+${restoredHP} WHERE player_id=${message.author.id} LIMIT 1`);
        message.channel.send(`**${message.author.username}**, has eaten x${qtyUsed} ${item.emoji}**${item.name}** and restored __${currencyFormat(restoredHP)}__ HP\n current HP __${parseInt(stat.hp) + parseInt(restoredHP)}/${maxHP}__!`);
    }
    
    queryData(`UPDATE backpack SET quantity=quantity-${qtyUsed} WHERE player_id=${message.author.id} AND item_id=${item.id} LIMIT 1`)
    
}

async function applyBuff(playerId, buffId, duration, qty) {
    let time = new Date();
    time = time.getTime() / 1000;
    let expireTime = time + (duration * qty)
    let existBuff = await queryData(`SELECT expire_time, type_id
    FROM active_buff
        LEFT JOIN cfg_buff ON (active_buff.buff_id = cfg_buff.id)
        WHERE buff_id=${buffId} AND player_id=${playerId} LIMIT 1`);
    existBuff = existBuff.length > 0 ? existBuff[0] : undefined;
    if (existBuff) {
        let timeBuffLeft = existBuff.expire_time - time;
        timeBuffLeft = timeBuffLeft > 0 ? timeBuffLeft : 0;
        expireTime = expireTime + timeBuffLeft
    }

    let buffTypeId = await queryData(`SELECT type_id FROM cfg_buff WHERE id=${buffId} LIMIT 1`);
    buffTypeId = buffTypeId.length > 0 ? buffTypeId[0]['type_id'] : 0;

    let duplicateBuff = await queryData(`SELECT expire_time, cfg_buff.type_id, buff_id
        FROM active_buff
            LEFT JOIN cfg_buff ON (active_buff.buff_id = cfg_buff.id)
            WHERE buff_id<>${buffId} AND cfg_buff.type_id=${buffTypeId} AND player_id=${playerId} LIMIT 10`);
    duplicateBuff = duplicateBuff.length > 0 ? duplicateBuff : undefined; 
    // REMOVE DUPLICATE TYPE BUFF
    if (duplicateBuff) {
        duplicateBuff.forEach(element => {
            queryData(`DELETE FROM active_buff WHERE buff_id=${element.buff_id} AND player_id=${playerId}`);
        });
    }

    queryData(`CALL insert_active_buff_procedure(${playerId}, ${buffId}, ${expireTime}) `);
}

export default eatFood;