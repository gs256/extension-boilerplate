chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log("[background] got", msg, "from", sender)
    sendResponse("response from background")
})
