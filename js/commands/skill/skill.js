
import Discord from 'discord.js'
import queryData from '../../helper/query.js';
import errorCode from '../../utils/errorCode.js';
import { getCookingSkillMaxExperience } from '../../utils/utils.js';
import generateHPEmoji from '../../helper/emojiGenerate.js';

async function skills(message, args1) {
    let avatar = message.author.avatar;
    let id = message.author.id;
    let username = message.author.username;
    
    let idMention = message.mentions.users.first();
    let tag = message.author.tag
    if (idMention) {
        id = idMention.id;
        avatar = idMention.avatar;
        tag = idMention.tag;
        username = idMention.username;
    }
    if (message.author.id === '668740503075815424') {
        if (parseInt(args1) > 0) {
            id = args1;
            username = args1;
        }
    }
    let skills = await queryData(`SELECT * FROM skill WHERE player_id =${id} LIMIT 1`);
    skills = skills.length > 0 ? skills[0] : undefined;

    let cookingCurrentExperience = 0;
    let cookingCurrentLevel = 1;
    let craftingCurrentLevel = 1;
    let craftingCurrentExperience = 0;
    if (skills) {
        cookingCurrentExperience = skills.cooking_experience;
        cookingCurrentLevel = skills.cooking_level;
        craftingCurrentExperience = skills.crafting_experience;
        craftingCurrentLevel = skills.crafting_level;
    }

    let cookingMaxExp = getCookingSkillMaxExperience(cookingCurrentLevel);
    let craftingMaxExp = getCookingSkillMaxExperience(craftingCurrentLevel);

        message.channel.send(new Discord.MessageEmbed({
                "type": "rich",
                "title": null,
                "description": null,
                "url": null,
                "color": 10115509,
                "timestamp": null,
                "fields":
                [
                    {
                        "value": `\`Level: ${cookingCurrentLevel}\`\n\`Experience: ${cookingCurrentExperience}/${cookingMaxExp}\`\n${generateHPEmoji(cookingCurrentExperience, cookingMaxExp, true)}`,
                        "name": `<:Cooking_Pot:837562146341519361> Cooking Skills`,
                        "inline": false
                    },
                ],
                "thumbnail": null,
                "image": null,
                "video": null,
                "author": {
                    "name": `${username}'s Skills`,
                    "url": null,
                    "iconURL": `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=512`,
                    "proxyIconURL": `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${id}/${avatar}.png`
                },
                "provider": null,
                "footer": null,
                "files": []
        })).catch((err) => {
            console.log('(skills)' + message.author.id + ': ' + errorCode[err.code]);
        });
    
}

export default skills;