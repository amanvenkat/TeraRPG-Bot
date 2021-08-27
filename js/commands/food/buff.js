import Discord from 'discord.js';
import queryData from '../../helper/query.js';
import { secondsToDHms } from '../../utils/utils.js';

export default async function activeBuff(message) {
    
    let time = new Date();
    time = time.getTime() / 1000;
    let buff = await queryData(`SELECT expire_time, type_id, cfg_buff.emoji, cfg_buff.name
        FROM active_buff
        LEFT JOIN cfg_buff ON (active_buff.buff_id = cfg_buff.id)
        WHERE player_id=${message.author.id} LIMIT 1`);

    buff = buff.length > 0 ? buff : undefined;
    let activeBuff = '';
    if (buff) {
        buff.forEach(element => {
            let timeBuffLeft = element.expire_time - time;
            timeBuffLeft = timeBuffLeft > 0 ? timeBuffLeft : 0;
            activeBuff = `${element.emoji} **${element.name}:** ${secondsToDHms(timeBuffLeft)}\n`
        });
    }
    
    message.channel.send(new Discord.MessageEmbed({
        "type": "rich",
        "title": null,
        "url": null,
        "color": 10115509,
        "timestamp": null,
        "fields": [ {
            "value": activeBuff ? activeBuff : 'Empty',
            "name": "__ACTIVE BUFF__",
            "inline": true
        }],
        thumbnail: {
            url: 'https://cdn.discordapp.com/attachments/828836250286817280/837707234955493436/pngwing.com.png',
            proxyURL: 'https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https://cdn.discordapp.com/attachments/828836250286817280/837707234955493436/pngwing.com.png',
            height: 0,
            width: 0,
        },
        "author": {
            "name": `${message.author.username}'s buff`,
            "url": null,
            "iconURL": `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
            "proxyIconURL": `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        }
    })).catch((err) => {
        console.log('(buff)'+message.author.id+': '+errorCode[err.code]);
    });
}