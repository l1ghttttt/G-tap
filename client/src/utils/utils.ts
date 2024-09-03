export const copyText = (text: string) => {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
}

export const getTG = () => {
    // @ts-ignore
    return window['Telegram']['WebApp'];
}

export const getLang = (i18n: any) => {
    return i18n.language === 'ru' ? 'ru' : 'en';
}

export const getUnixTime = () => {
    return parseInt(String(new Date().getTime() / 1000));
}

export const getSocialIconByUrl = (url: string) => {
    if (url.includes('x.com') || url.includes('twitter.com')) {
        return 'social/twitter.png'
    }

    if (url.includes('facebook.com')) {
        return 'social/facebook.png'
    }

    if (url.includes('youtube.com')) {
        return 'social/youtube.png'
    }

    if (url.includes('t.me') || url.includes('@')) {
        return 'social/telegram.png'
    }

    return 'emoji/loudspeaker.png';
}

export const getIdFromPathname = (location: any) => {
    const pathname = location.pathname;
    const parts = pathname.split('/');
    const id = Number(parts[parts.length - 1]);

    return isNaN(id) ? null : id;
}