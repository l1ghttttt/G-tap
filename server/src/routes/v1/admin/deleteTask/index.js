import {responseObject} from "../../../../utils/responseUtils.js";
import TasksHelper from "../../../../helpers/TasksHelper.js";

export default async (request, reply, fastify, {launchParams}) => {
    const {id} = request.body;

    const tasksHelper = new TasksHelper();
    await tasksHelper.deleteTask(id);

    reply.send(responseObject('ok'));
}