export default function uid(text: string): string {
    return `${text}_${Math.floor(Math.random() * 1000)}`;
}