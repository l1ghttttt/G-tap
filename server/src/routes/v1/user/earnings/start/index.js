import {responseObject} from "../../../../../utils/responseUtils.js";
import UserHelper from "../../../../../helpers/UserHelper.js";
import {getUnixTime} from "../../../../../utils/utils.js";

export default async (request, reply, fastify, {launchParams}) => {
    const user = new UserHelper(launchParams.id, fastify);

    const score = await user.getScore();

    if (score.earningsGetLastTime !== null) {
        return reply.send(responseObject('no 1', false));
    }

    const time = getUnixTime();

    await Promise.all([
        user.set('earnings_get_last_time', time),
        user.set('click_notification', 0),
    ]);

    reply.send(responseObject({
        earningsGetLastTime: time,
    }));
}