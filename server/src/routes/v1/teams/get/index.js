import {responseObject} from "../../../../utils/responseUtils.js";
import UserHelper from "../../../../helpers/UserHelper.js";
import TeamsHelper from "../../../../helpers/TeamsHelper.js";

export default async (request, reply, fastify, {launchParams}) => {
    const user = new UserHelper(launchParams.id, fastify);

    const teamsHelper = new TeamsHelper();
    let teams = await teamsHelper.getAll();

    teams = teams.map((team) => ({
        id: team.id,
        name: team.name,
        photo: team.photo,
        gold: team.gold,
    }));

    reply.send(responseObject(teams));
}