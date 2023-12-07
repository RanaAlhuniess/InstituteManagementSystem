import moment from "moment";

export function formatDateTime(date: string): string {
    return moment.utc(date).format('YYYY-MM-DD HH:mm');
}

export function formatDate(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
}
export function formatTime(date: Date): string {
    return moment.utc(date).format('HH:mm:ss');
}