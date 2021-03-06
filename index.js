import Discord from 'discord.js';
import config from './config.js';
// Agenda 
import Agenda from 'agenda'
// import mongoClient from 'mongodb';
// const dbRPG = 'mongodb://127.0.0.1:27017';
const mongoConnectionString = 'mongodb://127.0.0.1/agenda';
// const MongoClient = new mongoClient.MongoClient;
const agenda = new Agenda({
    db: {
        address: mongoConnectionString,
        options: {
            
            useUnifiedTopology: true
        }
    }
});

//TOP GG
import Topgg  from "@top-gg/sdk";
import express from "express";
import DBL from 'dblapi.js';
import AutoPoster from 'topgg-autoposter';
// https://discord.com/api/webhooks/822314548291698718/4pmafrE03jh1nB8Ee_66WTyPKWC3M_hD-nbL9SZIgYTMl_5adXmo_YB4aqYaxi1mDSVL

// const app = express();
// const webhook = new Topgg.Webhook("Bot123TeraRPG");

// app.post("/dblwebhook", webhook.middleware(), (req, res) => {
//   // req.vote will be your vote object, e.g
//     console.log('kjkjk');
//   console.log(req.vote.user); // 395526710101278721 < user who voted
// });

// app.listen(5555);

//=====================================
// LIMITER
const waitingTime = new Set();
// Command
import profile from './js/profile.js';
import hunt from './js/commands/hunt.js';
import work from './js/work.js';
import healingPotion from './js/healingPotion.js';
import backpack from './js/backpack.js';
import tools from './js/tools.js';
import crafting from './js/crafting.js';
import queryData from './js/helper/query.js';
import teleport from './js/teleport.js';
import help from './js/help.js';
import workspace from './js/workspace.js';
import sellItem from './js/sellItem.js';
import coinFlip from './js/coinFlip.js';
import rewards from './js/rewards.js';
import cooldowns from './js/cooldowns.js';
import lottery from './js/lottery.js';
import lotteryWinnerRunSchedule from './js/helper/lotterySchedule.js';
import fishing from './js/fishing.js';
import openCrate from './js/openCrate.js';
import invite from './js/invite.js';
import dungeon from './js/dungeon.js';
import { statusCommand } from './js/helper/setActiveCommand.js';
import junken from './js/junken.js';
import report from './js/report.js';
import suggest from './js/suggest.js';
import voteRewardsSend from './js/voteRewardsSend.js';
import upgrade from './js/upgrade.js';
import ranks from './js/leaderboards.js';
import myCache from './js/cache/leaderboardChace.js';
import market from './js/market.js';
import buy from './js/buy.js';
import deposit from './js/deposit.js';
import shop from './js/shop.js';
import withdraw from './js/withdraw.js';
import bank from './js/bank.js';
import bonus from './js/bonus.js';
import reforge from './js/reforge.js';
import log from './js/helper/logs.js';
import give from './js/adminCommands/giveItem.js';
import armory from './js/commands/armory.js';
import unOrEquip from './js/commands/un_equip.js';
import booster from './js/adminCommands/booster.js';
import trade from './js/commands/trade.js';
import adventure from './js/adventure.js';
import smelt from './js/commands/smelt.js';
import donate from './js/commands/donate.js';
import servant from './js/commands/servant.js';
import duel from './js/commands/duel.js';
import quest from './js/commands/quest.js';
import pirate from './js/commands/pirate.js';
import use from './js/commands/useItem.js';
import code from './js/commands/code.js';
import randomNumber from './js/helper/randomNumberWithMinMax.js';
import info from './js/commands/info.js';
import notification from './js/commands/notification.js';
import notifUrl from './js/adminCommands/addUrlNotif.js';
import stats from './js/commands/stats.js';
import marketAdd from './js/commands/marketplace/marketAdd.js';
import marketplace from './js/commands/marketplace/marketplace.js';
import marketRemove from './js/commands/marketplace/marketRemove.js';
import marketBuy from './js/commands/marketplace/marketBuy.js';
import errorCode from './js/utils/errorCode.js';
import food from './js/commands/food.js';
import prefix from './js/commands/prefix.js';
import reply from './js/adminCommands/reply.js';
import eatFood from './js/commands/eat.js';
import startblackjack from './js/commands/mini-games/blackjack.js';
import blackjack from './js/commands/mini-games/blackjack.js';
import cook from './js/commands/cook.js';
import botDetection from './js/utils/guard/botDetection.js';
import release from './js/utils/guard/release.js';
import activeBuff from './js/commands/food/buff.js';
import recipes from './js/commands/food/recipes.js';
import skills from './js/commands/skill/skill.js';
// Discord
const client = new Discord.Client();
const ap = AutoPoster(config.DBL_TOKEN, client) // your discord.js or eris client

