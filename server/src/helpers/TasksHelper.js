import DatabaseHelper from "./DatabaseHelper.js";
import NodeCache from "node-cache";

const cache = new NodeCache( { checkperiod: 600, stdTTL: 1800 } );

class TasksHelper extends DatabaseHelper {

    async getTasks() {
        const cacheData = cache.get(`tasks`);
        if (cacheData !== undefined) {
            return cacheData;
        }

        const response = await this.query("SELECT * FROM `tasks`");
        cache.set('tasks', response);

        return response;
    }

    async getTaskById(id) {
        const cacheData = cache.get(`task-${id}`);
        if (cacheData !== undefined) {
            return cacheData;
        }

        const result = await this.query(
            "SELECT * FROM `tasks` WHERE `id` = ?",
            [id]
        );

        cache.set(`task-${id}`, result[0] ?? null);

        return result[0] ?? null;
    }

    async updateTask(id, channelAddress, link, award, awardCrystals, title) {
        cache.del(`tasks`);
        return this.query(
            "UPDATE `tasks` SET `channel_address` = ?, `link` = ?, `award` = ?, `award_crystals` = ?, `title` = ? WHERE `id` = ?",
            [channelAddress, link, Number(award), Number(awardCrystals), title, id]
        );
    }

    async deleteTask(id) {
        cache.del(`tasks`);
        return this.query(
            "DELETE FROM `tasks` WHERE `id` = ?",
            [id]
        );
    }

    async createTask(channelAddress, link, award, awardCrystals, title) {
        cache.del(`tasks`);
        return this.query(
            "INSERT INTO `tasks`(`channel_address`, `link`, `award`, `award_crystals`, `title`) VALUES(?, ?, ?, ?, ?)",
            [channelAddress, link, Number(award), Number(awardCrystals), title]
        );
    }

    async getAdminTasks() {
        const cacheData = cache.get(`admin_tasks`);
        if (cacheData !== undefined) {
            console.log('cashing admin_tasks')
            return cacheData;
        }

        const tasks = await this.getTasks();

        cache.set('admin_tasks', tasks);
        return tasks;
    }

}

export default TasksHelper;