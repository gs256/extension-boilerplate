import Message from "./communication"

type RequestHandler = (message: Message) => Promise<Message>

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
    return { route: message.route, data: ["response", "from", "content"] }
}

async function sendToBackground(message: Message): Promise<Message> {
    return new Promise(resolve => {
        chrome.runtime.sendMessage(message, response => {
            resolve(response)
        })
    })
}

addListener("test", testHandler)
document.addEventListener(
    "DOMContentLoaded",
    async () => {
        var t = await sendToBackground({
            route: "test",
            data: "message from content",
        })
        console.log(t)
    },
    false
)
