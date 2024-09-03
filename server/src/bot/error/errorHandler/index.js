import {GrammyError, HttpError} from "grammy";

const errorHandler = (err) => {
    const e = err.error;

    if (e instanceof GrammyError) console.error("Error in request:", e.description);
    else if (e instanceof HttpError) console.error("Could not contact Telegram:", e);
    else console.error("Unknown error:", e);
}

export default errorHandler;