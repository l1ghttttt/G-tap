import DatabaseHelper from "./DatabaseHelper.js";

class MinerHelper extends DatabaseHelper {

    async getAllMiners() {
        return await this.query(
            'SELECT * FROM miners WHERE active = 1',
        );
    }

    async getMiners() {
        const defaultMiners = await this.getMinersByCategory('default');
        const specialMiners = await this.getMinersByCategory('special');

        return {
            default: defaultMiners,
            special: specialMiners,
        };
    }

    async getMinersByCategory(category) {
        return await this.query(
            'SELECT * FROM miners WHERE category = ? AND active = 1',
            [category]
        );
    }

    getMinerById(id, miners) {
        const result = miners.filter((miner) => miner.id === id);
        return result[0] ?? null;
    }

}

export default MinerHelper;