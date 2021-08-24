
import queryData from "../../helper/query.js";
import cekMaxGold from "../../utils/cekMaxGold.js";
import embed from "./embed.js";

export default async function terarpg(message, code) {
    let rewards = `\`+50.0000\` <:Gold_Coin_placed:810758408905949194> \`gold\` \n\`+1\` <:diamond:801441006247084042> \`diamond\``
    let gold = 50000;
    message.channel.send(embed(message, rewards, code));
    queryData(`INSERT code SET player_id=${message.author.id}, code="${code}"`)

    // ADD ITEM TO BACKPACK
    gold = await cekMaxGold(message, message.author.id, gold);
    queryData(`UPDATE stat SET gold=gold+${gold}, diamond=diamond+1 WHERE player_id=${message.author.id} LIMIT 1`);
}