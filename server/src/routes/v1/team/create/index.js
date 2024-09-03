import {responseObject} from "../../../../utils/responseUtils.js";
import {generateFilename} from "../../../../utils/utils.js";
import fs from "fs";
import UserHelper from "../../../../helpers/UserHelper.js";
import TeamsHelper from "../../../../helpers/TeamsHelper.js";
import {checkPhoto} from "../../../../utils/fileCheck.js";
import {MAX_LENGTH_TEAM_NAME, MIN_LENGTH_TEAM_NAME, REGEX_TEAM_LINK, REGEX_TEAM_NAME} from "../config.js";

export default async (request, reply, fastify, {launchParams}) => {
    const body = request.body;

    const file = body.file;
    const teamName = body.teamName.value;
    const link = body.link.value === 'null' ? null : body.link.value;

    const user = new UserHelper(launchParams.id);
    const userData = await user.get();

    if (userData['teamId'] !== null) {
        reply.code(400).send(responseObject('you have team', false));
        return;
    }

    let photoName = null;
    if (file['file']) {
        const photoSuccess = checkPhoto(file);
        if (photoSuccess !== true) {
            reply.code(400).send(responseObject(photoSuccess));
            return;
        }

        const { fullName } = generateFilename(file['filename']);
        photoName = fullName;

        const buffer = await file.toBuffer();
        fs.writeFileSync(`./src/files/${fullName}`, buffer);
    }

    if (teamName.length < MIN_LENGTH_TEAM_NAME || teamName.length > MAX_LENGTH_TEAM_NAME) {
        reply.code(400).send(responseObject('invalid name length'));
        return;
    }

    if (!REGEX_TEAM_NAME.test(teamName)) {
        reply.code(400).send(responseObject('invalid name symbols'));
        return;
    }

    if (link) {
        if (!REGEX_TEAM_LINK.test(link)) {
            reply.code(400).send(responseObject('invalid link symbols'));
            return;
        }
    }

    const teams = new TeamsHelper;
    const response = await teams.create(teamName, launchParams.id, photoName, link ?? null);

    await user.setTeamId(response.insertId);
    const team = await user.getTeam();

    reply.send(responseObject(team));
}