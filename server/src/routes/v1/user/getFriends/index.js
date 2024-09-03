import {responseObject} from "../../../../utils/responseUtils.js";
import UserHelper from "../../../../helpers/UserHelper.js";
import {getUnixTime} from "../../../../utils/utils.js";

export default async (request, reply, fastify, {launchParams}) => {
    const user = new UserHelper(launchParams.id, fastify);
    const friends = await user.getFriends();

    const totalEarnings = friends.list.reduce((accumulator, user) => accumulator + user['inviter_earnings'], 0);

    reply.send(responseObject({
        friends,
        totalEarnings,
    }));
}