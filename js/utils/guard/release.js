import queryData from "../../helper/query.js";
import botDetection from "./botDetection.js";

export default async function release(message){
    let jail = await queryData(`SELECT *
        FROM jail
            WHERE released="0" AND player_id=${message.author.id} LIMIT 1`);
    jail = jail.length > 0 ? jail[0] : false;
    if (jail) {
        return botDetection(message, true);
    } else {
        return message.channel.send(`You are not in the jail, **${message.author.username}**.`);
    }
}