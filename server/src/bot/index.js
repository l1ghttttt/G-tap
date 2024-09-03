import {Bot, InlineKeyboard, session} from "grammy";
import {autoRetry} from "@grammyjs/auto-retry";
import {run, sequentialize} from "@grammyjs/runner";
import menu from "./handlers/menu/index.js";
import {DEV} from "../config.js";
import checkRegister from "./middleware/checkRegister/index.js";
import errorHandler from "./error/errorHandler/index.js";
import {conversations, createConversation} from "@grammyjs/conversations";
import dotenv from "dotenv";

dotenv.config()

function getSessionKey(ctx) {
    return ctx.chat?.id.toString();
}

export const bot = new Bot(DEV ? process.env.BOT_ACCESS_TOKEN_TEST : process.env.BOT_ACCESS_TOKEN);

export const startBot = (fastify) => {
    bot.catch(errorHandler);

    bot.use(sequentialize(getSessionKey));
    bot.use(session({
        initial: () => ({
            writeMode: null,
            payout: null,
            task: null,
        }),
        getSessionKey
    }));

    bot.use(conversations());

    bot.api.config.use(autoRetry());

    bot.use(checkRegister);


    try {
        bot.use(menu);
    } catch (err) {
        //console.error(err)
    }

    const runner = run(bot, {
        /*source: {
            speedTrafficBalance: 0.2, // default: 0.0
            maxDelayMilliseconds: 400, // default 500 ms
        },
        sink: {
            concurrency: 5000, // default 500
        },*/
    });

    runner.task().then(() => {
        console.log("Bot done processing!");
    });

    const stopRunner = () => runner.isRunning() && runner.stop();
    process.once("SIGINT", () => stopRunner);
    process.once("SIGTERM", () => stopRunner);
}
