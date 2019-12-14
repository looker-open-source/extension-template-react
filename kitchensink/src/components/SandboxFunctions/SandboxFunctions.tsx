import * as React from "react"
import { Heading, Box } from "@looker/components"
import styled from "styled-components"
import { ExtensionButton } from "../ExtensionButton"

export const SandboxFunctions = () => {
  const [messages, setMessages] = React.useState("")

  const jailbreakButtonClick = () => {
    try {
      const slipstream = (window.parent as any).slipstream
      setMessages(
        messages +
          "\nSuccessful Jailbreak - parent slipstream:\n" +
          JSON.stringify(slipstream)
      )
    } catch (err) {
      console.error(err)
      setMessages(messages + "\nJailbreak foiled!")
    }
  }

  const getCsrfTokenUsingFetchClick = () => {
    try {
      fetch("https://self-signed.looker.com:9999/", {
        mode: "no-cors"
      })
        .then((response: any) => {
          console.log(">>>>", response)
          return response.body
        })
        .then(body => {
          setMessages(messages + "\nGet using fetch succeeded. Body=" + body)
          console.log(">>>>", body)
        })
        .catch(err => {
          console.error(err)
          setMessages(messages + "\nGet csrf fetch failed!")
        })
    } catch (err) {
      console.error(err)
      setMessages(messages + "\nGet csrf using fetch failed!")
    }
  }

  const getCsrfTokenUsingXHRClick = () => {
    try {
      const req = new XMLHttpRequest()
      req.addEventListener("load", event => {
        setMessages(messages + "\nGet using XHR succeeded.")
      })
      req.addEventListener("error", event => {
        setMessages(messages + "\nGet using XHR failed.")
      })
      req.open("GET", "https://self-signed.looker.com:9999/")
      req.setRequestHeader("mode", "no-cors")
      req.send()
    } catch (error) {
      console.error(error)
      setMessages(messages + "\nGet csrf using XHR failed!")
    }
  }

  const callAllConnectionClick = () => {
    try {
      fetch(
        "https://self-signed.looker.com:9999/api/internal/core/3.1/connections",
        {
          mode: "no-cors"
        }
      )
        .then((response: any) => {
          setMessages(messages + "\nAll connections succeeded!")
        })
        .catch(err => {
          console.error(err)
          setMessages(messages + "\nAll connections failed!")
        })
    } catch (err) {
      console.error(err)
      setMessages(messages + "\nAll connections failed!")
    }
  }

  const openWindowButtonClick = () => {
    try {
      window.open("http://example.com", "_blank")
      setMessages(messages + "\nIs window open? Fails silently (in Chrome)")
    } catch (err) {
      console.error(err)
      setMessages(messages + "\nOpen window foiled!")
    }
  }

  const thirdPartyApiButtonClick = () => {
    try {
      fetch(
        "https://hacker-news.firebaseio.com/v0/item/160705.json?print=pretty"
      )
        .then((response: any) => response.json())
        .then((json: any) =>
          setMessages(
            messages +
              "\nThird party api succeeded!\n" +
              JSON.stringify(json, undefined, 2)
          )
        )
        .catch(err => {
          console.error(err)
          setMessages(messages + "\nThird party api failed!")
        })
    } catch (err) {
      console.error(err)
      setMessages(messages + "\nThird party api failed!")
    }
  }

  const pushStateButtonClick = () => {
    try {
      window.history.pushState({ abc: 123 }, "Page 2", "/page2")
    } catch (err) {
      console.error(err)
      setMessages(messages + "\nPush state failed!")
    }
  }

  const saveLocalStorageButtonClick = () => {
    try {
      window.localStorage.setItem("KEY", "DATA")
    } catch (err) {
      console.error(err)
      setMessages(messages + "\nLocal storage setitem failed")
    }
  }

  return (
    <>
      <Heading my="xlarge">Sandbox Functions</Heading>
      <Box display="flex" flexDirection="row">
        <Box display="flex" flexDirection="column" width="50%">
          <ExtensionButton onClick={jailbreakButtonClick}>
            Attempt jailbreak
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={openWindowButtonClick}
          >
            Attempt open window
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={getCsrfTokenUsingFetchClick}
          >
            Get csrf token using fetch
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={getCsrfTokenUsingXHRClick}
          >
            Get csrf token using xhr
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={thirdPartyApiButtonClick}
          >
            Call third party API
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={pushStateButtonClick}
          >
            Push state into history
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={saveLocalStorageButtonClick}
          >
            Save to local storage
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={callAllConnectionClick}
          >
            Call all_connections directly
          </ExtensionButton>
        </Box>
        <Box width="50%" pr="large">
          <StyledPre>{messages}</StyledPre>
        </Box>
      </Box>
    </>
  )
}

const StyledPre = styled.pre`
  margin: 0 0 0 20px;
  border: 1px solid #c1c6cc;
  height: 100%;
  padding: 20px;
`
