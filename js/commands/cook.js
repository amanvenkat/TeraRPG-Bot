import queryData from "../helper/query.js";
import { materialList, variable } from "../helper/variable.js";
import emojiCharacter from "../utils/emojiCharacter.js";
import parseItemName from "../utils/parseItemName.js";
import { getCookingSkillMaxExperience } from "../utils/utils.js";

export default async function cook(message, commandBody, stat) {
    try {
        // CEK player max area unlocked
        if (stat.max_zone[0] < 3) {
            return message.channel.send(`${emojiCharacter.noEntry} | <@${message.author.id}>, \`\`cook\`\` command can only be accessed if you have reached 3rd zone`);
        }

        let { itemName, itemQuantity } = parseItemName(commandBody);

        let materialReq = [];
        let cookedId = 0;
        let expGot = 0;
        let minSkillLevel = 0;
        if(itemName === '' ) {return message.channel.send(`${emojiCharacter.noEntry} | <@${message.author.id}>, Please specify item name you want to cook!`);}
        if (itemName === 'cooked fish') {
            minSkillLevel = 0;
            expGot = 1;
            cookedId = variable.cookedFish
            materialReq = materialList.cookedFish
        } else if (itemName === 'cooked shrimp') {
            minSkillLevel = 3;
            expGot = 1;
            cookedId = variable.cookedShrimp;
            materialReq = materialList.cookedShrimp
        } else if (itemName === 'sashimi') {
            minSkillLevel = 3;
            expGot = 2;
            cookedId = variable.sashimi;
            materialReq = materialList.sashimi
        } else if (itemName === 'seafood dinner') {
            minSkillLevel = 5;
            expGot = 4;
            cookedId = variable.seafoodDinner
            materialReq = materialList.seafoodDinner
        } else if (itemName === 'lobster tail') {
            minSkillLevel = 3;
            expGot = 3;
            cookedId = variable.lobsterTail
            materialReq = materialList.lobsterTail
        } else {
            return message.channel.send(`${emojiCharacter.noEntry} | ${message.author.username}, Cannot recognize the item.`);
        }

        if (itemName === 'sashimi') {
            let craftingStations = await queryData(`SELECT item_id_work_bench FROM tools WHERE player_id=${message.author.id} AND item_id_work_bench="${variable.workBenchId}" LIMIT 1`);
            if (!craftingStations.length > 0) { return message.channel.send(`${emojiCharacter.noEntry} | <@${message.author.id}>, You need <:Work_Bench:804145756918775828>\`work bench\` to cook **${itemName}**!`) }
        } else {
            let craftingStations = await queryData(`SELECT item_id_cooking_pot FROM tools WHERE player_id=${message.author.id} AND item_id_cooking_pot="${variable.cookingPotId}" LIMIT 1`);
            if (!craftingStations.length > 0) { return message.channel.send(`${emojiCharacter.noEntry} | <@${message.author.id}>, You need <:Cooking_Pot:837562146341519361>\`cooking pot\` to cook **${itemName}**!`) }
        }
    
        let skill = await queryData(`SELECT cooking_level,cooking_experience 
            FROM skill
            WHERE player_id =${message.author.id} LIMIT 1`);
        skill = skill.length > 0 ? skill[0] : undefined;
        // console.log(skill)
        if(skill){
            if(skill.cooking_level < minSkillLevel) { return message.channel.send(`${emojiCharacter.noEntry} | <@${message.author.id}>, Your cooking level is too low to be able to cook this item!\nLevel required: **${minSkillLevel}**`); }
        } else {
            if(minSkillLevel > 0) { return message.channel.send(`${emojiCharacter.noEntry} | <@${message.author.id}>, Your cooking level is too low to be able to cook this item!\nLevel required: **${minSkillLevel}**`); }
        }
        // if((!skill && minSkillLevel > 0) || (skill.cooking_level < minSkillLevel)) { return message.channel.send(`${emojiCharacter.noEntry} | <@${message.author.id}>, Your cooking level is too low to be able to cook this item!\nLevel required: **${minSkillLevel}**`); }
        
        let recipesExist = await queryData(`SELECT quantity FROM backpack WHERE item_id=${materialReq[0]['id']} AND player_id=${message.author.id} LIMIT 1`);
        recipesExist = recipesExist.length > 0 ? recipesExist[0].quantity : undefined;
        if(!recipesExist > 0) { return message.channel.send(`${emojiCharacter.noEntry} | <@${message.author.id}>, You cannot cook without recipes.`); }
        let isMaterialExists = await isMaterialExist(message.author.id, materialReq, itemQuantity);
        if (!isMaterialExists) {
            return message.channel.send(`${emojiCharacter.noEntry} | <@${message.author.id}>, Insufficient material/s required to cook this item.`);
        }

        // process cook
        queryData(`UPDATE backpack SET quantity=quantity-${isMaterialExists.req_quantity} WHERE item_id=${isMaterialExists.item_id} AND player_id=${message.author.id} LIMIT 1`);
        queryData(`UPDATE backpack SET quantity=quantity-${materialReq[0].quantity * itemQuantity} WHERE item_id=${materialReq[0].id} AND player_id=${message.author.id} LIMIT 1`);
        queryData(`CALL insert_item_backpack_procedure(${message.author.id}, ${cookedId}, ${itemQuantity})`);
        
        // prosss exp and level;
        let currentExperience = 0;
        let currentLevel = 1;
        if (skill) {
            currentExperience = skill.cooking_experience;
            currentLevel = skill.cooking_level;
        }

        expGot = parseInt(expGot) * itemQuantity;
        let expNextLevel = getCookingSkillMaxExperience(currentLevel);
        let totalExp = Math.round(parseInt(expGot) + parseInt(currentExperience));
        let nextLevel = currentLevel;
        // LEVEL UP
        if (totalExp > expNextLevel) {
            totalExp = Math.round(totalExp - expNextLevel);
            nextLevel = parseInt(currentLevel) + 1;
        }
        
        // console.log(totalExp)
        queryData(`UPDATE tools SET pickaxe_exp=${totalExp}, pickaxe_level=${nextLevel} WHERE player_id="${message.author.id}" LIMIT 1`);
        queryData(`INSERT skill SET player_id=${message.author.id}, cooking_experience=${totalExp}, cooking_level=${nextLevel} ON DUPLICATE KEY UPDATE cooking_experience=${totalExp}, cooking_level=${nextLevel}`);
        
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
        let reqQty = itemReq[i].quantity * qty;
        if (!itemReq[i].required) {
            existItem = await queryData(`SELECT backpack.*, item.name, item.emoji
            FROM item
                LEFT JOIN backpack ON (item.id = backpack.item_id)
                WHERE backpack.player_id=${playerId} AND backpack.item_id = ${itemReq[i].id}
                AND backpack.quantity >= ${reqQty}
                LIMIT 1`);
            existItem = existItem.length > 0 ? existItem[0] : undefined;
            if (existItem) {
                existItem.req_quantity = reqQty
                break;
            }
        }
    }

    return existItem;
}