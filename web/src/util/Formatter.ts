export default class Formatter {
    public static formatSeconds = (duration: number) => {
        const days = Math.floor(duration / (3600 * 24));
        duration -= days * 3600 * 24;
        const hours = Math.floor(duration / 3600);
        duration -= hours * 3600;
        const minutes = Math.floor(duration / 60);
        duration -= minutes * 60;
        const parts = [];
        if (days) parts.push(`${days}d`);
        if (hours) parts.push(`${hours}h`);
        if (minutes) parts.push(`${minutes}m`);
        if (duration) parts.push(`${duration}s`);
        return parts.join(" ");
    }
}