import {responseObject} from "../../../../utils/responseUtils.js";
import UserHelper from "../../../../helpers/UserHelper.js";
import TeamsHelper from "../../../../helpers/TeamsHelper.js";
import TeamHelper from "../../../../helpers/TeamHelper.js";

export default async (request, reply, fastify, {launchParams}) => {
    const {id} = request.body;

    const user = new UserHelper(launchParams.id);

    const teamHelper = new TeamHelper(id);
    let team = await teamHelper.getAllTeam();

    let role = 'guest';
    if (team['ownerTgId'] === launchParams.id) {
        role = 'owner';
    } else {
        const myTeamId = await user.getTeamId();
        if (myTeamId === team.id) {
            role = 'member';
        }
    }

    reply.send(responseObject({
        id: team.id,
        gold: team.gold,
        link: team.link,
        name: team.name,
        image: team.photo,
        usersCount: team.usersCount,
        topUsers: team.topUsers,
        role: role,
    }));
}