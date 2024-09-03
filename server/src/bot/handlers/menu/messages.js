import {getAdminInline, getMenuInline} from "../../buttons.js";
import SystemHelper from "../../../helpers/SystemHelper.js";
import fastify from "../../../index.js";
import {InputFile} from "grammy";
import UserHelper from "../../../helpers/UserHelper.js";

export const sendStartMessage = async (ctx, editOld = false) => {
    ctx.session.writeMode = null;
    ctx.session.payout = null;
    ctx.session.task = null;

    const text = "Как играть в G-TAP? 😌\n" +
        "  \n" +
        "\n" +
        "💰\n" +
        "Запускай майнер каждые 12 часов и собирай монеты \n" +
        "\n" +
        "⛏\n" +
        "Прокачивай бустеры, которые дадут возможность увеличения дохода.\n" +
        "\n" +
        "💎\n" +
        "Алмазы даются за выполненные заданий и приглашение друзей. Они дают возможность покупать и улучшать специальные бустеры\n" +
        "\n" +
        "👥\n" +
        "Приглашай своих друзей, и получай алмазы и пассивный доход с 2 линий ( друзья и друзья друзей )\n" +
        "\n" +
        "🎟️\n" +
        "По итогам каждого периода будет доступен магазин ценных товаров, где можно будет купить билеты на розыгрыш различных призов за накопленные монеты. Чем больше билетов - тем больше шанс выигрыша \n" +
        "\n" +
        "🪙 \n" +
        "По итогам сезона будет выпущен токен, который будет распределен между игроками. \n" +
        "Подробная информация появится в  канале сообщества.\n" +
        "____\n" +
        "\n" +
        "Pre Market:\n" +
        "💰 10M GCoin ≈ 33$\n" +
        "🎫 1 Ticket ≈ 6M GCoin\n" +
        "\n" +
        "По вопросам сотрудничества и рекламы: @gtap_manager";

    try {
        //await ctx.reply(text, { reply_markup: getMenuInline(ctx) })

        await ctx.replyWithPhoto(
            new InputFile('./src/bot/assets/hello.jpg'),
            {
                caption: text,
                reply_markup: getMenuInline(ctx),
                parse_mode: 'HTML',
            }
        );
    } catch (error) {
        console.error(error)

        try {
            //await ctx.deleteMessage();
            //await ctx.reply(text, { reply_markup: getMenuInline(ctx) })

            await ctx.replyWithPhoto(
                new InputFile('./src/bot/assets/hello.jpg'),
                {
                    caption: text,
                    reply_markup: getMenuInline(ctx),
                    parse_mode: 'HTML',
                }
            );
        } catch (error) {

        }
    }
}

export const sendAdminMessage = async (ctx) => {
    const system = new SystemHelper();
    const isAdmin = await system.isAdmin(ctx.from.id);

    if (!isAdmin) {
        return;
    }

    if (ctx.msg.text === '/admin') {
        return ctx.reply("Admin panel", {
            reply_markup: getAdminInline()
        });
    }

    const text = ctx.msg.text.replace('/admin ', '');
    const args = text.split(' ');

    if (args.length < 2) {
        return ctx.reply('/admin [tg id] [coins count]');
    }

    const user = new UserHelper(parseInt(args[0]));
    if (!await user.isRegister()) {
        return ctx.reply('user not found');
    }

    await user.addBalance(parseInt(args[1]));
    return ctx.reply('ok');
}