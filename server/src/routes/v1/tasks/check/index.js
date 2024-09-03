import {responseObject} from "../../../../utils/responseUtils.js";
import TasksHelper from "../../../../helpers/TasksHelper.js";
import UserHelper from "../../../../helpers/UserHelper.js";
import {checkChannelSubscribe} from "../../../../utils/telegram.js";

export default async (request, reply, fastify, {launchParams}) => {
    const id = request.body.id;

    const tasksHelper = new TasksHelper();
    const task = await tasksHelper.getTaskById(id);

    if (task === null) {
        reply.code(400).send(responseObject('task not found', false));
        return;
    }

    const user = new UserHelper(launchParams.id);
    const completedChannelsTasks = await user.getCompletedTasksByCategory('social');

    if (completedChannelsTasks.includes(id)) {
        reply.code(400).send(responseObject('this task completed', false));
        return;
    }

    if (task['channel_address']) {
        const isChannelMember = await checkChannelSubscribe(launchParams.id, task['channel_address']);
        if (!isChannelMember) {
            reply.send(responseObject('not subscribed'));
            return;
        }
    }

    if (task['award']) {
        await user.addBalance(task['award']);
    }

    if (task['award_crystals']) {
        await user.addCrystals(task['award_crystals']);
    }

    await Promise.all([
        user.taskCompleted('social', id),
    ]);

    reply.send(responseObject('ok'));
}