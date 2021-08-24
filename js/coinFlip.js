import currencyFormat from "./helper/currency.js";
import queryData from "./helper/query.js";
import Discord from 'discord.js';
import errorCode from "./utils/errorCode.js";
import randomNumber from "./helper/randomNumberWithMinMax.js";

async function coinFlip(message, args, playerStat) {
    if (args.length > 0) {
        let bet = args[1];
        let betLimit = 500000;
        if (playerStat.subscribe_level > 0) {
            betLimit = betLimit * playerStat.subscribe_level;
        }
        if (bet > betLimit) {
            message.reply(`You can't bet more than __${currencyFormat(betLimit)}__ gold`);
            return;
        }
        
        if (bet > playerStat.gold) {
            return msg.channel.send(`${emojiCharacter.noEntry} | Nice try **${msg.author.username}**, your maximum bet is __${currencyFormat(playerStat.gold)}__!`)
        }

        if (bet > 0 && (args[0].toLowerCase() === 'head' || args[0].toLowerCase() === 'tail' || args[0].toLowerCase() === 'h' || args[0].toLowerCase() === 't')) {

            let chance = randomNumber(1, 5);
            let side = args[0].toLowerCase();
            if (side === 'heads' || side === 'head' || side === 'h') {
                if (chance < 3) {
                    queryData(`UPDATE stat SET gold=gold + ${bet} WHERE player_id="${message.author.id}" LIMIT 1`)
                    // message.channel.send(`**Heads**! You got ${bet} gold.`);
                    messageEmbed(message, bet, side, 'Heads', 1)
                } else {
                    queryData(`UPDATE stat SET gold=gold - ${bet} WHERE player_id="${message.author.id}" LIMIT 1`)
                    messageEmbed(message, bet, side, 'Tails', 0)
                }
            } else if (side === 'tails' || side === 'tail' || side === 't') {
                if (chance < 3) {
                    queryData(`UPDATE stat SET gold=gold + ${bet} WHERE player_id="${message.author.id}" LIMIT 1`)
                    messageEmbed(message, bet, side, 'Tails', 1)
                } else {
                    queryData(`UPDATE stat SET gold=gold - ${bet} WHERE player_id="${message.author.id}" LIMIT 1`)
                    messageEmbed(message, bet, side, 'Heads', 0)
                }                    
            }
        }
    }
}

function messageEmbed(message, bet, playerSide, gotSide, isWin) {
    message.channel.send(new Discord.MessageEmbed({
        "type": "rich",
        "title": null,
        "description": null,
        "url": null,
        "color": 10115509,
        "fields":
            [
                {
                    "value": isWin === 1 ? `You got ${bet} gold! \n :tada::tada::tada::tada::tada:` : `You lost ${bet} gold! \n :thumbsdown::thumbsdown::thumbsdown::thumbsdown::thumbsdown:`,
                    "name": `:coin: **${gotSide}** :coin:`,
                    "inline": false
                },
            ],
        "thumbnail": null,
        "image": null,
        "video": null,
        "author": {
            "name": `${message.author.username}'s Coin Flips`,
            "url": null,
            "iconURL": `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
            "proxyIconURL": `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        },
        "provider": null,
        "files": []

    })).catch((err) => {
        console.log('(CF)'+message.author.id+': '+errorCode[err.code]);
    });
}

export default coinFlip;