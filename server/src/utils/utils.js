import { createHmac } from 'node:crypto';
import md5 from "md5";
import {DEV} from "../config.js";

export const getUnixTime = () => {
    return parseInt(String(new Date().getTime() / 1000));
}

export const getCleanJsonArray = () => {
    return JSON.stringify([]);
}

export const getCleanJsonObject = () => {
    return JSON.stringify({});
}

export const encodeString = (str) => {
    return encodeURIComponent(str);
}

export const randomString = (i) => {
    let rnd = '';
    while (rnd.length < i)
        rnd += Math.random().toString(36).substring(2);
    return rnd.substring(0, i);
};

export const splitLaunchParams = (launchParams) => {
    const ar = launchParams.split('&');
    const aaa = {};

    ar.forEach(a => {
        const [key, value] = a.split('=');
        aaa[key] = value;
    });

    return aaa;
}

export function checkHash(sp, token, options = {}) {
    const searchParams = typeof sp === 'string' ? new URLSearchParams(sp) : sp;

    let authDate = new Date(0);
    let hash = '';
    const pairs = [];

    searchParams.forEach((value, key) => {
        if (key === 'hash') {
            hash = value;
            return;
        }

        if (key === 'auth_date') {
            const authDateNum = parseInt(value, 10);

            if (Number.isNaN(authDateNum)) {
                throw new TypeError('"auth_date" should present integer');
            }
            authDate = new Date(authDateNum * 1000);
        }

        pairs.push(`${key}=${value}`);
    });

    if (hash.length === 0) {
        throw new Error('"hash" is empty or not found');
    }

    if (authDate.getTime() === 0) {
        throw new Error('"auth_date" is empty or not found');
    }

    const { expiresIn = 86400 } = options;

    if (expiresIn > 0) {
        if (authDate.getTime() + expiresIn * 1000 < new Date().getTime()) {
            throw new Error('Init data expired');
        }
    }

    pairs.sort();

    const computedHash = createHmac(
        'sha256',
        createHmac('sha256', 'WebAppData').update(token).digest(),
    )
        .update(pairs.join('\n'))
        .digest()
        .toString('hex');

    return computedHash === hash;
}

export const getExtension = (str) => {
    const result =  /\.[^\.]*$/.exec(str);
    return result[0] ?? null;
}

export function formatNumberWithSpaces(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export const generateFilename = (filename) => {
    const name = md5('file_' + Date.now() + '_' + filename + '_' + randomString(10));
    const extension = getExtension(filename);
    const fullName = name + extension;

    return { name, extension, fullName };
}

export function unixTimestampToDateTime(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const getStartOfDay = () => {
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    return date.getTime() / 1000;
}

export const getAppUrl = () => {
    return DEV ? 'https://127.0.0.1:10888' : process.env.APP_URL;
}

export function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const toNanoton = (ton) => {
    return Math.ceil(ton / 0.000000001);
}

export function increaseByPercentage(number, percent, n) {
    let percentageMultiplier = 1 + percent / 100;
    return Number((number * Math.pow(percentageMultiplier, n)).toFixed(2));
}
