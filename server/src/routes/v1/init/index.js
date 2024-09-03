import UserHelper from "../../../helpers/UserHelper.js";
import {responseObject} from "../../../utils/responseUtils.js";
import SystemHelper from "../../../helpers/SystemHelper.js";
import {getUserInfo} from "../../../utils/telegram.js";

export default async (request, reply, fastify, {launchParams}) => {
    const user = new UserHelper(launchParams.id);
    const app = new SystemHelper;

    const [userData, userInfo, team] = await Promise.all([
        user.getScore(),
        getUserInfo(launchParams.id),
        user.getTeam()
    ]);

    reply.send(responseObject({
        team,
        user: {
            ...userData,
            photo: userInfo?.photo ?? null,
        },
        app: {
            telegramChannel: {
                address: '@gtap_group',
                link: 'https://t.me/gtap_group',
            },
        },
    }));
}