import getElapsedTime from "@/logic/getElaspedTime";

export default function getTimeLabel(time: string) {
    let timeLabel = 's';
    let elapsedTime = Math.floor(getElapsedTime(time));
    if (elapsedTime < 1) elapsedTime = elapsedTime + 1;
    if (60 < elapsedTime && elapsedTime < 3600) {
        elapsedTime = Math.floor(elapsedTime / 60);
        timeLabel = 'min';
    }
    if (3600 < elapsedTime && elapsedTime < 86400) {
        elapsedTime = Math.floor(elapsedTime / 3600);
        timeLabel = 'h';
    }
    if (86400 < elapsedTime) {
        elapsedTime = Math.floor(elapsedTime / 86400);
        timeLabel = 'd';
    }
    return `${elapsedTime}${timeLabel}`
}