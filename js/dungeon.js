import Discord from "discord.js";
import { cooldownMessage } from "./embeddedMessage.js";
import addExpGold from "./helper/addExp.js";
import currencyFormat from "./helper/currency.js";
import damage from "./helper/damage.js";
import generateIcon from "./helper/emojiGenerate.js";
import { getAttack, getDefense, getMaxHP, getMaxMP} from "./helper/getBattleStat.js";
import isCommandsReady from "./helper/isCommandsReady.js";
import queryData from "./helper/query.js";
import randomizeChance from "./helper/randomize.js";
import randomNumber from "./helper/randomNumberWithMinMax.js";
import { activeCommand, deactiveCommand } from "./helper/setActiveCommand.js";
import setCooldowns from "./helper/setCooldowns.js";
import errorCode from "./utils/errorCode.js";
import { getPlayerBuffs, insertItemBackpackProcedure, updateStat2 } from "./utils/processQuery.js";

var greatHealUsed = 10;
var keyNeeded = 1;
async function dungeon(message, stat) {
    let player1 = message.author;
    let player2 = message.mentions.users.first();
    if (player2 && player2.id != message.author.id) {
        let cooldowns = await isCommandsReady(player1.id, 'dungeon');
        let cooldowns2 = await isCommandsReady(player2.id, 'dungeon');
        if (!cooldowns.isReady) {
            message.channel.send(cooldownMessage(player1.id, player1.username, player1.avatar, 'Dungeon', cooldowns.waitingTime));
            return;
        }
        if (!cooldowns2.isReady) {
            message.channel.send(cooldownMessage(player2.id, player2.username, player2.avatar, 'Dungeon', cooldowns2.waitingTime));
            return;
        }
        if (stat.zone_id >= 7) {
            message.channel.send('Dungeon 7 is not available right now!');
            return;
        }
        let playerList = await queryData(`SELECT player.is_active, hp, mp, current_experience, level, basic_hp, basic_mp, basic_attack, basic_def, weapon.attack, zone_id, sub_zone, max_zone,
            IF(armor1.armor_set_id=armor2.armor_set_id AND armor2.armor_set_id=armor3.armor_set_id, armor_set.bonus_set, 0) as bonus_armor_set,
            IFNULL(armor1.def,0) as helmetDef,
            IFNULL(armor2.def,0) as chestDef,
            IFNULL(armor3.def,0) as pantsDef,
            IFNULL(modifier_weapon.stat_change,0) as weapon_modifier,
            IFNULL(helmet_modifier.stat_change,0) as helmet_modifier,
            IFNULL(shirt_modifier.stat_change,0) as shirt_modifier,
            IFNULL(pants_modifier.stat_change,0) as pants_modifier
            FROM stat 
            LEFT JOIN equipment ON (stat.player_id = equipment.player_id)
            LEFT JOIN armor as armor1 ON (equipment.helmet_id = armor1.id)
            LEFT JOIN armor as armor2 ON (equipment.shirt_id = armor2.id)
            LEFT JOIN armor as armor3 ON (equipment.pants_id = armor3.id)
            LEFT JOIN weapon ON (equipment.weapon_id = weapon.id)
            LEFT JOIN item as itemArmor1 ON (armor1.item_id = itemArmor1.id)
            LEFT JOIN item as itemArmor2 ON (armor2.item_id = itemArmor2.id)
            LEFT JOIN item as itemArmor3 ON (armor3.item_id = itemArmor3.id)
            LEFT JOIN item as itemWeapon ON (weapon.item_id = itemWeapon.id)
            LEFT JOIN modifier as modifier_weapon ON (equipment.weapon_modifier_id=modifier_weapon.id)
            LEFT JOIN modifier as helmet_modifier ON (equipment.helmet_modifier_id=helmet_modifier.id)
            LEFT JOIN modifier as shirt_modifier ON (equipment.shirt_modifier_id=shirt_modifier.id)
            LEFT JOIN modifier as pants_modifier ON (equipment.pants_modifier_id=pants_modifier.id) 
            LEFT JOIN armor_set ON (armor1.armor_set_id=armor_set.id)
            LEFT JOIN utility ON (stat.player_id=utility.player_id)
            LEFT JOIN zone ON (stat.zone_id=zone.id)
            LEFT JOIN player ON (stat.player_id = player.id)
            WHERE stat.player_id IN ('${player2.id}', '${player1.id}') ORDER BY FIELD(stat.player_id,'${player1.id}', '${player2.id}') LIMIT 2`);
        greatHealUsed = playerList[0].sub_zone >= 2 ? 5 : greatHealUsed;
        if (playerList.length <= 1) {
            message.reply(`Someone in your team is not registered yet, \nTeam up with user who already registered in **teraRPG**`)
            return
        }
        if (!playerList[1].is_active) {
            message.reply(`you cannot team up with banned user`);
            return
        }

        // CEK USER JAILED
        let isJailed = await queryData(`SELECT * FROM jail WHERE player_id=${player2.id} AND released=0 LIMIT 1`);
        isJailed = isJailed.length > 0 ? isJailed[0] : false;
        if (isJailed) {
                return message.reply(`you cannot team up with jailed player`);
            }
        
        
        if (playerList[0].zone_id !== playerList[1].zone_id) {
            message.channel.send(`All team members must be in the same zone`);
            return
        }

        if (playerList[0].sub_zone !== playerList[1].sub_zone) {
            message.channel.send(`All team members must be in the same zone`);
            return
        }
        // CEK DUNGEON KEY
        let cekDungeonKey1 = await queryData(`SELECT item_id FROM backpack WHERE item_id="348" AND quantity>="${keyNeeded}" AND player_id="${player1.id}" LIMIT 1`);
        cekDungeonKey1 = cekDungeonKey1.length > 0 ? cekDungeonKey1[0] : undefined;
        if (!cekDungeonKey1) {
            message.channel.send(`x${keyNeeded} <:dungeon_key:877776627432554506>**Dungeon Key** is required to do dungeon, \nyou can acquire it through explore`);
            return;
        }
        let cekDungeonKey2 = await queryData(`SELECT item_id FROM backpack WHERE item_id="348" AND quantity>="${keyNeeded}" AND player_id="${player2.id}" LIMIT 1`);
        cekDungeonKey2 = cekDungeonKey2.length > 0 ? cekDungeonKey2[0] : undefined;
        if (!cekDungeonKey2) {
            message.channel.send(`x${keyNeeded} <:dungeon_key:877776627432554506>**Dungeon Key** is required to do dungeon. \nYou can acquire it through explore`);
            return;
        }

        let p1MaxHp = getMaxHP(playerList[0].basic_hp, playerList[0].level);
        let percentHp1 = playerList[0].hp / p1MaxHp * 100;
        let p2MaxHp = getMaxHP(playerList[1].basic_hp, playerList[1].level);
        let percentHp2 = playerList[1].hp / p2MaxHp * 100;
        if (percentHp1 <= 50 || percentHp2 <= 50){
            message.channel.send(`All team members HP must be above 50% to do a dungeon`);
            return
        }
        activeCommand([player1.id, player2.id]);
        let bossStat = await queryData(`SELECT * FROM enemy WHERE is_boss='1' AND zone_id='${playerList[0].zone_id}' LIMIT 1`);
        bossStat = bossStat.length > 0 ? bossStat[0] : [];
        bossStat.attack = playerList[0].sub_zone >= 2 ? bossStat.max_damage : bossStat.min_damage;
        bossStat.hp = bossStat.hp * playerList[0].sub_zone;
        let bossEmbed = new Discord.MessageEmbed({
            type: "rich",
            description: null,
            url: null,
            color: 10115509,
            fields: [
                {
                    name: `Confirm`,
                    value: `All player has to react ??? to accept!\n=================================`,
                    inline: false
                },
                {
                    name: `${bossStat.emoji} ${bossStat.name} ${playerList[0].sub_zone == 2 ? `[Hard]` : `[Normal]`}`,
                    value: `**HP** : ${currencyFormat(bossStat.hp)}
                            **Att**: ${currencyFormat(bossStat.attack)}
                            **Def**: ${currencyFormat(bossStat.def)}`,
                    inline: false,
                }
            ],
            image: {
                url: `${bossStat.image_url}`,
                proxyURL: `https://images-ext-2.discordapp.net/external/x-zut8t2u6esGWxWBBOyZYXq59BmTg9lEZHwM21iOfQ/%3Fv%3D26/${bossStat.image_url}`,
                height: 0,
                width: 0
            },
            // files: ['https://cdn.discordapp.com/attachments/811586577612275732/811586719198871572/King_Slime_1.png']
        })
        message.channel.send(bossEmbed)
            .then(function (message2) {
                message2.react('???').then(() => message2.react('???'));
                let userExist = [];
                const filter = (reaction, user) => {
                    if (!userExist.includes(user.id)) {
                        userExist.push(user.id); // Prevent user reaction twice
                        return ['???', '???'].includes(reaction.emoji.name) && [player1.id, player2.id].includes(user.id)
                    } else {
                        return false;
                    }
                    
                }
                message2.awaitReactions(filter, { max: 2, time: 60000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first();
                        if (collected.has('???')) {
                            message2.delete();
                            message2.channel.send('declined')
                            deactiveCommand([player1.id, player2.id])
                        } else {
                            message2.delete();
                            try {
                                setCooldowns(player1.id, 'dungeon');
                                setCooldowns(player2.id, 'dungeon');
                            } catch (err) {
                                // console.log(err)
                            }
                            battleBegun(message, playerList, bossStat, player1, player2)
                            
                        }
                    })
                    .catch(collected => {
                        message2.delete();
                        message2.channel.send('Timeout, dungeon cancelled')
                        deactiveCommand([player1.id, player2.id])
                    });
        
            }).catch((err) => {
                console.log('(dungeon)'+message.author.id+': '+errorCode[err.code]);
            });
    } else {
        message.channel.send(`You have to team up with another player to do dungeon\nex.\`tera dungeon @sim\``);
    }
}

