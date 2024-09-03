export const responseObject = (payload, status = true) => {
    return {
        status: status ? "ok" : "error",
        payload: payload,
    };
}