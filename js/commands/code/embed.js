import Discord from "discord.js";
import errorCode from "../../utils/errorCode.js";
export default function embed(message, rewards, code) {
    let embed = new Discord.MessageEmbed({
        type: "rich",
        // description: `\`${code}\``,
        url: null,
        color: 10115879,
        fields: [{
            name: '🎁 Claimed rewards!',
            value: rewards,
            inline: false,
        }],
        author: {
            name: `${message.author.username}'s Code ${code}`,
            url: null,
            iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
            proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        },
        files: [],
        footer: {
            text: `Find more rewards on \`tera daily/weekly/vote\``,
            iconURL: null,
            proxyIconURL: null
        },
    }).catch((err) => {
        console.log('(code)' + message.author.id + ': ' + errorCode[err.code]);
    });

    return embed;
}
