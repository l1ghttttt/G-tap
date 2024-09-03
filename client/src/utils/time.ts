export const convertUnixToDate = (unixTime: number) => {
    const date = new Date(unixTime * 1000);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const day1 = (day < 10) ? '0' + day : day;
    const month1 = (month < 10) ? '0' + month : month;

    return day1 + '.' + month1 + '.' + year;
}