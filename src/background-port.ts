import { Message, Port, RequestHandler } from "./communication"

class BackgroundPort extends Port {
    constructor() {
        super()
    }

    public async sendToActiveTab(message: Message): Promise<Message | null> {
        return new Promise(resolve => {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                const tabId = tabs[0]?.id
                if (tabId === undefined) resolve(null)
                chrome.tabs.sendMessage(tabId!, message, response => {
                    if (!chrome.runtime.lastError) {
                        resolve(response)
                    } else {
                        resolve(null)
                    }
                })
            })
        })
    }
}

const port = new BackgroundPort()
export default port
