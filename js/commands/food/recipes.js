import Discord from 'discord.js';
import queryData from '../../helper/query.js';
import { materialList } from '../../helper/variable.js';
import emojiCharacter from '../../utils/emojiCharacter.js';
import errorCode from '../../utils/errorCode.js';
import parseItemName from '../../utils/parseItemName.js';

export default async function recipes(message, commandBody) {

    let { itemName } = parseItemName(commandBody);
    let ingredents = '';
    let materialsReq = '';

    // RECIPES LIST
    let recipesList = '';
    let nextRecipesList = '';
    if (!itemName) {
        let data = await queryData(`SELECT item.name, item.type_id, IFNULL(item.emoji,"") as emoji, item.tier, item.item_group_id, backpack.quantity 
        FROM backpack
        LEFT JOIN item ON (backpack.item_id = item.id)
        WHERE player_id="${message.author.id}" AND item.type_id=28`);
        // Sort item by TIER
        data.sort((a, b) => {

            if (a.type_id < b.type_id) {
                return -1;
            } else if (a.type_id > b.type_id) {
                return 1;
            }
        
            if (a.tier < b.tier) {
                return -1;
            } else if (a.tier > b.tier) {
                return 1;
            }

            return 0;
        });
        if (data.length > 0) {
            for (const key of data) {
                if (key.quantity > 0) {
                    recipesList += `${nextRecipesList}${key.emoji} **${key.name}**: ${key.quantity}`;
                    nextRecipesList = "\n"
                
                }
            }
        } else {
            recipesList = "Empty";
        }

        message.channel.send(new Discord.MessageEmbed({
            "type": "rich",
            "title": null,
            "description": 'Use \`tera recipes [recipes name]\` \nto find out the ingredents',
            "url": null,
            "color": 10115509,
            "timestamp": null,
            "fields": [{
                "value": recipesList ? recipesList : 'Empty',
                "name": "__RECIPES__",
                "inline": true
            }],
            thumbnail: {
                url: 'https://cdn.discordapp.com/attachments/845278131551469608/880720068554661908/1021460.png',
                proxyURL: 'https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https://cdn.discordapp.com/attachments/845278131551469608/880720068554661908/1021460.png',
                height: 0,
                width: 0,
            },
            "author": {
                "name": `${message.author.username}'s recipes`,
                "url": null,
                "iconURL": `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                "proxyIconURL": `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
            }
        })).catch((err) => {
            console.log('(recipes)' + message.author.id + ': ' + errorCode[err.code]);
        });
        return;
    }

    
// SPEC RECIPES LIST
    let tools = '<:Cooking_Pot:837562146341519361> Cooking pot';
    if (itemName === 'cooked fish' || itemName === 'cooked fish recipes') {
        materialsReq = materialList.cookedFish;
    } else if (itemName === 'cooked shrimp' || itemName === 'cooked shrimp recipes') {
        materialsReq = materialList.cookedShrimp;
    } else if (itemName === 'seafood dinner' || itemName === 'seafood dinner recipes') {
        materialsReq = materialList.seafoodDinner;
    } else if (itemName === 'lobster tail' || itemName === 'lobster tail recipes') {
        materialsReq = materialList.lobsterTail;
    } else if (itemName === 'sashimi' || itemName === 'sashimi recipes') {
        materialsReq = materialList.sashimi;
        tools = '<:Work_Bench:804145756918775828> Work bench';
    } else {
        return message.channel.send(`${emojiCharacter.noEntry} | Invalid recipes name!`);
    }

    for (const element of materialsReq) {
        if (!element.required) {
            ingredents += `x${element.quantity} *${element.emoji} ${element.name}\n`
        }
        
    }

    message.channel.send(new Discord.MessageEmbed({
        type: "rich",
        // title: 'null',
        description: `**__${materialsReq[0].emoji} ${materialsReq[0].name}__**`,
        url: null,
        color: 10115509,
        fields: [
            {
                value: tools,
                name: "Tools",
                inline: false
            },
            {
                value: ingredents ? ingredents : 'Empty',
                name: "Ingredents",
                inline: false
            }],
        provider: null,
        footer: {
            text: `* required atleast 1 type`,
            iconURL: null,
            proxyIconURL: null
        },
        // timestamp: new Date(),
    })).catch((err) => {
        console.log('(recipes)'+message.author.id+': '+errorCode[err.code]);
    });
}