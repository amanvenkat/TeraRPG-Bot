import queryData from "../../helper/query.js";
import randomNumber from "../../helper/randomNumberWithMinMax.js";
import { formatDate } from "../utils.js";
import Discord from "discord.js";
import { activeCommand, deactiveCommand } from "../../helper/setActiveCommand.js";

export default async function botDetection(message, validate) {
    let date = new Date();
    date = formatDate(date);

    // let hit = await SELECT(``)
    let chances = randomNumber(1, 700)
    if (chances == 2 || validate) {
        let captcha = await queryData(`SELECT * FROM captcha WHERE link<>''`);
        if (captcha.length > 0) {
            let randomCaptcha = randomNumber(0, captcha.length - 1);
            captcha = captcha[randomCaptcha];
            // console.log(captcha);
            let image = new Discord.MessageEmbed({
                image: {
                    url: captcha.link
                }
            })
            return await message.channel.send(`‼️ **GUARD** : ${message.author} type this captcha to continue!`, image)
                .then(async (msg) => {
                    activeCommand([message.author.id]);
                    const filter = m => m.author.id === message.author.id;
                    return await message.channel.awaitMessages(filter,{
                        max: 1,
                        time: 40000,
                        errors: ['time']
                    }).then(async (msg2) => {
                        msg2 = msg2.first();
                        if (msg2.content.toLowerCase() == captcha.value) {
                            deactiveCommand([message.author.id]);
                            // console.log('1')
                            let potions = 3;
                            message.channel.send(`✅ **GUARD** : **${message.author.username}**, You're verified, here some tip for you +${potions} <:Healing_Potion:810747622859735100> Healing Potion!\n----------------------------------------------------------------`)
                            queryData(`CALL insert_item_backpack_procedure(${message.author.id}, 266, ${potions})`);
                            if (validate) {
                                queryData(`UPDATE jail SET released=1 WHERE player_id=${message.author.id} LIMIT 1`);    
                            }
                            
                            return true;
                        } else {
                            deactiveCommand([message.author.id]);
                            message.channel.send(`🛑 **GUARD** : **${message.author.username}**, You can't verified your self! ${!validate ? `\n**${message.author.username}** is now in the jail` : ''}`)
                            queryData(`INSERT INTO jail SET time=1, released=0, player_id=${message.author.id} ON DUPLICATE KEY UPDATE time= time + 1, released=0`);
                            // console('2').log
                            return false;
                        }
                    }).catch((err) => {
                        deactiveCommand([message.author.id]);
                        message.channel.send(`🛑 **GUARD** : **${message.author.username}**, You can't verified your self!\n**${message.author.username}** is now in the jail`)
                        queryData(`INSERT INTO jail SET time=1, released=0, player_id=${message.author.id} ON DUPLICATE KEY UPDATE time= time + 1, released=0`);
                        // console.log('2')
                        return false;
                    }) 
                })
        }
    }
    // console.log('3')
    return true;
}