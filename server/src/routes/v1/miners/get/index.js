import {responseObject} from "../../../../utils/responseUtils.js";
import UserHelper from "../../../../helpers/UserHelper.js";
import MinerHelper from "../../../../helpers/MinerHelper.js";
import {increaseByPercentage} from "../../../../utils/utils.js";
import {MINER_6_FRIENDS} from "../miners.js";

export default async (request, reply, fastify, {launchParams}) => {
    const minerHelper = new MinerHelper();
    const miners = await minerHelper.getMiners();

    const user = new UserHelper(launchParams.id, fastify);
    const userMiners = await user.getMiners();

    const userData = await user.get();
    const defaultEarningsPerTime = userData['earnings_per_time'];

    const friends = await user.getFriends();

    Object.keys(miners).forEach((category) => {
        miners[category] = miners[category].map((miner) => {
            const currentLevel = userMiners[miner.id] ?? 0;

            let nextLevel = currentLevel + 1;
            if (nextLevel > miner['max_level']) {
                nextLevel = -1;
            }

            const nextCost = increaseByPercentage(miner['level_start_cost'], miner['level_increase_cost'], currentLevel);
            const nextEarnings = increaseByPercentage(miner['level_start_earnings'], miner['level_increase_earnings'], currentLevel);

            const result = {
                currentLevel,
                nextLevel,
                nextCost,
                nextEarnings,
                id: miner.id,
                image: miner.image,
                nextEarningsCoins: Math.floor(defaultEarningsPerTime * (nextEarnings / 100))
            };

            if (miner.id === 6 && category === 'special') {
                if (nextLevel !== -1) {
                    const minerData = MINER_6_FRIENDS[nextLevel]

                    result.nextEarnings = minerData.percent;
                    result.nextFriends = minerData.friends;
                    result.currentFriends = friends.count;
                }
            }

            return result;
        });
    });

    reply.send(responseObject({
        ...miners,
    }));
}