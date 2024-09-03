import routeV1 from "./routes/v1/index.js";
import {authorize} from "./utils/authorize.js";
import {DEV} from "./config.js";

const serverStart = async (fastify) => {

    fastify.register(routeV1, {prefix: '/v1'});

    fastify.addSchema({
        $id: 'headersSchema',
        type: 'object',
        required: ['launch-params'],
        properties: {
            "launch-params": { type: 'string' }
        }
    })

    fastify.addHook('preHandler', (request, reply, done) => {
        authorize(request, reply, done, fastify)
    });

    await fastify.listen({
        port: DEV ? 3000 : 3138,
        host: "localhost",
    }, (error, address) => {
        if (error) {
            console.log(error);
            process.exit(1);
            return;
        }

        //socket(fastify);
        console.log(`server listening on ${address}`);
    })

}

export default serverStart;