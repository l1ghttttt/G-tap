import {InlineKeyboard} from "grammy";
import {getAppUrl} from "../utils/utils.js";

export const getMenuInline = (ctx) => {
    const buttons = [
        [InlineKeyboard.webApp("🎮 Play", getAppUrl())],
        [InlineKeyboard.url("Join the Community", "https://t.me/gtap_group")],
    ];

    return InlineKeyboard.from(buttons);
}

export const getAdminInline = () => {
    const buttons = [
        [InlineKeyboard.webApp("Open", `${getAppUrl()}/admin`)],
    ];

    return InlineKeyboard.from(buttons);
}