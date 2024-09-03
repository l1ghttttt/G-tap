import SystemHelper from "../../../../helpers/SystemHelper.js";
import {responseObject} from "../../../../utils/responseUtils.js";
import TasksHelper from "../../../../helpers/TasksHelper.js";

export default async (request, reply, fastify, {launchParams}) => {
    const {award, awardCrystals, channelAddress, link, id, title} = request.body;

    if (award < 0) {
        return reply.send(responseObject('invalid award', false))
    }

    if (awardCrystals < 0) {
        return reply.send(responseObject('invalid award', false))
    }

    if (title.length < 1) {
        return reply.send(responseObject('invalid title', false))
    }

    if (!channelAddress && !link) {
        return reply.send(responseObject('invalid params', false))
    }

    if (channelAddress) {
        if (channelAddress.length < 2 || channelAddress.length > 150) {
            return reply.send(responseObject('invalid channelAddress', false))
        }
    }

    const tasksHelper = new TasksHelper();

    if (id) {
        // update
        await tasksHelper.updateTask(id, channelAddress ?? null, link ?? null, award, awardCrystals, title);
        reply.send(responseObject('ok'));

        return;
    }

    // create
    await tasksHelper.createTask(channelAddress ?? null, link ?? null, award, awardCrystals, title);

    reply.send(responseObject('ok'));
}