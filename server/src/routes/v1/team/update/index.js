import {responseObject} from "../../../../utils/responseUtils.js";
import {generateFilename, getUnixTime} from "../../../../utils/utils.js";
import fs from "fs";
import UserHelper from "../../../../helpers/UserHelper.js";
import TeamsHelper from "../../../../helpers/TeamsHelper.js";
import {checkPhoto} from "../../../../utils/fileCheck.js";
import {MAX_LENGTH_TEAM_NAME, MIN_LENGTH_TEAM_NAME, REGEX_TEAM_LINK, REGEX_TEAM_NAME} from "../config.js";
import TeamHelper from "../../../../helpers/TeamHelper.js";

export default async (request, reply, fastify, {launchParams}) => {
    const file = request.body.file ?? null;
    const teamName = request.body.teamName.value;
    const link = request.body.link.value === 'null' ? null : request.body.link.value;

    const user = new UserHelper(launchParams.id);
    const userData = await user.get();

    if (userData['teamId'] === null) {
        reply.code(400).send(responseObject('you dont have team', false));
        return;
    }

    const teamsHelper = new TeamsHelper();
    const team = await teamsHelper.get(userData['teamId']);
    if (team === null) {
        reply.code(400).send(responseObject('team not found', false));
        return;
    }

    if (team['ownerTgId'] !== launchParams.id) {
        reply.code(400).send(responseObject('no permissions', false));
        return;
    }

    if (file['file']) {
        const photoSuccess = checkPhoto(file);
        if (photoSuccess !== true) {
            reply.code(400).send(responseObject(photoSuccess));
            return;
        }

        const fullName = team['photo'];
        if (fs.existsSync(fullName)) {
            fs.unlinkSync(fullName);
        }

        const buffer = await file.toBuffer();
        fs.writeFileSync(`./src/files/${fullName}`, buffer);
    }

    const teamHelper = new TeamHelper(team['id']);

    if (teamName !== team['name']) {
        if (teamName.length < MIN_LENGTH_TEAM_NAME || teamName.length > MAX_LENGTH_TEAM_NAME) {
            reply.code(400).send(responseObject('invalid name length'));
            return;
        }

        if (!REGEX_TEAM_NAME.test(teamName)) {
            reply.code(400).send(responseObject('invalid name symbols'));
            return;
        }

        await teamHelper.set('name', teamName);
    }

    if (link && link !== team['link']) {
        if (!REGEX_TEAM_LINK.test(link)) {
            reply.code(400).send(responseObject('invalid link symbols'));
            return;
        }

        if (team['link'] === null) {
            await Promise.all([
                teamHelper.set('lastPaymentLinkTime', getUnixTime()),
            ]);
        }

        await teamHelper.set('link', link);
    }

    if (!link && link !== team['link']) {
        // удаляем ссылку
        await Promise.all([
            teamHelper.set('link', null),
            teamHelper.set('lastPaymentLinkTime', 0),
        ]);
    }

    const teamUpdated = await user.getTeam();
    reply.send(responseObject(teamUpdated));
}