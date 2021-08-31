import Discord from 'discord.js';
import myCache from './cache/leaderboardChace.js';
import currencyFormat from './helper/currency.js';
import queryData from './helper/query.js';
import randomizeModifier from './helper/randomizeModifier.js';
import { priceList } from './helper/variable.js';
import emojiCharacter from './utils/emojiCharacter.js';
import errorCode from './utils/errorCode.js';
import parseItemName from './utils/parseItemName.js';
async function reforge(message, command, commandBody, args1, args2, stat) {
    let reforgeName = '';
    let modifierMode = 1;
    let maxZone = stat.max_zone.split('|');
    maxZone = maxZone[0]; 
    let { itemName } = parseItemName(commandBody);
    let isUseBB = itemName.includes('bb'); 
    if (command == 'reforge') {
        // undefined;
        modifierMode = 1;
        reforgeName = 'reforge';
    } else if (command == 'sreforge') {
        if (maxZone < 4) { return message.channel.send(`${emojiCharacter.noEntry} | \`sreforge\` command is unlocked in 4th zone (jungle)`) } 
        modifierMode = 2;
        reforgeName = 'sreforge';
    } else if (command == 'ureforge') {
        if (maxZone < 7) { return message.channel.send(`${emojiCharacter.noEntry} | \`ureforge\` command is unlocked in 7th zone (dungeon)`) } 
        modifierMode = 3;
        reforgeName = 'ureforge';
    }
    
    if (args1 === 'weapon') {
        processReforge(message, 1, modifierMode,reforgeName, isUseBB);
    } else if (args1 === 'helmet') {
        processReforge(message, 2, modifierMode, reforgeName, isUseBB);
    } else if (args1 === 'shirt') {
        processReforge(message, 3, modifierMode, reforgeName, isUseBB);
    } else if (args1 === 'pants') {
        processReforge(message, 4, modifierMode, reforgeName, isUseBB);
    } else if (itemName.includes('info') && args2 === '2') {
        message.channel.send(listEmbedArmor());
    } else if (itemName.includes('info')) {
        message.channel.send(listEmbedWeapon());
    } else {
        message.channel.send(`I don't get it, make sure you type the correct equipment to ${reforgeName}\ne.g. \`tera ${reforgeName} weapon/helmet\``)
    }
}

async function processReforge(message, equipmentSlot,  modifierMode, reforgeName, isUseBB) {
    let queryCondition = '';
    let eqMsg = '';
    let field = '';
    let costsMultiplier = 1;
    // cek blacksmithBlessing
    
    if (isUseBB) {
        if (modifierMode == 1) { return message.channel.send(`\\⛔ | **${message.author.username}**, <:crystal_shard:882124050791559200>**blacksmith blessing** only useable on \`sreforge\` or \`ureforge\`!`) }

        let cekBB = await queryData(`SELECT * FROM backpack WHERE player_id=${message.author.id} AND item_id=${priceList.blacksmithBlessing.id} AND quantity>0 LIMIT 1`);
        cekBB = cekBB.length > 0 ? cekBB[0] : undefined;
        if(!cekBB) { return message.channel.send(`\\⛔ | **${message.author.username}**, you don't have any <:crystal_shard:882124050791559200>**blacksmith blessing** to use!`)}
    }
    if (modifierMode == 1) {
        costsMultiplier = 1;
    } else if (modifierMode == 2) {
        costsMultiplier = 25;
    } else if (modifierMode == 3) {
        costsMultiplier = 250;
    } 
    if (equipmentSlot == 1) {
        queryCondition = 'LEFT JOIN weapon ON (equipment.weapon_id=weapon.id) LEFT JOIN item ON (weapon.item_id=item.id)';
        eqMsg = 'weapon';
        field = 'weapon_modifier_id';
    } else if (equipmentSlot == 2) {
        queryCondition = 'LEFT JOIN armor ON (equipment.helmet_id=armor.id) LEFT JOIN item ON (armor.item_id=item.id)';
        eqMsg = 'helmet armor';
        field = 'helmet_modifier_id';
    } else if (equipmentSlot == 3) {
        queryCondition = 'LEFT JOIN armor ON (equipment.shirt_id=armor.id) LEFT JOIN item ON (armor.item_id=item.id)';
        eqMsg = 'shirt armor';
        field = 'shirt_modifier_id';
    } else if (equipmentSlot == 4) {
        queryCondition = 'LEFT JOIN armor ON (equipment.pants_id=armor.id) LEFT JOIN item ON (armor.item_id=item.id)';
        eqMsg = 'pants armor';
        field = 'pants_modifier_id';
    }

    if (equipmentSlot > 0) {
        let item = await queryData(`SELECT stat.level, item.id, item.emoji, item.name, gold, IFNULL(cost,500) as cost, modifier.id as modifierId,modifier.name as modifierName FROM stat
                                LEFT JOIN equipment ON (stat.player_id=equipment.player_id)
                                ${queryCondition}
                                LEFT JOIN modifier ON (equipment.${field}=modifier.id)
                                WHERE stat.player_id=${message.author.id} LIMIT 1`);
        item = item.length > 0 ? item[0] : 0;
        if (item !== 0) {
            if (item.level >= 5) {
                if (item.name) {
                    if (item.id == '278' || item.id == '279' || item.id == '280' || item.id == '281') {
                        return message.channel.send(`\\⛔ | **${message.author.username}**, you can't ${reforgeName} **starter** equipment!`)
                    }
                    if (item.gold > (item.cost * costsMultiplier)) {
                        let forgeList = '';
                        if (equipmentSlot == 1) {
                            forgeList = myCache.get('forgeWeaponList');
                            if (forgeList == undefined) {
                                forgeList = await queryData(`SELECT id,name,chance1,chance2,chance3,cost FROM modifier WHERE modifier_type_id=1`);
                                myCache.set('forgeWeaponList', forgeList);
                                // console.log('weponUndef')
                            }
                            forgeList = myCache.get('forgeWeaponList');
                        } else {
                            forgeList = myCache.get('forgeArmorList');
                            if (forgeList == undefined) {
                                forgeList = await queryData(`SELECT id,name,chance1,chance2,chance3,cost FROM modifier WHERE modifier_type_id=2`);
                                myCache.set('forgeArmorList', forgeList);
                                forgeList = myCache.get('forgeArmorList');
                            }
                        }

                        let modifier = await randomizeModifier(forgeList, modifierMode); 
                        if (isUseBB) {
                            if (modifier.id < item.modifierId) {
                                modifier.id = item.modifierId;
                                modifier.name = item.modifierName;
                                modifier.cost = item.cost;
                                // reduce bb from backpack
                                queryData(`UPDATE backpack SET quantity = quantity - 1 WHERE player_id=${message.author.id} AND item_id = ${priceList.blacksmithBlessing.id} LIMIT 1`);
                            }
                        }

                        let nextCost = currencyFormat(costsMultiplier * modifier.cost);

                        // Update Enchant
                        queryData(`UPDATE stat SET gold=gold-${item.cost * costsMultiplier} WHERE player_id=${message.author.id} LIMIT 1`);
                        queryData(`UPDATE equipment SET ${field}="${modifier.id}" WHERE player_id="${message.author.id}" LIMIT 1`);
            
                        message.channel.send(new Discord.MessageEmbed({
                            type: "rich",
                            description: null,
                            url: null,
                            color: 10115509,
                            fields: [{
                                name: `Result`,
                                value: `${item.emoji} | ${modifier.name} ${item.name} \n========================\nnext ${reforgeName} cost: <:gold_coin:801440909006209025> ${nextCost}`,
                                inline: false,
                            }],
                            thumbnail: {
                                url: `https://static.wikia.nocookie.net/terraria_gamepedia/images/1/12/Reforge.png/revision/latest?cb=20161017115112`,
                                proxyURL: `https://cdn.discordapp.com/attachments/811586577612275732/824990018292547644/Reforge.png`,
                                height: 0,
                                width: 0
                            },
                            author: {
                                "name": `${message.author.username}'s ${reforgeName}`,
                                "url": null,
                                "iconURL": `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                                "proxyIconURL": `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                            }
                        })).catch((err) => {
                            console.log('(reforge)' + message.author.id + ': ' + errorCode[err.code]);
                        });
                    } else {
                        message.reply(`Check your wallet, your gold may run out elsewhere`)
                    }
                } else {
                    message.reply(`you don't have a ${eqMsg} to ${reforgeName}!`);
                }
                
            } else {
                message.reply(`your hand is not strong enough,\n you must be level 5 and above to ${reforgeName} equipment!`)
            }
        }
    }
}

