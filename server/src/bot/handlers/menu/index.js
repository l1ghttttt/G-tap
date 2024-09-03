import {Composer} from "grammy";
import {sendAdminMessage, sendStartMessage} from "./messages.js";

const menu = new Composer();

menu.command(
    ["start", "menu"],
    (ctx) => sendStartMessage(ctx, false)
);

menu.command(
    ["admin"],
    (ctx) => sendAdminMessage(ctx, false)
);

export default menu;