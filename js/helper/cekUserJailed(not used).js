// CEK USER JAILED
async function cekUserJailed(){
    let isJailed = await queryData(`SELECT * FROM jail WHERE player_id=${message.author.id} AND released=0 LIMIT 1`);
    isJailed = isJailed.length > 0 ? isJailed[0] : false;
    if (isJailed) {
            return message.reply(`you cannot team up with jailed player`);
        }
}

export default cekUserJailed();