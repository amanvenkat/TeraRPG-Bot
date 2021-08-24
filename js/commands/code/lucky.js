import queryData from "../../helper/query.js";
import { limitedTimeUse } from "../../helper/variable.js";
import embed from "./embed.js";

export default function lucky(message, code) {
    let rewards = `\`x1\` ${limitedTimeUse.luckyCoinEmoji} \`lucky coin\` \n\n**Usage**\n\`use lucky coin\`\n\`info lucky coin\``
    message.channel.send(embed(message, rewards, code));
    queryData(`INSERT code SET player_id=${message.author.id}, code="${code}"`)

    // ADD ITEM TO BACKPACK
    queryData(`CALL insert_item_backpack_procedure(${message.author.id}, ${limitedTimeUse.luckyCoinId}, 1)`);
}