async function battleBegun(message, playerList, bossStat, player1, player2) {
    let player1Buff = await getPlayerBuffs(player1.id);
    let player2Buff = await getPlayerBuffs(player2.id);
    let player1Stat = {
        id: player1,
        level: playerList[0].level,
        attack: getAttack(playerList[0].basic_attack, playerList[0].attack, playerList[0].level, playerList[0].weapon_enchant, player1Buff.buff_attack),
        def : getDefense(playerList[0].basic_def, playerList[0].level, playerList[0].helmetDef, playerList[0].shirtDef, playerList[0].pantsDef, playerList[0].bonus_armor_set, playerList[0].helmet_modifier, playerList[0].shirt_modifier, playerList[0].pants_modifier, player1Buff.buff_def),
        hp : playerList[0].hp,
        mp: playerList[0].mp,
        sub_zone: playerList[0].sub_zone,
        buff: 0
    }
    // console.log(playerList[0])
    // console.log(player1Stat);
    let player2Stat = {
        id: player2,
        level: playerList[1].level,
        attack: getAttack(playerList[1].basic_attack, playerList[1].attack, playerList[1].level, playerList[1].weapon_enchant, player2Buff.buff_attack),
        def : getDefense(playerList[1].basic_def, playerList[1].level, playerList[1].helmetDef, playerList[1].shirtDef, playerList[1].pantsDef, playerList[1].bonus_armor_set, playerList[1].helmet_modifier, playerList[1].shirt_modifier, playerList[1].pants_modifier, player2Buff.buff_def),
        hp : playerList[1].hp,
        mp : playerList[1].mp,
        sub_zone: playerList[1].sub_zone,
    }
    const maxPlayer1Stat = {
        hp : getMaxHP(playerList[0].basic_hp, playerList[0].level, player1Buff.buff_max_hp),
        mp : getMaxMP(playerList[0].basic_mp, playerList[0].level)
    }
    const maxPlayer2Stat = {
        hp : getMaxHP(playerList[1].basic_hp, playerList[1].level, player2Buff.buff_max_hp),
        mp : getMaxMP(playerList[1].basic_mp, playerList[1].level)
    }
    
    const maxBossStat = {
        hp: bossStat.hp,
        mp: bossStat.mp
    }
    let startMessage = `> ${bossStat.name} has appear...`;
    let embed = new Discord.MessageEmbed({
        type: "rich",
        description: null,
        url: null,
        color: 10115509,
        fields: [{
            name: `${bossStat.emoji} ${bossStat.name} ${player1Stat.sub_zone == 2 ? `[Hard]` : `[Normal]`}`,
            value: `${generateIcon(bossStat.hp, maxBossStat.hp, true)} ${bossStat.hp}/${maxBossStat.hp} ????
--------------------------------------------------------
**${player1Stat.id.username}** [lvl.${player1Stat.level}]
${generateIcon(player1Stat.hp, maxPlayer1Stat.hp, true)}  HP ${player1Stat.hp}/${maxPlayer1Stat.hp} ???? 
**${player2Stat.id.username}** [lvl.${player2Stat.level}]
${generateIcon(player2Stat.hp, maxPlayer2Stat.hp, true)}  HP ${player2Stat.hp}/${maxPlayer2Stat.hp} ????`,
            inline: false,
        }],
        // files: ['https://cdn.discordapp.com/attachments/811586577612275732/811586719198871572/King_Slime_1.png']
    });
    await message.channel.send(startMessage, embed)
        .catch((err) => {
            console.log('(dungeon)'+message.author.id+': '+errorCode[err.code]);
        });
    let st = 1;
    let i = 0;
    do {
        if (player1Stat.hp > 0 && bossStat.hp > 0 && st == 1) {
            i++;
            st = await status(message, player1Stat, player2Stat, maxPlayer1Stat, maxPlayer2Stat, bossStat, maxBossStat, 1, i);
        }
        if (player2Stat.hp > 0 && bossStat.hp > 0 && st == 1) {
            i++;
            st = await status(message, player1Stat, player2Stat, maxPlayer1Stat, maxPlayer2Stat, bossStat, maxBossStat, 2, i);
        }

    }
    while (st == 1 && bossStat.hp > 0 && (player1Stat.hp > 0 || player2Stat.hp > 0));

    // Battle end
    deactiveCommand([player1.id, player2.id]);
    // TAKE THE KEY OUT
    queryData(`UPDATE backpack set quantity = quantity-${keyNeeded} WHERE player_id="${player1.id}" AND item_id="348" LIMIT 1`);
    queryData(`UPDATE backpack set quantity = quantity-${keyNeeded} WHERE player_id="${player2.id}" AND item_id="348" LIMIT 1`);

    if (st === 1 && bossStat.hp === 0) {
        
        // GENERATE REWARDS
        let chance = randomNumber(1, 100);
        let itemRewards = '';
        if (chance <= bossStat.chance) {        
            let dropsId = bossStat.boss_drop_id;
            dropsId = dropsId.split('|');
            let dropsItems = await queryData(`SELECT boss_drops.chance, boss_drops.max_drops, item.id, item.emoji, item.name FROM 
                boss_drops
                LEFT JOIN item ON (boss_drops.item_id = item.id)
                WHERE boss_drops.id IN (${dropsId})`);
            let dropsRewarded = randomizeChance(dropsItems, '');
            if (dropsRewarded) {
                let dropQty = randomNumber(1, dropsRewarded.max_drops);
                itemRewards = `\`+${dropQty} ${dropsRewarded.name}\` ${dropsRewarded.emoji} `;
                
                insertItemBackpackProcedure(player1.id, dropsRewarded.id, dropQty);
                insertItemBackpackProcedure(player2.id, dropsRewarded.id, dropQty);
                console.log(dropsRewarded);
            }
        }
        console.log(chance);

        let expReward = playerList[0].zone_id > 1 ? bossStat.max_exp * 100 : bossStat.min_exp * 100;
        let goldReward = playerList[0].zone_id > 1 ? bossStat.min_coin : bossStat.max_coin;
        message.channel.send(new Discord.MessageEmbed({
            type: "rich",
            color: 10115509,
            fields: [{
                name: 'Victory',
                value: `All party members now unlocked the next area`,
                inline: false,
            },{
                name: 'Rewards:',
                value: `\`+${currencyFormat(goldReward)} \`<:gold_coin:801440909006209025>\n\`+${currencyFormat(expReward)}\` <:exp:808837682561548288> \n${itemRewards}`,
                inline: false,
            }],
            author: {
                name: `${message.author.username}'s party`,
                url: null,
                iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
            },
        })).catch((err) => {
            console.log('(dungeon)'+message.author.id+': '+errorCode[err.code]);
        });
        addExpGold(message, player1, playerList[0], expReward, goldReward, player1Stat);
        addExpGold(message, player2, playerList[1], expReward, goldReward, player2Stat);
        // UPDATE STAT
        updateStat2(player2.id, 'boss_kills', '1');
        updateStat2(player1.id, 'boss_kills', '1');

        //move zone 
        if (playerList[0].zone_id < 7) {
            let newSubZone = playerList[0].sub_zone == 1 ? 2 : 1;
            let newZone = playerList[0].sub_zone > 1 ? parseInt(playerList[0].zone_id) + 1 : playerList[0].zone_id;

            let maxZoneList1 = playerList[0].max_zone.split('|');
            let maxZone1 = maxZoneList1[0];
            let maxSubZone1 = maxZoneList1[1];
            maxZone1 = maxZone1 > newZone ? maxZone1 : newZone;
            maxSubZone1 = newZone >= maxZone1 ? newSubZone : maxSubZone1;

            let maxZoneList2 = playerList[1].max_zone.split('|');
            let maxZone2 = maxZoneList2[0];
            let maxSubZone2 = maxZoneList2[1];
            maxZone2 = maxZone2 > newZone ? maxZone2 : newZone;
            maxSubZone2 = newZone >= maxZone2 ? newSubZone : maxSubZone2;

            queryData(`UPDATE stat SET zone_id='${newZone}', sub_zone='${newSubZone}', max_zone="${maxZone1}|${maxSubZone1}" WHERE player_id=${player1.id}`);
            queryData(`UPDATE stat SET zone_id='${newZone}', sub_zone='${newSubZone}', max_zone="${maxZone2}|${maxSubZone2}" WHERE player_id=${player2.id}`);
        } 
    } else if(player1Stat.hp <= 0 && player2Stat.hp <= 0) {
        message.channel.send(new Discord.MessageEmbed({
            type: "rich",
            color: 10115509,
            author: {
                name: `${message.author.username}'s party`,
                url: null,
                iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
            },
            fields: [{
                name: 'Defeated',
                value: `${message.author.username}'s party has wipeout\nbetter luck next time`,
                inline: false,
            }],
        })).catch((err) => {
            console.log('(dungeon)'+message.author.id+': '+errorCode[err.code]);
        });
    } else {
        message.channel.send(new Discord.MessageEmbed({
            type: "rich",
            color: 10115509,
            fields: [{
                name: `Failed`,
                value: `You are standing too long, \n**${bossStat.name}** has running away`,
                inline: false,
            }],
            author: {
                name: `${message.author.username}'s party`,
                url: null,
                iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
            },
        })).catch((err) => {
            console.log('(dungeon)'+message.author.id+': '+errorCode[err.code]);
        });
    }
}
async function status(msg, player1Stat, player2Stat, maxPlayer1Stat, maxPlayer2Stat, bossStat, maxBossStat, player, turnX) {
    let turn = '';
    let playerId = '';
    let player1 = player1Stat.id;
    let player2 = player2Stat.id;
    let commandList = [];
    let availableCommand = `\`\`\`Fighter Command 
- Slash      | 350% Att
- Stance     | Reflect 50% damage taken\`\`\``;
    if (player === 1) {
        turn = `> [Fighter] - <@${player1.id}> turn`;
        playerId = player1.id
        commandList = ['slash', 'stance']
        
    } else if (player === 2) {
        turn = `> [Support] - <@${player2.id}> turn`;
        playerId = player2.id
        commandList = ['heal', 'great heal', 'buff', 'sacrifice'];
        availableCommand = `\`\`\`Support Command
- Heal       | HP +200% Att
- Great Heal | HP +500% Att (use left:${greatHealUsed})
- Buff       | Fighter Att +50%
- Sacrifice  | Sacrifice HP 50% to the Fighter\`\`\``;
    }
    let commandMsg = new Discord.MessageEmbed({
        type: "rich",
        color: 10115509,
        fields: [{
            name: 'Commands list',
            value: availableCommand,
            inline: false,
        }],
    })
    const filter = (response) => {
        return commandList.some(answer => answer.toLowerCase() === response.content.toLowerCase() && [playerId].includes(response.author.id));
    };
    return await msg.channel.send(turn, commandMsg).then(async () => {
        return await msg.channel.awaitMessages(filter, {
            max: 1,
            time: 60000,
            errors: ['time']
        }).then(message => {
            message = message.first();
            let dmgToBoss = 0;
            let commandMessageLog = ``;
            let heal = 0;
            let attackBossMultiplier = 1;
            
            let spellMessage = '';
            if (turnX > 40) {
                attackBossMultiplier = 3;
            } else if (turnX > 30) {
                attackBossMultiplier = 2.5;
            } else if (turnX > 20) {
                attackBossMultiplier = 2;
            } else if (turnX > 15) {
                attackBossMultiplier = 1.5;
            }
            let dmgToPlayer1 = 0;
            let dmgToPlayer2 = 0;
            try {
                
                dmgToPlayer1 = damage(bossStat.attack * attackBossMultiplier, player1Stat.def);
                dmgToPlayer2 = damage(bossStat.attack * attackBossMultiplier, player2Stat.def);

                dmgToPlayer1 = Math.floor(randomNumber(dmgToPlayer1 / 2, dmgToPlayer1));
                dmgToPlayer2 = Math.floor(randomNumber(dmgToPlayer2 / 2, dmgToPlayer2));
            } catch (error) {
                console.log(error);
            }

                let dmgBossMessage = '';
                if (message.content.toLowerCase() == 'slash' || message.content.toLowerCase() == 'stance') {
                    dmgToBoss = damage(parseInt(player1Stat.attack) + parseInt(player1Stat.buff), bossStat.def);
                    dmgToBoss = Math.floor(randomNumber(dmgToBoss / 2, dmgToBoss));
                    dmgToBoss = message.content.toLowerCase() == 'stance' ? dmgToBoss - (dmgToBoss * 50 / 100) : dmgToBoss * 350 / 100; // reduce damage to boss
                    bossStat.hp = (bossStat.hp - dmgToBoss) > 0 ? bossStat.hp - dmgToBoss : 0;
                    dmgToPlayer1 = message.content.toLowerCase() == 'stance' ? dmgToPlayer1 - (dmgToPlayer1 * 50 / 100) : dmgToPlayer1;
                    dmgToPlayer2 = message.content.toLowerCase() == 'stance' ? dmgToPlayer2 - (dmgToPlayer2 * 50 / 100) : dmgToPlayer2;
                    if (bossStat.hp > 0) {
                        player1Stat.hp = (player1Stat.hp - dmgToPlayer1) > 0 ? player1Stat.hp - dmgToPlayer1 : 0;
                        player2Stat.hp = (player2Stat.hp - dmgToPlayer2) > 0 ? player2Stat.hp - dmgToPlayer2 : 0
                        player1Stat.mp = (player1Stat.mp - 20) >= 0 ? (player1Stat.mp - 20) : 0;
                        dmgBossMessage = `\n???? ${bossStat.name} using stomp deals total ${dmgToPlayer1 + dmgToPlayer2} dmg to all players`;
                    }
                    let player1DeadMessage = player1Stat.hp <= 0 ? `\n?????? **${player1.username}** has died` : '';
                    let player2DeadMessage = player2Stat.hp <= 0 ? `\n?????? **${player2.username}** has died` : '';
                    
                    if (player1Stat.mp >= 0) {
                        let dmgDealMessage = message.content.toLowerCase() == 'slash' ? `\n??????? ${message.author.username} using slash, deals ${dmgToBoss} dmg to ${bossStat.name} ` : `\n??????? ${message.author.username} using stance, reflect damage taken by ${dmgToPlayer1} [50%] dmg  `
                        player1Stat.buff = 0;
                        if (bossStat.hp > 0) {
                            commandMessageLog = `__??????**Battle log**??????__${dmgBossMessage}${dmgDealMessage}${player2DeadMessage}${player1DeadMessage}`;
                        } else {
                            commandMessageLog = `__??????**Battle log**??????__${dmgBossMessage}${dmgDealMessage}\n?????? ${bossStat.name} has been defeated`;
                        }
                    } else {
                        commandMessageLog = `__??????**Battle log**??????__\n???????**${message.author.username}** don't have enough **MP** to **Fight**\n???? ${bossStat.name} using stomp deals total ${dmgToPlayer1 + dmgToPlayer2} dmg to all players${player2DeadMessage}${player1DeadMessage}`
                    }
                    
                } else if (message.content.toLowerCase() == 'heal' || message.content.toLowerCase() == 'great heal' || message.content.toLowerCase() == 'buff') {
                    if (player2Stat.mp >= 0) {
                        let attackPercent = message.content.toLowerCase() == 'heal' ? 200 : 500;
                        heal = (player2Stat.attack * attackPercent) / 100;
                        if (message.content.toLowerCase() == 'great heal') {
                            if (greatHealUsed > 0) {
                                dmgToPlayer1 = dmgToPlayer1 - dmgToPlayer1 * 50 / 100;
                                dmgToPlayer2 = dmgToPlayer2 - dmgToPlayer2 * 50 / 100;
                                spellMessage = ` restore ${heal} HP\n to all players and reduce damage taken by 50%`
                            } else {
                                spellMessage = ` great heal failed, \nyou already used all your great healing spell`;
                            }
                        } else if (message.content.toLowerCase() == 'heal') {
                            spellMessage = ` restore ${heal} HP to all players`;
                        }
                        if (message.content.toLowerCase() == 'buff') {
                            player1Stat.buff = player1Stat.attack * 50 / 100;
                            spellMessage = ` increase fighter attack by 50% in next turn`;
                        }
                        if (message.content.toLowerCase() == 'heal' || (message.content.toLowerCase() == 'great heal' && greatHealUsed > 0)) {
                            greatHealUsed = greatHealUsed > 0 ? greatHealUsed - 1 : 0;
                            if (player1Stat.hp > 0) {
                                player1Stat.hp = player1Stat.hp + heal <= maxPlayer1Stat.hp ? player1Stat.hp + heal : maxPlayer1Stat.hp;
                            }
                            if (player2Stat.hp > 0) { 
                                player2Stat.hp = player2Stat.hp + heal <= maxPlayer2Stat.hp ? player2Stat.hp + heal : maxPlayer2Stat.hp;
                           }
                        }
                    
                        player1Stat.hp = (player1Stat.hp - dmgToPlayer1) > 0 ? player1Stat.hp - dmgToPlayer1 : 0;
                        player2Stat.hp = (player2Stat.hp - dmgToPlayer2) > 0 ? player2Stat.hp - dmgToPlayer2 : 0;
                        player2Stat.mp = (player2Stat.mp - 20) >= 0 ? (player2Stat.mp - 20) : 0;
                        let player1DeadMessage = player1Stat.hp <= 0 ? `\n???? **${player1.username}** has died` : '';
                        let player2DeadMessage = player2Stat.hp <= 0 ? `\n???? **${player2.username}** has died` : '';
                        commandMessageLog = `__??????**Battle log**??????__\n???? **${message.author.username}** using **${message.content.toLowerCase()} spell**,${spellMessage}\n???? ${bossStat.name} using stomp deals total ${dmgToPlayer1 + dmgToPlayer2} dmg to all players${player2DeadMessage}${player1DeadMessage}`
                    
                    } else {
                        let player1DeadMessage = player1Stat.hp <= 0 ? `\n???? **${player1.username}** has died` : '';
                        let player2DeadMessage = player2Stat.hp <= 0 ? `\n???? **${player2.username}** has died` : '';
                        commandMessageLog = `__??????**Battle log**??????__\n**${message.author.username}** don't have enough **MP** to **Heal**\n???? ${bossStat.name} using stomp deals total ${dmgToPlayer1 + dmgToPlayer2} dmg to all players${player2DeadMessage}${player1DeadMessage}`
                    }
                    
                    
                } else if (message.content.toLowerCase() == 'sacrifice') {
                    let hpSacrifice = 0;
                    try {
                        player2Stat.hp = Math.floor(player2Stat.hp - (maxPlayer2Stat.hp / 2));
                        hpSacrifice = Math.floor(maxPlayer2Stat.hp / 2)
                        player2Stat.hp = player2Stat.hp > 0 ? player2Stat.hp : 0;
                        if (player1Stat.hp > 0) {
                            player1Stat.hp = Math.floor(player1Stat.hp + (maxPlayer1Stat.hp / 2));
                            player1Stat.hp = player1Stat.hp > maxPlayer1Stat.hp ? maxPlayer1Stat.hp : player1Stat.hp;
                        }
                        spellMessage = ` sacrifice their 50% HP and\ntried to restore ${hpSacrifice} HP to the fighter`;
                        let player1DeadMessage = player1Stat.hp <= 0 ? `\n???? **${player1.username}** has died` : '';
                        let player2DeadMessage = player2Stat.hp <= 0 ? `\n???? **${player2.username}** has died` : '';
                        commandMessageLog = `__??????**Battle log**??????__\n???? **${message.author.username}** using **${message.content.toLowerCase()} spell**,${spellMessage}\n???? ${bossStat.name} using stomp deals total ${dmgToPlayer1 + dmgToPlayer2} dmg to all players${player2DeadMessage}${player1DeadMessage}`
                    
                    }catch (error) {
                            console.log(error);
                        }
                }
                let statusMessage =  new Discord.MessageEmbed({
                    type: "rich",
                    description: `**Dungeon Boss**`,
                    color: 10115509,
                    fields: [{
                        name: `${bossStat.emoji} ${bossStat.name} ${player1Stat.sub_zone == 2 ? `[Hard]` : `[Normal]`}`,
                        value: `${generateIcon(bossStat.hp,maxBossStat.hp, true)} ${Math.floor(bossStat.hp)}/${Math.floor(maxBossStat.hp)} ????\n--------------------------------------------------------\n**${player1Stat.id.username}** [lvl.${player1Stat.level}]\n${generateIcon(player1Stat.hp,maxPlayer1Stat.hp, true)}  HP ${Math.floor(player1Stat.hp)}/${Math.floor(maxPlayer1Stat.hp)} ????\n**${player2Stat.id.username}** [lvl.${player2Stat.level}]\n${generateIcon(player2Stat.hp,maxPlayer2Stat.hp, true)}  HP ${Math.floor(player2Stat.hp)}/${Math.floor(maxPlayer2Stat.hp)} ????`,
                        inline: false,
                    },
                        {
                            name: '--------------------------------------------------------',
                            value: `${commandMessageLog}`,
                        }
                    ],
                    footer: {
                        text: `Turn ${turnX}`,
                        iconURL: null,
                        proxyIconURL: null,
                    },
                })
                message.channel.send(statusMessage)
                    .catch((err) => {
                        console.log('(dungeon)' + message.author.id + ': ' + errorCode[err.code]);
                        return 0;
                    });
                return 1;
            })
            .catch((err) => {
                // console.log('timeout')
                // console.log('(dungeon)' + msg.author.id + ': ' + errorCode[err.code]);
                return 0;
            });
    })
}
export default dungeon;