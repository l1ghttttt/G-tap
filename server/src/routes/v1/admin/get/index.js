import {responseObject} from "../../../../utils/responseUtils.js";
import TasksHelper from "../../../../helpers/TasksHelper.js";

export default async (request, reply, fastify, {launchParams}) => {
    const tasksHelper = new TasksHelper();

    const [
        tasks,
    ] = await Promise.all([
        tasksHelper.getTasks(),
    ]);

    reply.send(responseObject({
        tasks: {
            channels: tasks,
        },
    }));
}