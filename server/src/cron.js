import cron from "node-cron";
import SystemHelper from "./helpers/SystemHelper.js";
import {bot} from "./bot/index.js";
import {InputFile} from "grammy";
import {getMenuInline} from "./bot/buttons.js";
import UserHelper from "./helpers/UserHelper.js";

export const startCron = (fastify) => {
    notifications(fastify);
}

export const notifications = (fastify) => {
    console.log('[cron] notifications start');

    const system = new SystemHelper();

    //cron.schedule('* * 0,4,8,12,16,20 * * *', () => {
    cron.schedule('0 0 * * * *', async () => {
        const users = await system.getUsersCanClick();

        for (const user of users) {
            try {
                await bot.api.sendMessage(
                    user['telegram_id'],
                    "Пс, пришло время проверить майнер 💵",
                    {
                        reply_markup: getMenuInline(),
                    }
                );

                const userHelper = new UserHelper(user['telegram_id']);
                await userHelper.set('click_notification', 1);
            } catch (error) {
                //console.error(error);
            }
        }
    });
}
