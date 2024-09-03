import {checkHash, getUnixTime, splitLaunchParams} from "./utils.js";
import {responseObject} from "./responseUtils.js";
import {DEV} from "../config.js";
import UserHelper from "../helpers/UserHelper.js";

export const getLaunchParams = (rawParams) => {
    const searchParams = new URLSearchParams(rawParams);

    let user = '';
    searchParams.forEach((value, key) => {
        if (key === 'user') {
            user = value;
        }
    })

    try {
        return JSON.parse(user);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getLaunchParamsByRequest = (request) => {
    const rawParams = request.headers['launch-params'];
    return getLaunchParams(rawParams);
}

export const authorize = async (request, reply, done, fastify) => {
    if ([
        '/v1/telegramFile/:fileId',
        '/v1/file/:filename',
    ].includes(request.routeOptions.config.url)) {
        done();
        return;
    }

    if (!request.headers['launch-params']) {
        reply.code(401).send(responseObject("invalid launch params", false));
        done();
        return;
    }

    try {
        const rawParams = request.headers['launch-params'];

        // todo
        if (!checkHash(rawParams, DEV ? process.env.BOT_ACCESS_TOKEN_TEST : process.env.BOT_ACCESS_TOKEN)) {
            reply.code(401).send(responseObject("invalid signature", false));
            done();
            return;
        }

        const launchParams = getLaunchParamsByRequest(request);

        const user = new UserHelper(launchParams.id, fastify);
        const isRegister = await user.isRegister();
        if (!isRegister) {
            await user.register(launchParams.username ?? null, null); // todo
        }
    } catch (error) {
        console.error(error);
        reply.code(401).send(responseObject('auth error', false));
    }

    done();
}

export const socketAuth = async (params, userId, fastify) => {
    if (!checkHash(params, DEV ? process.env.BOT_ACCESS_TOKEN_TEST : process.env.BOT_ACCESS_TOKEN)) {
        return "invalid signature";
    }

    const launchParams = getLaunchParams(params);

    if (userId !== launchParams['id']) {
        return "invalid id";
    }

    // todo
    /*if (getUnixTime() - Number(params['vk_ts']) > (3600 * 24)) {
        return "old signature";
    }*/

    const user = new UserHelper(launchParams.id, fastify);
    const isRegister = await user.isRegister();
    if (!isRegister) {
        //await user.register(null, 'ru'); // todo
        return "no register";
    }

    return true;
}