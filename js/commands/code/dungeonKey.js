import queryData from "../../helper/query.js";
import cekCode from "./cekCode.js";
import embed from "./embed.js";

export default
    function dungeonKey(message, code) {
        let rewards = `\`x5\` <:dungeon_key:877776627432554506> \`dungeon key\``
        message.channel.send(embed(message, rewards, code));
        queryData(`INSERT code SET player_id=${message.author.id}, code="${code}"`)

        // ADD ITEM TO BACKPACK
        queryData(`CALL insert_item_backpack_procedure(${message.author.id}, 348, 5)`);
}