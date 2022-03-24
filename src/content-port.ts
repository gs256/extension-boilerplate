import { Message, Port, RequestHandler } from "./communication"

class ContentPort extends Port {
    constructor() {
        super()
    }

    public async sendToBackground(message: Message): Promise<Message> {
        console.log("sending", message)
        return new Promise(resolve => {
            chrome.runtime.sendMessage(message, response => {
                resolve(response)
            })
        })
    }
}

const port = new ContentPort()
export default port