// optional
ap.on('posted', () => { // ran when succesfully posted
    console.log('Posted stats to top.gg')
  })
const guildMember = new Discord.GuildMember();

client.login(config.BOT_TOKEN);

const dbl = new DBL(config.DBL_TOKEN, { webhookPort: config.PORT_WEBHOOK, webhookAuth: '11211' });
dbl.webhook.on('vote', (vote)=>{
    voteRewardsSend(client,vote.user,vote.isWeekend)
    const webhook = new Discord.WebhookClient('822314548291698718', '4pmafrE03jh1nB8Ee_66WTyPKWC3M_hD-nbL9SZIgYTMl_5adXmo_YB4aqYaxi1mDSVL');
    webhook.send(`${vote.user} has voted`)
})
// Command Prefix
let teraRPGPrefix = config.PREFIX;
let ownerId = '668740503075815424';
client.on('ready', () => {
    console.log('Ready');
    if (config.SHOW_ACTIVITY) {
        client.user.setActivity({
            type: "LISTENING",
            name: `${teraRPGPrefix}help`,
        });
    }
    // Reset active command
    queryData(`UPDATE player SET active_command=0`);
    lotterySchedule(client);
})
client.on("message", async function (message) {
    let content = message.content.toLowerCase();
    if (message.author.bot) {
        // console.log(message.embeds)
        return;
    }

    // Set prefix
    let modifierPrefix = '';
    try {
        modifierPrefix = myCache.get(`prefix${message.guild.id}`);
    } catch (error) { 
        console.log(message.guild);
    }

    if (!modifierPrefix) {
        let data = await queryData(`SELECT prefix FROM prefix WHERE guild_id=${message.guild.id} LIMIT 1`);
        if (data.length > 0) {
            teraRPGPrefix = data[0].prefix;
        } else {
            teraRPGPrefix = config.PREFIX;
        }
        myCache.set(`prefix${message.guild.id}`, teraRPGPrefix);
    } else {
        teraRPGPrefix = modifierPrefix;
    }
    // ================================================================================================================================
    // CO COMMAND
    
    if (content.startsWith(teraRPGPrefix)) {
        let commandBody = message.content.slice(teraRPGPrefix.length).toLowerCase();
        let rawArgs = message.content.slice(teraRPGPrefix.length);
        rawArgs = rawArgs.trim().split(/ +/);
        rawArgs.shift();
        const args = commandBody.trim().split(/ +/);
        const command = args.shift().toLowerCase();
        // const command2 = args.shift().toLowerCase();
        const prefixCommand = teraRPGPrefix + command;
        const body = message.content.replace(prefixCommand, '');
        if (message.author.id === '668740503075815424') {
            if (command === "repost") {
                message.channel.send(body);
                message.delete();
                return;
            } else if (command === "pset") {
                    message.delete();
                    client.channels.cache.get("818359215562424330").setName(`\\????-Status`)
                    client.channels.cache.get("818359215562424330").send(`\\???? Bot is Preparing for Maintenance\n\`\`\`${body}\`\`\``)
                    await queryData(`update configuration set value=1 where id=1;`);
                    message.channel.send(`Server set prepare maintenance`);
            } else if (command === "punset") {
                    message.delete();
                    client.channels.cache.get("818359215562424330").setName(`\\????-Status`)
                    client.channels.cache.get("818359215562424330").send(`\\???? Bot Online\n\`\`\`${body}\`\`\``)
                    await queryData(`update configuration set value=0 where id=1;`);
                    message.channel.send(`Server unset prepare maintenance`);
            } else if (command === "mtset") {
                    message.delete();
                    client.channels.cache.get("818359215562424330").setName(`\\????-Status`)
                    client.channels.cache.get("818359215562424330").send(`\\???? Bot Offline`)
                    await queryData(`update configuration set value=0 where id=1;`);
                    await queryData(`update configuration set value=1 where id=6;`);
                    message.channel.send(`Server set maintenance`);
            }   else if (command === "mtunset") {
                    message.delete();
                    client.channels.cache.get("818359215562424330").setName(`\\????-Status`)
                    client.channels.cache.get("818359215562424330").send(`\\???? Bot Online`)
                    await queryData(`update configuration set value=0 where id=6;`);
                    message.channel.send(`Server unset maintenance`);
            }else if (command === "member") {
                let member = await queryData(`SELECT count(*) as totalMember FROM player`);
                // console.log(member[0].totalMember);
                message.channel.send(`total member : ${member[0].totalMember}`);
                return;
            } else if (command === "delete") {
                queryData(`DELETE FROM player WHERE id="${args[0]}" LIMIT 1`);
                
                message.delete();
                message.channel.send(`Player <@${args[0]}> has been delete from database`);
                return;
            } else if (command === "ban") {
                queryData(`UPDATE player SET is_active="0" WHERE id="${args[0]}" LIMIT 1`);
                
                message.delete();
                message.channel.send(`Player <@${args[0]}> has been banned`);
                return;
            } else if (command === "unban") {
                queryData(`UPDATE player SET is_active="1" WHERE id="${args[0]}" LIMIT 1`);

                message.delete();
                message.channel.send(`Player <@${args[0]}> unbanned`);
                return;
            } else if (command === "level") {
                if (args.length > 0) {
                    if (!isNaN(args[0])) {
                        if (args.length > 1) {
                            if (args[0].length < 5 && args[0] > 0) {
                                queryData(`UPDATE stat SET level="${args[0]}" WHERE player_id="${args[1]}" LIMIT 1`);

                                message.delete();
                                message.channel.send(`Player <@${args[1]}>'s level has been set to ${args[0]}`);
                            } else {
                                message.channel.send('Failed!')
                            }
                        } else {
                            queryData(`UPDATE stat SET level="${args[0]}" WHERE player_id="${message.author.id}" LIMIT 1`);
        
                            message.delete();
                            message.channel.send(`Level has been set to ${args[0]}`);
                        }
                    }
                }
                return;
            } else if (command === "math") {
                try {
                    let num = eval(body);
                    message.reply(num);
                } catch (error) {
                    return;
                }
            } else if (command === "raw") {
                message.delete()
                try {
                    let num = await eval(body);
                    message.reply(`\`\`\`${num}\`\`\``);
                    console.log(num)
                } catch (error) {
                    message.reply(`\`\`\`${error.toString()}\`\`\``);
                }
            }  else if (command === "give") {
                give(message, args);
            } else if (command === 'booster') {
                booster(message, args);
            } else if (command === 'updatenotif') {
                notifUrl(message, rawArgs[0]);
            } else if (command === 'pirate') {
                let stat = await queryData(`SELECT id, active_command, depth, zone_id, max_zone, sub_zone, is_active, stat.gold, stat.level, stat.hp, stat.basic_hp, stat.basic_mp, stat.current_experience FROM player LEFT JOIN stat ON (player.id = stat.player_id) WHERE id=${message.author.id} LIMIT 1`)
                stat = stat[0];
                pirate(message, stat);
            } else if (command === 'reply') {
                // log(message, commandBody);
                reply(client, message, args, body);
            } else if (command === 'guard') {
                // log(message, commandBody);
                botDetection(message);
            }
        }
        if (command != '') {
            // try {
                // FIND USER REGISTRATION
            let isUserRegistred = await queryData(`SELECT id, subscribe_level, active_command, depth, zone_id, max_zone, sub_zone, is_active, stat.gold, stat.level, stat.hp, stat.basic_hp, stat.basic_mp, stat.current_experience
                FROM player
                LEFT JOIN stat ON (player.id = stat.player_id) WHERE id=${message.author.id} LIMIT 1`)
                if (waitingTime.has(message.author.id)) {
                    message.reply("Wait at least 1 second before getting typing this again.");
                    return;
                }
                if (isUserRegistred.length > 0) {
                    let stat = isUserRegistred[0];
                    if (isUserRegistred[0].is_active) { // Check Banned User
                        let configuration = await queryData(`SELECT value FROM configuration WHERE id IN (1,6) ORDER BY id LIMIT 2`);
                        let prepareMaintenance = configuration.length > 0 ? parseInt(configuration[0].value) : false;
                        let maintenance = configuration.length > 0 ? parseInt(configuration[1].value) : false;
                        if (isUserRegistred[0].active_command === 1) {
                            message.reply(`you have an active command, end it before processing another!`);
                            return;
                        }
                        if (maintenance && message.author.id !== '668740503075815424') {
                            message.channel.send('??????? | Bot is under maintenance...!');
                            return;
                        }
                        if (prepareMaintenance && message.author.id !== '668740503075815424') {
                            message.channel.send('??????? | Bot is preparing for maintenance...!');
                            return;
                        }
                        
                        let isJailed = await queryData(`SELECT * FROM jail WHERE player_id=${message.author.id} AND released=0 LIMIT 1`);
                        isJailed = isJailed.length > 0 ? isJailed[0] : false;
                        if (isJailed) {
                            if (command === 'jail') {
                                log(message, commandBody);
                                release(message, commandBody);
                            } else {
                                return message.channel.send(`You are in Jail **${message.author.username}**,\ntype \`jail\` to verify your self`);
                            }
                        }

                        if (command == 'exp' || command == 'me' || command == 'chop' || command == 'mine' || command == 'fish' || command == 'mine expedition' || command == 'explore') {
                            
                            let verified = await botDetection(message);
                            // console.log(verified);
                            if (!verified) {
                                return;
                            }
                            // RANDOM INVASION PIRATE
                            let randomize = randomNumber(1, 500);
                            if (randomize <= 1) {
                                pirate(message, stat);
                            }
                        }

                        if (command == 'p' || command == 'profile') {
                            let notifIsRead = await queryData(`SELECT * FROM notification_read WHERE player_id=${message.author.id} AND is_read=1 LIMIT 1`);
                            notifIsRead = notifIsRead.length > 0 ? notifIsRead[0] : undefined;

                            if (!notifIsRead) {
                                notification(message);
                            }
                        
                            let authorTag = message.author.tag;
                            let isStringByte4 = /[\u{10000}-\u{10FFFF}]/u.test(authorTag);
                            authorTag = isStringByte4 ? message.author.id : authorTag;
                            // UPDATE USERNAME
                            queryData(`UPDATE player SET username="${authorTag}" WHERE id=${message.author.id} LIMIT 1`);
                        }

                        if (command === "ping") {
                            log(message, commandBody);
                            let timeTaken = Date.now() - message.createdTimestamp;
                            if (timeTaken < 0) {
                                timeTaken = -timeTaken;
                            }
                            message.channel.send(`Pong! ${timeTaken}ms.`);
                        } else if (command === 'help') {
                            log(message, commandBody);
                            help(message, client);
                        } else if (command === 'start') {
                            log(message, commandBody);
                            message.reply(`You already registered, type \`${teraRPGPrefix} help\` for more commands`)
                        } else if (command === 'p' | command === 'profile') {
                            log(message, commandBody);
                            profile(message, client, message.author.id, message.author.avatar, args[0]);
                        } else if (command === 'explore' | command === 'exp') {
                            log(message, commandBody);
                            hunt(message, 0, message.author.id, message.author.username);
                        
                        } else if (command === 'heal') {
                            log(message, commandBody);
                            healingPotion(message, 0, message.author.id, message.author.username);
                        } else if (command === 'minex' || commandBody.includes('mine expedition') || command === 'me' || command === 'adventure' || command === 'adv') {
                            log(message, commandBody);
                            adventure(message, stat);
                        } else if (command === 'mine' || command === 'chop') {
                            log(message, commandBody);
                            work(message, command, isUserRegistred[0].zone_id);
                        } else if (command === 'backpack' || command === 'bp') {
                            log(message, commandBody);
                            backpack(message, args[0]);
                        } else if (command === 'workspace' || command === 'ws') {
                            log(message, commandBody);
                            workspace(message, args[0]);
                        } else if (command === 'tool' || command === 'tools') {
                            log(message, commandBody);
                            tools(message, args[0]);
                        } else if (command === 'craft') {
                            log(message, commandBody);
                            crafting(message, commandBody, stat);
                        } else if (command === 'zone' || command === 'z') {
                            log(message, commandBody);
                            teleport(message, stat, args);
                        } else if (command === 'sell') {
                            log(message, commandBody);
                            // let itemName = commandBody.slice(command.length + 1)
                            // console.log(itemName);
                            sellItem(message, args, commandBody)
                        } else if (command === `cf`) {
                            // log(message, commandBody);
                            coinFlip(message, args, stat)
                        } else if (command === 'vote' || command === 'hourly' || command === 'daily' || command === 'weekly') {
                            log(message, commandBody);
                            rewards(message, command, isUserRegistred[0]);
                        } else if (command === 'cd' || command === 'cooldowns' || command === 'rd' || command === 'ready') {
                            log(message, commandBody);
                            cooldowns(message, command, args[0]);
                        } else if (command === 'lottery') {
                            log(message, commandBody);
                            lottery(message, client, args, stat)
                        } else if (command === 'fish') {
                            log(message, commandBody);
                            fishing(message, stat);
                        } else if (command === 'open') {
                            log(message, commandBody);
                            openCrate(client, message, args, stat);
                        } else if (command === 'invite') {
                            log(message, commandBody);
                            invite(message);
                        } else if (command === 'dungeon') {
                            log(message, commandBody);
                            dungeon(message, stat);
                        } else if (command === 'junken') {
                            log(message, commandBody);
                            junken(message, stat);
                        } else if (command === 'report') {
                            log(message, commandBody);
                            report(message, client, args, body);
                        } else if (command === 'suggest') {
                            log(message, commandBody);
                            suggest(message, client, args, body);
                        } else if (command === 'upgrade') {
                            log(message, commandBody);
                            upgrade(message, args[0]);
                        } else if (command === 'ranks') {
                            log(message, commandBody);
                            ranks(message, args[0]);
                        } else if (command === 'market') {
                            log(message, commandBody);
                            market(message);
                        } else if (command === 'shop') {
                            log(message, commandBody);
                            shop(message, stat);
                        } else if (command === 'buy') {
                            log(message, commandBody);
                            buy(message, commandBody);
                        } else if (command === 'deposit') {
                            log(message, commandBody);
                            deposit(message, args[0]);
                        } else if (command === 'withdraw' || command === 'wd') {
                            log(message, commandBody);
                            withdraw(message, args[0]);
                        } else if (command === 'bank') {
                            log(message, commandBody);
                            bank(message);
                        } else if (command === 'booster') {
                            log(message, commandBody);
                            bonus(message);
                        } else if (command === 'reforge' || command === 'sreforge' || command === 'ureforge') {
                            log(message, commandBody);
                            reforge(message, command, commandBody, args[0], args[1], stat);
                        }
                        else if (command === 'armory') {
                            log(message, commandBody);
                            armory(message, args[0]);
                        }
                        else if (command === 'equip' || command === 'unequip') {
                            log(message, commandBody);
                            unOrEquip(message, command, args[0], commandBody, stat);
                        } else if (command === 'trade') {
                            log(message, commandBody);
                            trade(message, stat, args);
                        } else if (command === 'smelt') {
                            log(message, commandBody);
                            smelt(message, args);
                        } else if (command === 'donate') {
                            log(message, commandBody);
                            donate(message);
                        } else if (command === 'servant') {
                            log(message, commandBody);
                            servant(message);
                        } else if (command === 'duel') {
                            log(message, commandBody);
                            duel(message, stat);
                        } else if (command === 'quest') {
                            log(message, commandBody);
                            quest(message, stat);
                        }
                        // else if (command === 'pirate') {
                        //     log(message, commandBody);
                        //     pirate(message,stat);
                        // }
                        else if (command === 'use') {
                            log(message, commandBody);
                            use(message, commandBody);
                        } else if (command === 'code') {
                            log(message, commandBody);
                            code(message, args);
                        } else if (command === 'info') {
                            log(message, commandBody);
                            info(message, args, commandBody);
                        } else if (command === 'notification' || command === 'notif') {
                            log(message, commandBody);
                            notification(message);
                        } else if (command === 'stats' || command === 'stat') {
                            log(message, commandBody);
                            stats(message, args[0]);
                        } else if ((command === 'marketplace' || command === 'mp') && args[0] == 'add') {
                            log(message, commandBody);
                            marketAdd(message, args, commandBody, stat);
                        } else if ((command === 'marketplace' || command === 'mp') && args[0] == 'remove') {
                            log(message, commandBody);
                            marketRemove(message, args, body);
                        } else if ((command === 'marketplace' || command === 'mp') && args[0] == 'buy') {
                            log(message, commandBody);
                            marketBuy(message, args, stat);
                        } else if (command === 'marketplace' || command === 'mp') {
                            log(message, commandBody);
                            marketplace(message, args, stat);
                        } else if (command === 'food' || command === 'fd') {
                            log(message, commandBody);
                            food(message, args);
                        } else if (command === 'eat') {
                            log(message, commandBody);
                            eatFood(message, stat, commandBody);
                        } else if (command === 'prefix') {
                            log(message, commandBody);
                            prefix(message, args);
                        } else if (command === 'bj' || command === 'blackjack') {
                            log(message, commandBody);
                            blackjack(message, args, stat);
                        } else if (command === 'cook') {
                            log(message, commandBody);
                            cook(message, commandBody, stat);
                        } else if (command === 'buff') {
                            log(message, commandBody);
                            activeBuff(message);
                        } else if (command === 'recipes' || command === 'recipe') {
                            log(message, commandBody);
                            recipes(message, commandBody);
                        } else if (command === 'skill' || command === 'skills') {
                            log(message, commandBody);
                            skills(message, args[0]);
                        }
                    }
                } else if (command === 'start') {
                    // INSERT USER
                    let authorTag = message.author.tag;
                    let isStringByte4 = /[\u{10000}-\u{10FFFF}]/u.test(authorTag);
                    authorTag = isStringByte4 ? message.author.id : authorTag;
                    // console.log(cekIfStringByte4);         // true
                    // console.log(authorTag.replace(/[\u{10000}-\u{10FFFF}]/gu, '')); // `hello world!`
                    let log = await queryData(`CALL start_procedure("${message.author.id}","${authorTag}")`) // convert to base64
                    log = log.length > 0 ? log[0][0].log : 0;
                    let m = `Welcome to teraRPG, type \`${teraRPGPrefix} exp\` to begin your journey\nYou can also see other commands with \`${teraRPGPrefix} help\`. Oh almost forgot, \nhere is a present for you, hope it can help you through the cruelty of the world`
                    let embed = new Discord.MessageEmbed({
                        type: "rich",
                        title: null,
                        description: null,
                        url: null,
                        color: 10115509,
                        fields: [
                            {
                                name: `Register reward`,
                                value: `\`x1\` \\????\`starter pack\``,
                                inline: false
                            },
                            {
                                name: `Info`,
                                value: `use \`tera open starter pack\` to open it`,
                                inline: false
                            },
                        ],
                        footer: {
                            text: '\`tera invite\` to get help on support server'
                        },
                    })
                    message.reply(m, embed)
                        .catch((err) => {
                            console.log('(Start)' + message.author.id + ': ' + errorCode[err.code]);
                        });
                
                    if (log <= 0) return;
                    client.channels.cache.get('818360247647076382').send(
                        new Discord.MessageEmbed({
                            type: "rich",
                            title: null,
                            description: null,
                            url: null,
                            color: 10115509,
                            fields: [
                                {
                                    value: `:bust_in_silhouette: ${message.author.tag}\n:id: ${message.author.id}`,
                                    name: 'User',
                                    inline: true
                                },
                            ],
                            author: {
                                name: ` #${log} | User Registered`,
                                url: null,
                                iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                                proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
                            },
                            provider: null,
                            timestamp: new Date(),
                        })
                    )
                } else {
                    message.reply(`you are not registered yet, to start playing type \`${teraRPGPrefix}start\``)
                }

                // Adds the user to the set so that they can't type for a second
                waitingTime.add(message.author.id);
                setTimeout(() => {
                    // Removes the user from the set after a second
                    waitingTime.delete(message.author.id);
                }, 1200);
            // }
            // catch (error) {
            //     console.log('Error')
            //     client.users.cache.get(ownerId).send('Error: ' + error);
            // }
        }
    }




    // ======================================================================================/=
     // FUNCTION
        async function agendaRun(message, command, textMessage, time) {
            agenda.define(`${command} ${message.author.id}`, async job => {
                await message.channel.send(`<@${message.author.id}>, ${textMessage}`);
            });
        
            await agenda.start();
            await agenda.cancel({ name: `${command} ${message.author.id}` });
            await agenda.schedule(time, `${command} ${message.author.id}`);
        }
    
        async function boosterExpire(message, command, textMessage, time) {
            agenda.define(`${command} ${message.author.id}`, async job => {
                queryData(`UPDATE configuration SET value=0 WHERE id=3 LIMIT 1`);
            });
        
            await agenda.start();
            await agenda.cancel({ name: `${command} ${message.author.id}` });
            await agenda.schedule(time, `${command} ${message.author.id}`);
        }
    
        
    async function cooldownsReminder(item, message) {
        let a = null;
        let b = null;
        switch (item) {
            case "daily":
                a = 0;
                b = 0;
            break;
            case "weekly":
                a = 0;
                b = 1;
            break;
            case "lootbox":
                a = 0;
                b = 2;
            break;
            case "vote":
                a = 0;
                b = 3;
            break;
            case "hunt":
                a = 1;
                b = 0;
            break;
            case "adventure":
                a = 1;
                b = 1;
            break;
            case "training":
                a = 1;
                b = 2;
            break;
            case "duel":
                a = 1;
                b = 3;
            break;
            case "quest":
                a = 1;
                b = 4;
            break;
            case "worker":
                a = 2;
                b = 0;
            break;
            case "horse":
                a = 2;
                b = 1;
            break;
            case "arena":
                a = 2;
                b = 2;
            break;
            case "dungeon":
                a = 2;
                b = 3;
        }
            
            if (message.embeds[0].fields[a].value.split('\n')[b].includes(':clock4:')) {
                let time = message.embeds[0].fields[a].value.split('\n')[b].split('(**').pop().split('**)')[0];
                let dtos = 0;
                let htos = 0;
                let mtos = 0;
                let sec = 0;
                let totalSec = 10;
                if (time.includes('d')) {
                    dtos = parseFloat(time.split(' ')[0]) * 24 * 60 * 60 * 1000;
                    htos = parseFloat(time.split(' ')[1]) * 60 * 60 * 1000;
                    mtos = parseFloat(time.split(' ')[2]) * 60 * 1000;
                    sec = parseFloat(time.split(' ')[3]) * 1000;
                    totalSec = dtos + htos + mtos + sec;
                    
                    addReminder(message.author.id,`rpg ${item}`, `Time for \`RPG ${item.toUpperCase()}\` !!!`, totalSec);
                } else if (time.includes('h')) {
                    htos = parseFloat(time.split(' ')[0]) * 60 * 60 * 1000;
                    mtos = parseFloat(time.split(' ')[1]) * 60 * 1000;
                    sec = parseFloat(time.split(' ')[2]) * 1000;
                    totalSec = htos + mtos + sec;   

                    addReminder(message.author.id,`rpg ${item}`, `Time for \`RPG ${item.toUpperCase()}\` !!!`, totalSec);
                } else if (time.includes('m')) {
                    mtos = parseFloat(time.split(' ')[0]) * 60 * 1000;
                    sec = parseFloat(time.split(' ')[1]) * 1000;
                    totalSec = mtos + sec;
                    
                    addReminder(message.author.id,`rpg ${item}`, `Time for \`RPG ${item.toUpperCase()}\` !!!`, totalSec);
                }
            }
    }

    function rpgProsessReminder(data) {
        message.channel.send(`<@${data.id}>, ${data.textMessage}`);
    }

    async function addReminder(message, command, textMessage, delay) {
        await rpgReminder.removeJobs(
            {
                id: message.author.id,
                textMessage: textMessage,
                command: command
            }
        );
        rpgReminder.re(
            {
                id: message.author.id,
                textMessage: textMessage,
                command: command
            },
            {delay: delay}
        );
    }

});                                     
async function lotterySchedule(client) {
    agenda.define(`lotteryWinner`, async job => {
        job.repeatEvery('1 weeks', {
            skipImmediate: true
        });
        await lotteryWinnerRunSchedule(client);
        await job.save();
    });

    await agenda.start();
    await agenda.cancel({ name: `lotteryWinner` });
    await agenda.schedule('at 9am', `lotteryWinner`);
}

client.login(config.BOT_TOKEN);