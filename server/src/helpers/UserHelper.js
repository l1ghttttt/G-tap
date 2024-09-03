import DatabaseHelper from "./DatabaseHelper.js";
import {getCleanJsonObject, getUnixTime} from "../utils/utils.js";
import TeamHelper from "./TeamHelper.js";
import TeamsHelper from "./TeamsHelper.js";

class UserHelper extends DatabaseHelper {

    constructor(userTgId) {
        super();
        this.userTgId = userTgId;
    }

    async register(username = null, inviterTgId = null) {
        return this.query(
            "INSERT INTO users (telegram_id, username, inviter_id, register_time) VALUES(?,?,?, ?)",
            [this.userTgId, username, inviterTgId, getUnixTime()]
        );
    }

    async isRegister() {
        const result = await this.query(
            "SELECT * FROM `users` WHERE `telegram_id` = ?",
            [this.userTgId]
        );

        return Boolean(result[0]);
    }

    async get() {
        const data = await this.query(
            "SELECT * FROM `users` WHERE `telegram_id` = ?",
            [this.userTgId]
        );

        if (!data[0]) {
            return Promise.reject('user not found');
        }

        return data[0];
    }

    async set(key, value) {
        await this.query(
            "UPDATE `users` SET `"+key+"` = ? WHERE `telegram_id` = ?",
            [value, this.userTgId]
        );
    }

    async getBalance() {
        const data = await this.get();
        return data['balance'];
    }

    async getCrystals() {
        const data = await this.get();
        return data['crystals'];
    }

    async addBalance(count) {
        const data = await this.get();
        return this.set('balance', data['balance'] + Number(count));
    }

    async addCrystals(count) {
        const data = await this.get();
        return this.set('crystals', data['crystals'] + Number(count));
    }

    async reduceCrystals(count) {
        const data = await this.get();

        if (data['crystals'] - Number(count) < 0) {
            return Promise.reject("not enough crystals")
        }

        return this.set('crystals', data['crystals'] - Number(count));
    }

    async reduceBalance(count) {
        const data = await this.get();

        if (data['balance'] - count < 0) {
            return Promise.reject('not enought balance');
        }

        return this.set('balance', data['balance'] - Number(count));
    }

    async getEarningPerTime() {
        const data = await this.get();
        return data['earnings_per_time'] * (1 + (data['miners_earnings'] / 100));
    }

    async getScore() {
        const userData = await this.get();

        const balance = userData['balance'];
        const earningsPerTime = await this.getEarningPerTime();
        const earningsDelayTime = userData['earnings_delay_time'];
        const earningsGetLastTime = userData['earnings_get_last_time'];
        const inviterId = userData['inviter_id'];
        const minersEarnings = userData['miners_earnings'];
        const crystals = userData['crystals'];

        return {
            balance,
            earningsPerTime,
            earningsDelayTime,
            earningsGetLastTime,
            inviterId,
            minersEarnings,
            crystals,
        };
    }

    /*async getFriends() {
        const friends = await this.query(
            "SELECT telegram_id, username, inviter_earnings FROM users WHERE inviter_id = ?",
            [this.userTgId]
        );

        const friendsWithCounts = await Promise.all(friends.map(async (friend) => {
            const countResult = await this.query(
                "SELECT COUNT(*) AS friend_count FROM users WHERE inviter_id = ?",
                [friend['telegram_id']]
            );

            friend.friendsCount = countResult[0]['friend_count'];
            return friend;
        }));

        return {
            list: friendsWithCounts,
            count: friends.length,
        };
    }*/

    async getFriends() {
        const query = `
            SELECT u1.telegram_id, u1.username, u1.inviter_earnings, COUNT(u2.telegram_id) AS friendsCount
            FROM users u1
            LEFT JOIN users u2 ON u2.inviter_id = u1.telegram_id
            WHERE u1.inviter_id = ?
            GROUP BY u1.telegram_id;
        `;

        const friends = await this.query(query, [this.userTgId]);

        return {
            list: friends,
            count: friends.length,
        };
    }


    async addInviterEarn(count) {
        const data = await this.get();
        return this.set('inviter_earnings', data['inviter_earnings'] + Number(count));
    }

    async getCompletedTasks() {
        const data = await this.get();
        return JSON.parse(data['completed_tasks'] ?? '{}');
    }

    async getCompletedTasksByCategory(category) {
        const tasks = await this.getCompletedTasks();
        return tasks[category] ?? [];
    }

    async taskCompleted(category, id) {
        const tasks = await this.getCompletedTasks();
        if (!tasks[category]) {
            tasks[category] = [];
        }

        tasks[category].push(id);
        return this.set('completed_tasks', JSON.stringify(tasks));
    }

    async getMiners() {
        const data = await this.get();
        return JSON.parse(data['miners'] ?? '{}');
    }

    async setMiners(miners) {
        return this.set('miners', JSON.stringify(miners));
    }

    async addMiner(id) {
        const miners = await this.getMiners();

        if (miners[id]) {
            miners[id] += 1;
        } else {
            miners[id] = 1;
        }

        return this.setMiners(miners);
    }

    async addMinerEarnings(count) {
        const data = await this.get();
        return this.set('miners_earnings', data['miners_earnings'] + Number(count));
    }

    async getTeam(userData = null) {
        const info = await this.getBriefInfoTeam(userData);

        if (info === 'no') {
            return 'no';
        }

        const teamHelper = new TeamHelper(info.id);
        const teamTopUsers = await teamHelper.getUsers(0);

        info['usersCount'] = teamTopUsers.count;
        info['topUsers'] = teamTopUsers.users;
        info['id'] = info['id'];

        return info;
    }

    async getBriefInfoTeam(data = null) {
        if (data === null) {
            data = await this.get();
        }

        const teamId = data['teamId'];

        if (teamId === null) {
            return 'no';
        }

        const teamsHelper = new TeamsHelper();
        const team = await teamsHelper.get(teamId);

        if (!team) {
            await this.set('teamId', null);
            return 'no';
        }

        return {
            id: team['id'],
            name: team['name'],
            image: team['photo'],
            link: team['link'],
            gold: team['gold'],
            role: this.userTgId === team['ownerTgId'] ? 'admin' : 'member',
        };
    }

    async setTeamId(id) {
        return this.set('teamId', id);
    }

    async getTeamId() {
        const data = await this.get();
        return data['teamId'];
    }

    async joinTeam(teamId) {
        const teamsHelper = new TeamsHelper();
        const team = await teamsHelper.get(teamId);

        if (team === null) {
            return Promise.reject('team not found');
        }

        return this.setTeamId(teamId);
    }

    async leaveTeam(teamId) {
        const teamsHelper = new TeamsHelper();
        const team = await teamsHelper.get(teamId);

        if (team === null) {
            return Promise.reject('team not found');
        }

        return this.setTeamId(null);
    }

}

export default UserHelper;