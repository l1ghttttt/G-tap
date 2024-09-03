import serverStart from "./server.js";
import Fastify from "fastify";
import formbody from "@fastify/formbody";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import multipart from "@fastify/multipart";
import {startBot} from "./bot/index.js";
import UnderPressure from '@fastify/under-pressure'
import getConnection from "./mysql.js";
import {startCron} from "./cron.js";

dotenv.config();

await getConnection();

const fastify = Fastify({
    logger: {
        level: 'error',
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },

    connectionTimeout: 50000,
    requestTimeout: 50000,

    ignoreTrailingSlash: true,
    ignoreDuplicateSlashes: true,
    caseSensitive: false,
});

await fastify.register(import('fastify-raw-body'), {
    field: "rawBody", // change the default request.rawBody property name
    global: false, // add the rawBody to every request. **Default true**
    encoding: "utf8", // set it to false to set rawBody as a Buffer **Default utf8**
    runFirst: true, // get the body before any preParsing hook change/uncompress it. **Default false**
    routes: [], // array of routes, **`global`** will be ignored, wildcard routes not supported
});

fastify.register(formbody);
fastify.register(cors, () => ((req, callback) => callback(null, { origin: true })));

fastify.register(multipart, {
    attachFieldsToBody: true,
    limits: {
        fieldNameSize: 100,
        fieldSize: 100,
        fields: 10,
        fileSize: 50e6,
        files: 1,
        headerPairs: 2000,
        parts: 1000,
    }
});

fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
        //logger.error(error)
        console.error(error);
        reply.status(500).send({ ok: false });

        return;
    }

    reply.code(Number(error.code) || 500).send(error);
});

await serverStart(fastify);
startBot(fastify);
startCron(fastify);

export default fastify;