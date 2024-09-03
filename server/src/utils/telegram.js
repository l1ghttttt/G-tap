import {Bot} from "grammy";
import dotenv from "dotenv";

dotenv.config()
const bot = new Bot(process.env.BOT_ACCESS_TOKEN);

export async function getUserInfo(tgId) {
    try {
        const chat = await bot.api.getChat(tgId);

        if (!chat || !chat['first_name'] || !chat['photo']) {
            return null;
        }

        const name = chat['first_name'] ?? `Player #${tgId}`;
        const photo = chat['photo']['small_file_id'];

        return { name, photo };
    } catch (error) {
        console.error('Ошибка получения информации о пользователе:', error);
        return null;
    }
}

export const getFileUrlById = async (fileId) => {
    const file = await bot.api.getFile(fileId);
    const filePath = file.file_path;

    return `https://api.telegram.org/file/bot${process.env.BOT_ACCESS_TOKEN}/${filePath}`;
}

export const checkChannelSubscribe = async (userId, channelAddress) => {
    try {
        const member = await bot.api.getChatMember(channelAddress, userId);
        return member.status !== "left";
    } catch (error) {
        //console.error(error);
        return false;
    }
}
