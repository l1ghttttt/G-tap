import {responseObject} from "../../../../utils/responseUtils.js";
import MinerHelper from "../../../../helpers/MinerHelper.js";
import UserHelper from "../../../../helpers/UserHelper.js";
import {increaseByPercentage} from "../../../../utils/utils.js";
import {MINER_6_FRIENDS} from "../miners.js";

export default async (request, reply, fastify, {launchParams}) => {
    const {id} = request.body;

    const minerHelper = new MinerHelper();
    const user = new UserHelper(launchParams.id);

    const miners = await minerHelper.getAllMiners();
    const miner = minerHelper.getMinerById(id, miners);

    if (miner === null) {
        return reply.send(responseObject('404 miner id', false));
    }

    const userMiners = await user.getMiners();

    const currentLevel = userMiners[miner.id] ?? 0;
    let nextLevel = currentLevel + 1;

    if (nextLevel > miner['max_level']) {
        return reply.send(responseObject('max level', false));
    }

    const nextCost = increaseByPercentage(miner['level_start_cost'], miner['level_increase_cost'], currentLevel);
    const nextEarnings = increaseByPercentage(miner['level_start_earnings'], miner['level_increase_earnings'], currentLevel);

    switch (miner.category) {
        case 'default': {
            const balance = await user.getBalance();
            if (balance < nextCost) {
                return reply.send(responseObject('not enough gold', false));
            }

            await user.reduceBalance(nextCost);

            break;
        }

        case 'special': {
            if (id === 6) {
                const friends = await user.getFriends();

                const miner = MINER_6_FRIENDS[nextLevel];

                if (miner.friends < friends) {
                    return reply.send(responseObject('not enough friends', false));
                }

                break;
            }

            const balance = await user.getCrystals();
            if (balance < nextCost) {
                return reply.send(responseObject('not enough getCrystals', false));
            }

            await user.reduceCrystals(nextCost);

            break;
        }
    }

    await Promise.all([
        user.addMinerEarnings(nextEarnings),
        user.addMiner(id),
    ]);

    reply.send(responseObject("ok"));
}