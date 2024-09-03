import mysql from 'mysql2/promise';
import {DEV} from "./config.js";

let connection;

const createPool = () => {
    const str = DEV ? 'mysql://root:root@localhost:8889/gtap' : process.env.DATABASE_CONNECTION_STRING;

    return mysql.createPool({
        uri: str,
        waitForConnections: true,
        connectionLimit: 100,
        idleTimeout: 30000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    });
}

const getConnection = async () => {
    if (typeof connection !== "undefined") {
        return connection;
    }

    connection = await createPool();

    console.log('mysql connect');

    return connection;
}

export default getConnection;