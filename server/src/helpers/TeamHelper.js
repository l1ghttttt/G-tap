import DatabaseHelper from "./DatabaseHelper.js";
import {getUserInfo} from "../utils/telegram.js";
import NodeCache from "node-cache";

const cache = new NodeCache( { checkperiod: 3600, stdTTL: 3600 } );

class TeamHelper extends DatabaseHelper {

    constructor(id, fastify) {
        super();
        this.id = id;
    }

    async getUsers(limit = 5) {
        const topUsers = [];
        const [countResponse] = await Promise.all([
            this.query(
                "SELECT COUNT(*) AS `row_count` FROM `users` WHERE `teamId` = ?",
                [this.id]
            )
        ]);

        const enrichedUsers = [];
        for (const user of topUsers) {
            const userInfo = await getUserInfo(user.tgId);
            if (userInfo) {
                enrichedUsers.push({
                    tgId: user.tgId,
                    name: userInfo.name,
                    image: userInfo.photo,
                    gold: user.gold
                });
            }
        }

        return {
            count: countResponse[0]['row_count'],
            users: enrichedUsers,
        };
    }

    async get(force = false) {
        const cacheData = cache.get(`team-${this.id}`);
        if (cacheData !== undefined && !force) {
            return cacheData;
        }

        const data = await this.query(
            "SELECT * FROM `teams` WHERE `id` = ?",
            [this.id]
        );

        if (!data[0]) {
            return Promise.reject('team not found');
        }

        const teamData = data[0];
        cache.set(`team-${this.id}`, teamData);

        return teamData;
    }

    async getAllTeam() {
        const team = await this.get();

        const teamTopUsers = await this.getUsers();

        team['usersCount'] = teamTopUsers.count;
        team['topUsers'] = teamTopUsers.users;

        return team;
    }

    async set(key, value) {
        try {
            await this.query(
                "UPDATE `teams` SET `"+key+"` = ? WHERE `id` = ?",
                [value, this.id]
            );

            const cacheData = cache.get(`team-${this.id}`);
            if (cacheData !== undefined) {
                cacheData[key] = value;
                cache.set(`team-${this.id}`, cacheData);
            }
        } catch (error) {

        }
    }

    async addGold(count) {
        const data = await this.get();
        return this.set('gold', data['gold'] + Number(count));

        /*return this.query(
            'UPDATE teams SET gold = gold + ? WHERE id = ?',
            [count, this.id]
        );*/
    }

}

export default TeamHelper;