import axios from "axios";

export const getUrl = () => {
    return process.env.NODE_ENV === 'production' ? (process.env.REACT_APP_API_URL + '/v1') : '/v1';
}

export const getImageUrl = (filename: string) => {
    return getUrl() + '/file/' + filename;
}

export const getTelegramImageUrl = (fileId: string) => {
    return getUrl() + '/telegramFile/' + fileId;
}

export const fetchData = async (route: string, options: any = {}) => {
    // @ts-ignore
    const initData = window["Telegram"]['WebApp']['initData'];
    const url = getUrl() + route;

    try {
        const response = await fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': !options.file ?
                        'application/json' : 'multipart/form-data',
                    'launch-params': initData,
                },
                body: JSON.stringify(options),
            }
        );

        const result = await response.json();
        if (result.status !== 'ok') {
            return { result: null, error: result.payload };
        }

        return { result: result.payload, error: null };
    } catch (error) {
        return { result: null, error: error };
    }
}

export const fetchDataAxios = async (route: string, options: any = {}) => {
    // @ts-ignore
    const initData = window["Telegram"]['WebApp']['initData'];
    const url = getUrl() + route;

    const formData = new FormData();
    Object.keys(options).forEach((key) => {
        formData.append(key, options[key]);
    });

    try {
        const response = await axios.post(
            url,
            formData,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'launch-params': initData,
                },
            }
        );

        const result = await response.data;
        if (result.status !== 'ok') {
            return { result: null, error: result.payload };
        }

        return { result: result.payload, error: null };
    } catch (error) {
        return { result: null, error: error };
    }
}