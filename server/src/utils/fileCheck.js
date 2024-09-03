import {responseObject} from "./responseUtils.js";

export const checkPhoto = (file) => {
    if (!file['file'] || !file['file']['bytesRead']) {
        return 'invalid file';
    }

    if (!['image/png', 'image/jpeg'].includes(file['mimetype'])) {
        return 'unsupported image format';
    }

    if (file['file']['bytesRead'] > 4e6) {
        return 'max size - 4mb';
    }

    return true;
}