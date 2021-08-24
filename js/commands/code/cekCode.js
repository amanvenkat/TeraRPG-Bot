import queryData from "../../helper/query.js";

export default async function cekCode(playerID, code) {
    let cek = await queryData(`SELECT * FROM code WHERE player_id=${playerID} AND code="${code}" LIMIT 1`);
    cek = cek.length > 0 ? cek[0] : undefined;

    return cek;
}