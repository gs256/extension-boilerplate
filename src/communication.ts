export interface Message {
    route: string
    data: any | null
}

export type RequestHandler = (message: Message) => Promise<Message>

export class Port {
    private _requestMap: Map<string, RequestHandler>

    constructor() {
        this._requestMap = new Map<string, RequestHandler>()
        chrome.runtime.onMessage.addListener(
            this.internalRequestHandler.bind(this)
        )
    }

    public addListener(route: string, handler: RequestHandler) {
        this._requestMap.set(route, handler)
    }

    public removeListener(route: string) {
        this._requestMap.delete(route)
    }

    private internalRequestHandler(
        msg: any,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void
    ): boolean {
        const message: Message = msg
        const handler = this._requestMap.get(message.route)

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
}
