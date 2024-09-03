import UserHelper from "../../../helpers/UserHelper.js";
import fastify from "../../../index.js";
import {getBotLanguage} from "../../utils/botUtils.js";

async function checkRegister(ctx, next) {
    try {
        if (!ctx.from || !ctx.from.id) {
            await next();
            return;
        }

        let ref = null;
        if (ctx.message && ctx.message.text) {
            ref = ctx.message.text
                .replace('/start ', '')
                .replace('/start', '');
        }

        const user = new UserHelper(ctx.from.id, fastify);
        const isRegister = await user.isRegister();

        if (!isRegister) {
            if (ref && ref.length <= 30) {
                const referralRegex = /^r_\d+$/
                if (referralRegex.test(ref)) {
                    // referral
                    let invitedId = Number(ref.replace('r_', ''));

                    // это тот, кто пригласил
                    const invitedUser = new UserHelper(invitedId, fastify);
                    const inviterIsReg = await invitedUser.isRegister();

                    if (!inviterIsReg || invitedId === ctx.from.id) {
                        invitedId = null;
                    }

                    try {
                        await user.register(ctx.from.username ?? null, invitedId);
                    } catch (error) {

                    }

                    if (inviterIsReg) {
                        await invitedUser.addCrystals(1);
                    }

                    await next();
                    return;
                }
            }

            await user.register(ctx.from.username ?? null, null);
            await next();

            return;
        }

        await next();

        // todo
        //await user.activity();
    } catch (error) {
        await next();
        console.error(error);
    }
}

export default checkRegister;