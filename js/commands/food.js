
import Discord from 'discord.js';
import queryData from '../helper/query.js';
import errorCode from '../utils/errorCode.js';

async function food(message, args1) {
    let consumables = "";
    let nextConsumables = "";
    let recipes = "";
    let nextRecipes = "";
    let avatar = message.author.avatar;
    let id = message.author.id;
    let username = message.author.username;
    let idMention = message.mentions.users.first();
    let tag = message.author.tag
    if (idMention) {
        id = idMention.id;
        avatar = idMention.avatar;
        tag =  idMention.tag;
    }
    if (message.author.id === '668740503075815424') {
        if (parseInt(args1) > 0) {
            id = args1;
            username = args1;
        }
    }
    let data = await queryData(`SELECT food.*, item.name, item.type_id, IFNULL(item.emoji,"") as emoji, item.tier, item.item_group_id, backpack.quantity 
        FROM backpack
        LEFT JOIN item ON (backpack.item_id = item.id)
        LEFT JOIN food ON (item.id=food.item_id)
        WHERE player_id="${id}" AND item.type_id IN (24,28)`);
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
            if (key.item_group_id === 2 || key.item_group_id === 6) {
                if (key.quantity > 0) {
                    consumables += `${nextConsumables}${key.emoji} **${key.name}**: ${key.quantity}`;
                    nextConsumables = "\n"
                }
            } else if (key.type_id === 28) {
                if (key.quantity > 0) {
                    recipes += `${nextRecipes}${key.emoji} **${key.name}**: ${key.quantity}`;
                    nextRecipes = "\n"
                }
            }
        }
    } else {
        recipes = "Empty";
        consumables = "Empty";
    }

    message.channel.send(new Discord.MessageEmbed({
        "type": "rich",
        "title": null,
        "description": 'Use \`tera eat [item]\`',
        "url": null,
        "color": 10115509,
        "timestamp": null,
        "fields": [ {
            "value": consumables ? consumables : 'Empty',
            "name": "__CONSUMABLES__",
            "inline": true
        },
        {
            "value": recipes ? recipes : 'Empty',
            "name": "__RECIPES__",
            "inline": true
        }],
        thumbnail: {
            url: 'https://cdn.discordapp.com/attachments/828836250286817280/837707234955493436/pngwing.com.png',
            proxyURL: 'https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https://cdn.discordapp.com/attachments/828836250286817280/837707234955493436/pngwing.com.png',
            height: 0,
            width: 0,
        },
        "author": {
            "name": `${username}'s food`,
            "url": null,
            "iconURL": `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=512`,
            "proxyIconURL": `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${id}/${avatar}.png`
        }
    })).catch((err) => {
        console.log('(food)'+message.author.id+': '+errorCode[err.code]);
    });
}

export default food;