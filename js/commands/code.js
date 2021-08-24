import Discord from "discord.js";
import queryData from "../helper/query.js";
import { limitedTimeUse } from "../helper/variable.js";
import emojiCharacter from "../utils/emojiCharacter.js";
import errorCode from "../utils/errorCode.js";
import cekCode from "./code/cekCode.js";
import dungeonKey from "./code/dungeonKey.js";
import lucky from "./code/lucky.js";
import terarpg from "./code/t3rarp9.js";

async function code(message, args) {
    let code = args[0];
    let cekCodeX = await cekCode(message.author.id, code)
    if(cekCodeX){ ``
        return message.channel.send(`${emojiCharacter.noEntry} | You have already claimed this code!!!`);
    }
    
    if (code === 'lucky') {
        lucky(message, code);
    } else if (code === 'dkey') {
        dungeonKey(message, code);
    } else if (code === 't3rarp9') {
        terarpg(message, code);
    } else {
        message.channel.send(`Invalid code!`);
    }
}

export default code;