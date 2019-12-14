import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./App"

window.addEventListener("DOMContentLoaded", event => {
  var root = document.createElement("div")
  document.body.appendChild(root)
  ReactDOM.render(<App standalone={window.top === window} />, root)
})
