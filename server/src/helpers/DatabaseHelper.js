import getConnection from "../mysql.js";

let i = 0;

class DatabaseHelper {

    async query(sql, params = []) {
        if (!sql) {
            console.log(sql)
            return;
        }

        let before, after, resultTime;

        try {
            const pool = await getConnection();

            before = Date.now();
            const [rows, fields] = await pool.query(sql, params);
            after = Date.now();
            resultTime = after - before;

            if (resultTime > 10000)
                console.log(`MYSQL query time: ${resultTime} ms  |  ${sql} ||| ${params}`);

            return rows;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

}

export default DatabaseHelper;