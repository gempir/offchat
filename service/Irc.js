import parse from "./Parser";
import Message from "../models/Message";

export default class Irc {

    connect() {
        this.ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

        this.ws.onopen = this.handleNewConnection;
        this.ws.onmessage = this.handleNewMessage;
    }

    handleNewConnection = () => {
        this.ws.send("PASS oauth:123123123\r\n");
        this.ws.send("USER justinfan123123\r\n");
        this.ws.send("NICK justinfan123123\r\n");
        this.ws.send("CAP REQ :twitch.tv/tags\r\n");
        this.ws.send("CAP REQ :twitch.tv/commands\r\n");

    }

    handleNewMessage = (e) => {
        if (e.data.startsWith("PING :tmi.twitch.tv")) {
            console.log("responding to ping")
            this.ws.send("PONG :tmi.twitch.tv");
            return;
        }

        if (e.data.startsWith(":tmi.twitch.tv 001")) {
            console.log("connected");
        }

        let parsed = parse(e.data)
        
        if (parsed.command !== "PRIVMSG") {
            return;
        }
        parsed.trailing = parsed.trailing.replace("\n", "");

        const message = new Message(parsed.parameters[0].replace("#", ""), parsed.userinfo.ident, parsed.trailing, parsed.tags)

        if (this.onNewMessageCallback) {
            this.onNewMessageCallback(message);
        }
    }
    
    onNewMessage(callback) {
        this.onNewMessageCallback = callback;
    }
}