function listEmbedWeapon() {
    return new Discord.MessageEmbed({
        type: "rich",
        title: 'Reforge Weapon',
        description: null,
        url: null,
        color: 10115509,
        fields: [
            {
                name:`__\`Modifier            Stat                Cost\`__`,
                value: `\`Broken------------[ -25% ]-----------[    100 ]\`
                        \`Shoddy------------[ -10% ]-----------[    300 ]\`
                        \`Weak--------------[  -5% ]-----------[    350 ]\`
                        \`Damaged-----------[   1% ]-----------[    400 ]\`
                        \`Keen--------------[   5% ]-----------[    500 ]\`
                        \`Ruthless----------[  10% ]-----------[    700 ]\`
                        \`Zealous-----------[  25% ]-----------[  1.000 ]\`
                        \`Hurtful-----------[  45% ]-----------[  1.500 ]\`
                        \`Strong------------[  70% ]-----------[  3.000 ]\`
                        \`Forceful----------[ 100% ]-----------[  7.000 ]\`
                        \`Unpleasant--------[ 135% ]-----------[ 15.000 ]\`
                        \`Demonic-----------[ 175% ]-----------[ 35.000 ]\`
                        \`Superior----------[ 220% ]-----------[ 50.000 ]\`
                        \`Godly-------------[ 250% ]-----------[ 75.000 ]\``,
                inline: true
            },
            {
                name: 'Higher Tiers',
                value: `
sreforge: unlocked in 4th zone (jungle), has better chances but x25 price
ureforge: unlocked in 7th zone (dungeon), has better chances but x250 price`},
            {
                value: `use \`tera reforge weapon\`\nFor armor reforge info use \`reforge info 2\`\nyou must at least level 5 to reforge an equipment`,
                name: 'Info'
            }
        ],
        provider: null,
        // timestamp: new Date(),
    })
}
function listEmbedArmor() {
    return new Discord.MessageEmbed({
        type: "rich",
        title: 'Reforge Armor',
        description: null,
        url: null,
        color: 10115509,
        fields: [ 
            {
                name:`__\`Modifier           Stat               Cost\`__`,
                value: `\`Hard--------------[ +1 ]-----------[  1.000 ]\`
                        \`Guarding----------[ +2 ]-----------[  3.000 ]\`
                        \`Armored-----------[ +4 ]-----------[ 15.000 ]\`
                        \`Warding-----------[ +8 ]-----------[ 35.000 ]\`
                        \`Defender----------[+10 ]-----------[ 70.000 ]\``,
                inline: false,
            }, 
            {
                value: `use \`tera reforge helmet/shirt/pants\`\nFor weapon reforge info use \`reforge info 1\`\nyou must at least level 5 to reforge an equipment`,
                name: 'Info'
            }
        ],
        provider: null,
        // timestamp: new Date(),
    })
}
export default reforge;