import DatabaseHelper from "./DatabaseHelper.js";
import {getUnixTime} from "../utils/utils.js";
import NodeCache from "node-cache";

const cache = new NodeCache( { checkperiod: 600, stdTTL: 3600 } );

class TeamsHelper extends DatabaseHelper {

    async create(name, ownerTgId, photo = null, link = null) {
        return this.query(
            "INSERT INTO `teams`(`name`, `photo`, `ownerTgId`, `createdTime`, `link`) VALUES(?,?,?,?,?)",
            [name, photo, ownerTgId, getUnixTime(), link]
        )
    }

    async get(teamId) {
        const cacheData = cache.get(`team_${teamId}`);
        if (cacheData !== undefined) {
            return cacheData;
        }

        const result = await this.query(
            "SELECT * FROM `teams` WHERE `id` = ?",
            [teamId]
        );

        const team = result[0] ?? null;
        cache.set(`team_${teamId}`, team);

        return team;
    }

    async getAll() {
        const cacheData = cache.get(`teams`);
        if (cacheData !== undefined) {
            return cacheData;
        }

        const result = await this.query(
            "SELECT * FROM `teams` ORDER BY `gold` DESC LIMIT 50"
        );

        cache.set(`teams`, result);

        return result;
    }

}

export default TeamsHelper;