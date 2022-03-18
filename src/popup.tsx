import React from "react"
import ReactDOM from "react-dom"

function Popup() {
    return <h1>No content</h1>
}

ReactDOM.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>,
    document.getElementById("root")
)
