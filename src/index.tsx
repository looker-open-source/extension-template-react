import * as React from "react"
import * as ReactDOM from "react-dom"
import { Extension } from "./demo/Extension"
import { ExtensionWrapper } from "./framework/ExtensionWrapper"

window.addEventListener("DOMContentLoaded", async event => {
  var root = document.createElement("div")
  document.body.appendChild(root)
  
  ReactDOM.render(
    // ExtensionWrapper provides subcomponents access to the Looker Extension SDK
    <ExtensionWrapper>
      <Extension/>
    </ExtensionWrapper>,
    root
  )
})