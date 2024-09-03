import {responseObject} from "../../../../utils/responseUtils.js";
import TasksHelper from "../../../../helpers/TasksHelper.js";
import UserHelper from "../../../../helpers/UserHelper.js";

export default async (request, reply, fastify, {launchParams}) => {
    const tasksHelper = new TasksHelper();
    const allTasks = await tasksHelper.getTasks();

    const user = new UserHelper(launchParams.id, fastify);

    const [completedChannelsTasks] = await Promise.all([
        user.getCompletedTasksByCategory('social'),
    ]);

    const socialTasks = allTasks.map((task) => {
        if (completedChannelsTasks.includes(task.id)) {
            task.award = -1;
        }

        return task;
    });

    reply.send(responseObject({
        social: socialTasks,
    }));
}