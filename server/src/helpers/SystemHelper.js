import DatabaseHelper from "./DatabaseHelper.js";
import {getStartOfDay, getUnixTime} from "../utils/utils.js";

class SystemHelper extends DatabaseHelper {

    getData = async () => {
        const result = await this.query("SELECT * FROM `system` WHERE `id` = 1");
        return result[0];
    }

    getAdmins = async () => {
        const data = await this.getData();
        return JSON.parse(data['admins']);
    }

    setAdmins = async (ids) => {
        return this.query(
            "UPDATE `system` SET `admins` = ? WHERE `id` = 1",
            [JSON.stringify(ids)]
        )
    }

    isAdmin = async (tgId) => {
        const admins = await this.getAdmins();
        return admins.includes(tgId);
    }

    getUsersCanClick = async () => {
        return this.query(
            'SELECT telegram_id FROM users WHERE earnings_get_last_time + earnings_delay_time < ? AND click_notification = 0',
            [getUnixTime()]
        );
    }

}

export default SystemHelper;