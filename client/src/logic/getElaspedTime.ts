export default function getElapsedTime(time: string) {
    return (new Date().getTime() - new Date(time).getTime()) / 1000;
}