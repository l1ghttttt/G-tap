import {responseObject} from "../../../../../utils/responseUtils.js";
import UserHelper from "../../../../../helpers/UserHelper.js";
import {getUnixTime} from "../../../../../utils/utils.js";

export default async (request, reply, fastify, {launchParams}) => {
    const user = new UserHelper(launchParams.id, fastify);

    const score = await user.getScore();

    if (score.earningsGetLastTime === null) {
        return reply.send(responseObject('no', false));
    }

    if (score.earningsGetLastTime + score.earningsDelayTime > getUnixTime()) {
        return reply.send(responseObject('no 1', false));
    }

    const addBalance = score.earningsPerTime;

    await Promise.all([
        user.set('earnings_get_last_time', null),
        user.addBalance(addBalance),
    ]);

    if (score.inviterId !== null) {
        const inviter = new UserHelper(score.inviterId, fastify);
        const inviterScore = await inviter.getScore();
        const earn = addBalance * 0.05;

        await Promise.all([
            inviter.addBalance(earn),
            user.addInviterEarn(earn),
        ]);

        if (inviterScore.inviterId !== null) {
            const inviter1 = new UserHelper(inviterScore.inviterId, fastify);
            const earn1 = addBalance * 0.01;

            await Promise.all([
                inviter1.addBalance(earn1),
                inviter.addInviterEarn(earn1),
            ]);
        }
    }

    reply.send(responseObject({
        earning: addBalance,
    }));
}