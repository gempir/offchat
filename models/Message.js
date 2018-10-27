export default class Message {

    constructor(channel, username, text, tags) {
        this.channel = channel;
        this.username = username;
        this.text = text;
        this.tags = tags;
    }
}