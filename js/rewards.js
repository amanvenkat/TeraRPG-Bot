import { cooldownMessage } from "./embeddedMessage.js";
import isCommandsReady from "./helper/isCommandsReady.js";
import setCooldowns from "./helper/setCooldowns.js";
import Discord from 'discord.js'
import queryData from "./helper/query.js";
import currencyFormat from "./helper/currency.js";
import addExpGold from "./helper/addExp.js";
import { updateStat2 } from "./utils/processQuery.js";
import errorCode from "./utils/errorCode.js";
import { getMaxExp } from "./helper/getBattleStat.js";
import en from "./lang/en.js";

async function rewards(message,command, stat) {
    if (command == 'vote') {
        let cooldowns = await isCommandsReady(message.author.id, 'vote');
        let dayOfWeek = new Date();
        dayOfWeek = dayOfWeek.getDay();
        let isWeekend = (dayOfWeek === 6) || (dayOfWeek === 0); // 6 = Saturday, 0 = Sunday
        let multiplyWeekend = isWeekend ? 2 : 1;
        let status = '';
        let potion = (Math.floor(stat.level / 2) + 2) * multiplyWeekend;
        potion = potion <= 0 ? 1 : potion;
        potion = potion > 10 ? 10 : potion;
        let gold = (1352 * stat.level) * multiplyWeekend;
        gold = gold > 200000 ? 200000 : gold;
        let diamond = 1 * multiplyWeekend;
        let crate = 1 * multiplyWeekend;

        if (cooldowns.isReady) {
            status = en.rewards.notVote;
        } else {
            status = `${en.rewards.voted}\n${cooldowns.waitingTime}`;
        }
            // setCooldowns(message.author.id, 'vote');
            message.channel.send(new Discord.MessageEmbed({
                type: "rich",
                description: null,
                url: null,
                color: 10115509,
                fields: [
                    {
                        name: `Vote`,
                        value: en.rewards.moreRewards,
                        inline: false,
                    },
                    {
                        name: `Rewards`,
                        value: `• \`+${diamond}\`<:diamond:801441006247084042>\`Diamond\`\n• \`+${crate}\`<:Iron_Crate:810034071307943976>\`Iron crate\`\n• \`+${potion}\`<:Healing_Potion:810747622859735100>\`Healing potion\`\n• \`+${currencyFormat(gold)}\`<:gold_coin:801440909006209025>\`gold\``,
                        inline: true,
                    },
                    {
                        name: `Status`,
                        value: status,
                        inline: true,
                    }
                ],
                footer: {
                    text: en.rewards.doubleRewards
                }
            })).catch((err) => {
                console.log('(vote)' + message.author.id + ': ' + errorCode[err.code]);
            });
            // message.channel.send('Vote cooming soon!!!');
        // } else {
            // message.channel.send(cooldownMessage(message.author.id, message.author.username, message.author.avatar, 'Vote', cooldowns.waitingTime));
        // }
    
    // TODO hourly reward
    // } else if (command === 'hourly') {
    //     let cooldowns = await isCommandsReady(message.author.id, 'hourly');
    //     // if (cooldowns.isReady) {
    //         setCooldowns(message.author.id, 'hourly');
    //         let mp = 5 * stat.level;
    //         message.channel.send(new Discord.MessageEmbed({
    //             type: "rich",
    //             description: null,
    //             url: null,
    //             color: 10115509,
    //             fields: [{
    //                 name: 'Claimed hourly reward',
    //                 value: `\`+${mp} MP\``,
    //                 inline: false,
    //             }],
    //             author: {
    //                 name: `${message.author.username}`,
    //                 url: null,
    //                 iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
    //                 proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
    //             },
    //         }));
        // } else {
        //     message.channel.send(cooldownMessage(message.author.id, message.author.username, message.author.avatar, 'Hourly', cooldowns.waitingTime));
        // }
    } else if (command === 'daily') {
        let cooldowns = await isCommandsReady(message.author.id, 'daily');
        let benefitMultiply = 1;
        if (stat.subscribe_level == 1) {
            benefitMultiply = 1.2;
        } else if (stat.subscribe_level == 2) {
            benefitMultiply = 1.4;
        } else if (stat.subscribe_level == 3) {
            benefitMultiply = 1.7;
        }

        if (cooldowns.isReady) {
            setCooldowns(message.author.id, 'daily');
            let streak = await queryData(`SELECT daily_streak FROM cooldowns WHERE player_id="${message.author.id}" LIMIT 1`);
            streak = streak.length > 0 ? streak[0].daily_streak : 1;
            let isStreak = cooldowns.timeCooldowns <= 172800;
            let dailyStreak = isStreak ? streak + 1 : 1;
            let multiply = 150;
            let gold = 2000 + (dailyStreak > 100 ? 100 * multiply : dailyStreak * multiply);
            let bonus = Math.floor(gold * benefitMultiply) - gold;
            // gold = Math.floor(gold * benefitMultiply);
            message.channel.send(new Discord.MessageEmbed({
                type: "rich",
                description: null,
                url: null,
                color: 10115509,
                fields: [{
                    name: 'Claimed daily reward',
                    value: `<:gold_coin:801440909006209025> \`+${currencyFormat(gold)} gold\` ${dailyStreak >= 100 ? '[max]' : ''}` +
                        (benefitMultiply > 1 ? `\n<:gold_coin:801440909006209025> \`+${currencyFormat(bonus)} gold\` [ :tada:bonus ]` : '') + // subs benefits
                        ((dailyStreak % 7) === 0 ? '\n<:diamond:801441006247084042> \`+1 diamond\` [ :tada:bonus ]' : ''),
                    inline: false,
                }],
                author: {
                    name: `${message.author.username}`,
                    url: null,
                    iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                    proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                },
                footer: {
                    text: `Daily streak: #${dailyStreak} \n${en.rewards.dailyStreak}`,
                    iconURL: null,
                    proxyIconURL: null
                },
                files: []
            })).catch((err) => {
                console.log('(daily)' + message.author.id + ': ' + errorCode[err.code]);
            });
            
            // add diamond if user check in for 7 days in a row
            gold = gold + bonus;
            if ((dailyStreak % 7) === 0) {
                queryData(`UPDATE stat SET diamond=diamond + 1, gold=gold + ${gold} WHERE player_id="${message.author.id}" LIMIT 1`);
            } else {
                queryData(`UPDATE stat SET gold=gold + ${gold} WHERE player_id="${message.author.id}" LIMIT 1`);
            }
            await queryData(`UPDATE cooldowns SET daily_streak="${dailyStreak}" WHERE player_id="${message.author.id}" LIMIT 1`)
            // UPDATE STAT
            updateStat2(message.author.id, 'daily_strikes', dailyStreak);
        } else {
            message.channel.send(cooldownMessage(message.author.id, message.author.username, message.author.avatar, 'Daily', cooldowns.waitingTime));
        }
    } else if (command === 'weekly') {
        let cooldowns = await isCommandsReady(message.author.id, 'weekly');
        let benefitMultiply = 1;
        if (stat.subscribe_level == 1) {
            benefitMultiply = 1.2;
        } else if (stat.subscribe_level == 2) {
            benefitMultiply = 1.4;
        } else if (stat.subscribe_level == 3) {
            benefitMultiply = 1.7;
        }
        if (cooldowns.isReady) {
            setCooldowns(message.author.id, 'weekly');
            let multiply = 100 * stat.zone_id;
            let gold = 2500 + multiply;
            let bonus = Math.floor(gold * benefitMultiply) - gold;
            let exp = getMaxExp(stat.level);
            exp = Math.floor(exp / 3);
            let totalExp = parseInt(exp) + parseInt(stat.current_experience);
            let levelEXP = await queryData(`SELECT experience, id FROM level WHERE id=${stat.level + 1} LIMIT 1`)
            let levelUPmessage = '';
        if (levelEXP.length > 0 && totalExp >= levelEXP[0].experience) {
            // LEVEL UP
            let data = await queryData(`SELECT id, experience FROM level WHERE experience<=${totalExp} ORDER BY id DESC LIMIT 1`)
            let nLevel = levelEXP[0].id;
            let cExp = totalExp - levelEXP[0].experience;
            let maxHp = 5 * (nLevel + stat.basic_hp);
            let maxMp = 5 * (nLevel + stat.basic_mp);
            
            queryData(`UPDATE stat SET level="${nLevel}", current_experience=${cExp}, gold=gold + ${gold},  hp="${maxHp}", mp="${maxMp}" WHERE player_id="${message.author.id}" LIMIT 1`);
            levelUPmessage = `> :tada: | **${message.author.username}** Level up +${nLevel - stat.level}, HP restored`
        } else {
            queryData(`UPDATE stat SET current_experience=${totalExp}, gold=gold + ${gold} WHERE player_id="${message.author.id}" LIMIT 1`);
        }
        message.channel.send(new Discord.MessageEmbed({
            type: "rich",
            description: null,
            url: null,
            color: 10115509,
            fields: [{
                name: 'Claimed weekly rewards',
                value: `<:gold_coin:801440909006209025> \`+${currencyFormat(gold)} gold\`` +
                    (benefitMultiply > 1 ? `\n<:gold_coin:801440909006209025> \`+${currencyFormat(bonus)} gold\` [ :tada:bonus ]` : '') +
                    `\n<:exp:808837682561548288> \`+${currencyFormat(exp)} experience\``,
                inline: false,
            }],
            author: {
                name: `${message.author.username}`,
                url: null,
                iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
            },
            timestamp: new Date(),
            files: []
        })).catch((err) => {
            console.log('(weekly)' + message.author.id + ': ' + errorCode[err.code]);
        });
            gold = gold + bonus;
            addExpGold(message, message.author, stat, exp, gold, null );
        // message.channel.send(levelUPmessage);
        } else {
            message.channel.send(cooldownMessage(message.author.id, message.author.username, message.author.avatar, 'weekly', cooldowns.waitingTime));
        }
    }
}

export default rewards;