import {responseObject} from "../../../utils/responseUtils.js";
import fs from "fs";
import {getFileUrlById} from "../../../utils/telegram.js";
import fetch from "node-fetch";

export default async (request, reply) => {
    const { fileId } = request.params;

    if (!fileId || typeof fileId !== 'string') {
        return reply.send(responseObject('invalid id', false));
    }

    try {
        const fileUrl = await getFileUrlById(fileId);
        const response = await fetch(fileUrl);
        const buffer = Buffer.from(await response.arrayBuffer());

        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Content-Type", "image/jpeg; image/png;");

        return reply.send(buffer);
    } catch (error) {
        //console.error(error)
        return reply.send(responseObject('file error', false));
    }
}