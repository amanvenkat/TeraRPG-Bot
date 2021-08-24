import queryData from "../helper/query.js";
import { materialList, variable } from "../helper/variable.js";
import emojiCharacter from "../utils/emojiCharacter.js";
import parseItemName from "../utils/parseItemName.js";

export default async function cook(message, commandBody) {
    try {
        let { itemName, itemQuantity } = parseItemName(commandBody);
        let materialReq = [];
        let cookedId = 0;
        if(itemName === '' ) {return message.channel.send(`${emojiCharacter.noEntry} | <@${message.author.id}>, Please specify item name you want to cook!`);}
        if (itemName === 'cooked fish') {
            cookedId = variable.cookedFish
            materialReq = materialList.cookedFish
        } else if (itemName === 'cooked shrimp') {
            cookedId = variable.cookedShrimp;
            materialReq = materialList.cookedShrimp
        } else if (itemName === 'sashimi') {
            cookedId = variable.sashimi;
            materialReq = materialList.sashimi
        } else if (itemName === 'seafood dinner') {
            cookedId = variable.seafoodDinner
            materialReq = materialList.seafoodDinner
        } else if (itemName === 'lobster tail') {
            cookedId = variable.lobsterTail
            materialReq = materialList.lobsterTail
        } else {
            return message.channel.send(`${emojiCharacter.noEntry} | ${message.author.username}, Cannot recognize the item.`);
        }

        let isMaterialExists = await isMaterialExist(message.author.id, materialReq, itemQuantity);
        if (!isMaterialExists) {
            return message.channel.send(`${emojiCharacter.noEntry} | <@${message.author.id}>, Insufficient material/s required to cook this item..`);
        }

        // process cook
        let receiptQuantity = isMaterialExists.req_quantity;
        queryData(`UPDATE backpack SET quantity=quantity-${receiptQuantity} WHERE item_id=${isMaterialExists.item_id} AND player_id=${message.author.id} LIMIT 1`);
        queryData(`CALL insert_item_backpack_procedure(${message.author.id}, ${cookedId}, ${itemQuantity})`);
        let itemCooked = await queryData(`SELECT item.name, item.emoji FROM item WHERE id=${cookedId} Limit 1`);
        itemCooked = itemCooked ? itemCooked[0] : undefined;

        return message.channel.send(`**${message.author.username}** has cooked x${itemQuantity} ${itemCooked.emoji} **${itemCooked.name}**!`);
    } catch (err) {
        // client.users.cache.get(ownerId).send('Error: ' + err);
        console.log(err)
    }
}

async function isMaterialExist(playerId, itemReq, qty) {
    let existItem = undefined;
    for (let i = 0; i < itemReq.length; i++) {
        qty = itemReq[i].quantity * qty;
        existItem = await queryData(`SELECT backpack.*, item.name, item.emoji
         FROM item
            LEFT JOIN backpack ON (item.id = backpack.item_id)
            WHERE backpack.player_id=${playerId} AND item.id = ${itemReq[i].id}
            AND quantity >= ${qty}
            LIMIT 1`);
        existItem = existItem.length > 0 ? existItem[0] : undefined;
        if (existItem) {
            existItem.req_quantity = qty
            break;
        }
    }

    return existItem;
}