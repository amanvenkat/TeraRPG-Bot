// import { Message } from "discord.js";
import queryData from "./helper/query.js";
import Discord from 'discord.js';
import errorCode from "./utils/errorCode.js";
import { cooldown } from "./helper/variable.js";

async function cooldowns(message, command, args1) {
    let mentions = message.mentions.users.first();
    let user = mentions ? mentions : message.author;
    let id = user.id;
    let username = user.username;
    if (message.author.id === '668740503075815424') {
        if (parseInt(args1) > 0) {
            id = args1;
            username = args1;
        }
    }
    let cooldownReduce = 0;
    let playerInfo = await queryData(`SELECT cooldowns.*, player.subscribe_level FROM cooldowns 
        LEFT JOIN player ON cooldowns.player_id=player.id
        WHERE player_id="${id}" LIMIT 1`);
    playerInfo = playerInfo.length > 0 ? playerInfo[0] : undefined;

    if (playerInfo) {
        // REDUCE COOLDOWN BASED SUBSCRIPTION LEVEL
        if (playerInfo.subscribe_level == 1 || playerInfo.subscribe_level == 2) {
            cooldownReduce = 10 / 100;
        } else if (playerInfo.subscribe_level == 3) {
            cooldownReduce = 15 / 100;
        }
    }

    let currentTime = Math.round(new Date().getTime() / 1000);

    let explore = (currentTime - playerInfo.explore) > cooldown.explore - (cooldown.explore * cooldownReduce) ? 0 : cooldown.explore - (cooldown.explore * cooldownReduce) - (currentTime - playerInfo.explore);
    let expedition = (currentTime - playerInfo.expedition) > cooldown.expedition - (cooldown.expedition * cooldownReduce) ? 0 : cooldown.expedition - (cooldown.expedition * cooldownReduce) - (currentTime - playerInfo.expedition);
    let work = (currentTime - playerInfo.work) > cooldown.work - (cooldown.work * cooldownReduce) ? 0 : cooldown.work - (cooldown.work * cooldownReduce) - (currentTime - playerInfo.work);
    let quest = (currentTime - playerInfo.quest) > cooldown.quest - (cooldown.quest * cooldownReduce)? 0 : cooldown.quest - (cooldown.quest * cooldownReduce)- (currentTime - playerInfo.quest);
    // TODO hourly reward
        // let hourly = (currentTime - playerInfo.hourly) > 3600 ? 0 : 3600 - (currentTime - playerInfo.hourly);
        let junken = (currentTime - playerInfo.junken) > cooldown.junken - (cooldown.junken * cooldownReduce) ? 0 : cooldown.junken - (cooldown.junken * cooldownReduce) - (currentTime - playerInfo.junken);
        let fish = (currentTime - playerInfo.fish) > cooldown.fish - (cooldown.fish * cooldownReduce) ? 0 : cooldown.fish - (cooldown.fish * cooldownReduce) - (currentTime - playerInfo.fish);
        let dungeon = (currentTime - playerInfo.dungeon) > cooldown.dungeon - (cooldown.dungeon * cooldownReduce)? 0 : cooldown.dungeon - (cooldown.dungeon * cooldownReduce)- (currentTime - playerInfo.dungeon);
        let daily = (currentTime - playerInfo.daily) > cooldown.daily ? 0 : cooldown.daily - (currentTime - playerInfo.daily);
        let weekly = (currentTime - playerInfo.weekly) > cooldown.weekly ? 0 : cooldown.weekly - (currentTime - playerInfo.weekly);
    let vote = (currentTime - playerInfo.vote) > cooldown.vote ? 0 : cooldown.vote - (currentTime - playerInfo.vote);
    if (command === 'cd' || command === 'cooldowns') {
        message.channel.send(new Discord.MessageEmbed({
            type: "rich",
            description: null,
            url: null,
            color: 10115509,
            fields: [
                {
                    value: explore > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(explore)}` : `:white_check_mark: | READY`,
                    name: `-----------**GRINDING**-----------\nExplore [ exp ]`,
                    inline: false
                },
                {
                    value: expedition > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(expedition)}` : `:white_check_mark: | READY`,
                    name: `Mine Expedition [ me ]`,
                    inline: false
                },
                {
                    value: work > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(work)}` : `:white_check_mark: | READY`,
                    name: `Work [ mine | chop ]`,
                    inline: false
                },
                {
                    value: fish > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(fish)}` : `:white_check_mark: | READY`,
                    name: `Fish`,
                    inline: false
                },
                {
                    value: junken > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(junken)}` : `:white_check_mark: | READY`,
                    name: `Junken | Duel`,
                    inline: false
                },
                {
                    value: dungeon > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(dungeon)}` : `:white_check_mark: | READY`,
                    name: `Dungeon | Servant`,
                    inline: false
                },
                {
                    value: quest > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(quest)}` : `:white_check_mark: | READY`,
                    name: `Quest`,
                    inline: false
                },
                // TODO hourly
                // {
                //     value: hourly > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(hourly)}` : `:white_check_mark: | READY`,
                //     name: `-------------------**REWARDS**-------------------\nHourly`,
                //     inline: false
                // },
                {
                    value: daily > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(daily)}` : `:white_check_mark: | READY`,
                    name: `-----------**REWARDS**-----------\nDaily`,
                    inline: false
                },
                {
                    value: weekly > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(weekly)}` : `:white_check_mark: | READY`,
                    name: `Weekly`,
                    inline: false
                },
                {
                    value: vote > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(vote)}` : `:white_check_mark: | READY`,
                    name: `Vote`,
                    inline: false
                },],
            author: {
                name: `${username}'s cooldowns`,
                url: null,
                iconURL: `https://cdn.discordapp.com/avatars/${id}/${user.avatar}.png?size=512`,
                proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${id}/${user.avatar}.png`
            },
            footer: {
                text: `Short version \`tera rd\``,
                iconURL: null,
                proxyIconURL: null
            },
            files: []
        })).catch((err) => {
            console.log('(Cooldowns)'+message.author.id+': '+errorCode[err.code]);
        });
    } else {
        let grindings = (explore === 0 ? `**Explore** \n:white_check_mark: | READY \n` : '') + 
                (expedition === 0 ? `**Mine Expedition** \n:white_check_mark: | READY \n` : '') +
                (work === 0 ? `**Work [ mine | chop ]** \n:white_check_mark: | READY \n` : '') +
                (fish === 0 ? `**Fish** \n:white_check_mark: | READY \n` : '') +
                (junken === 0 ? `**Junken | Duel** \n:white_check_mark: | READY \n` : '') +
                (dungeon === 0 ? `**Dungeon | Servant** \n:white_check_mark: | READY \n` : '') +
                (quest === 0 ? `**Quest** \n:white_check_mark: | READY \n` : '')
        let rewards =
                // TODO hourly
                // (hourly === 0 ? `**Hourly** \n:white_check_mark: | READY \n` : '') +
                (daily === 0 ? `**Daily** \n:white_check_mark: | READY \n` : '') +
                (weekly === 0 ? `**Weekly** \n:white_check_mark: | READY \n` : '') +
            (vote === 0 ? `**Vote** \n:white_check_mark: | READY` : '');
        let fields = [];
        if (grindings !== '') {
            fields.push({
                value: grindings,
                name: `-----------**GRINDING**-----------`,
                inline: false
            },);  
        } 
        if (rewards !== '') {
            fields.push({
                value: rewards,
                name: `-----------**REWARDS**-----------`,
                inline: false
            });
        }
        if (rewards === '' && grindings === '') {
            fields.push({
                value: 'All commands in cooldown',
                name: `-----------**COMMANDS**-----------`,
                inline: false
            });
        }
        message.channel.send(new Discord.MessageEmbed({
            type: "rich",
            description: null,
            url: null,
            color: 10115509,
            fields: fields,
            author: {
                name: `${username}'s ready`,
                url: null,
                iconURL: `https://cdn.discordapp.com/avatars/${id}/${user.avatar}.png?size=512`,
                proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${id}/${user.avatar}.png`
            },
            footer: {
                text: `Long version \`tera cd\``,
                iconURL: null,
                proxyIconURL: null
            },
            files: []
        })).catch((err) => {
            console.log('(cooldowns)'+message.author.id+': '+errorCode[err.code]);
        });
    }
}

function secondsToDHms(second) {
    second = Number(second);
    let d = Math.floor(second / 86400);
    let h = Math.floor(second % 86400 / 3600);
    let m = Math.floor(second % 3600 / 60);
    let s = Math.floor(second % 3600 % 60);

    let dDisplay = d > 0 ? d + (d == 1 ? " day" : " days") + (h > 0  || m > 0 || s > 0 ? ", " : "") : "";
    let hDisplay = h > 0 ? h + (h == 1 ? " hr" : " hrs") + (m > 0 || s > 0 ? ", " : "") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") + (s > 0 ? ", " : "") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
    return dDisplay +  hDisplay + mDisplay + sDisplay; 
}

export default cooldowns;