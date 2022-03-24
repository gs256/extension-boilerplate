import port from "./background-port"
import { Message, RequestHandler } from "./communication"

console.log("[background] background started")

const requestMap = new Map<string, RequestHandler>()

chrome.runtime.onMessage.addListener(internalRequestHandler)

function addListener(route: string, handler: RequestHandler) {
    requestMap.set(route, handler)
}

function removeListener(route: string) {
    requestMap.delete(route)
}

function internalRequestHandler(
    msg: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
): boolean {
    const message: Message = msg
    const handler = requestMap.get(message.route)

    if (!handler) {
        sendResponse(null)
        return true
    }

    handler(message)
        .then(response => {
            sendResponse(response)
        })
        .catch(e => {
            sendResponse(null)
        })

    return true
}

async function testHandler(message: Message): Promise<Message> {
    return { route: message.route, data: ["response", "from", "background"] }
}

addListener("test", testHandler)

async function sendToActiveTab(message: Message): Promise<Message | null> {
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

port.addListener("test", testHandler)
setTimeout(async () => {
    port.sendToActiveTab({ route: "test", data: "test data" }).then(response =>
        console.log("response", response)
    )
    // var t = await sendToActiveTab({ route: "test", data: "test data" })
    // console.log(t)
}, 4000)
