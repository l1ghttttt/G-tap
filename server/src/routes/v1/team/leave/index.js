import {responseObject} from "../../../../utils/responseUtils.js";
import UserHelper from "../../../../helpers/UserHelper.js";
import TeamsHelper from "../../../../helpers/TeamsHelper.js";
import TeamHelper from "../../../../helpers/TeamHelper.js";

export default async (request, reply, fastify, {launchParams}) => {
    const {id} = request.body;

    const user = new UserHelper(launchParams.id, fastify);
    await user.leaveTeam(id);

    reply.send(responseObject('ok'));
}