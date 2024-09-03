import {responseObject} from "../../../../utils/responseUtils.js";
import UserHelper from "../../../../helpers/UserHelper.js";
import TeamHelper from "../../../../helpers/TeamHelper.js";
import {checkChannelSubscribe} from "../../../../utils/telegram.js";

export default async (request, reply, fastify, {launchParams}) => {
    const {id} = request.body;

    const teamHelper = new TeamHelper(id);
    const team = await teamHelper.get();

    const channel = '@' + team.link.replace('https://t.me/');
    const subscribe = await checkChannelSubscribe(launchParams.id, channel);

    if (!subscribe) {
        return reply.send(responseObject('did not join'));
    }

    const user = new UserHelper(launchParams.id);

    await Promise.all([
        user.joinTeam(id),
        user.addBalance(4),
        user.addBalance(100000),
    ]);

    reply.send(responseObject('ok'));
}