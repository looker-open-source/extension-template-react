import React, { useContext } from "react"
import { Heading, Box } from "@looker/components"
import styled from "styled-components"
import { ExtensionButton } from "../ExtensionButton"
import { ApiFunctionsProps } from "./types"
import {
  ExtensionContext,
  ExtensionContextData
} from "@looker/extension-sdk-react"
import { ExtensionHostApi } from "@looker/extension-sdk"

export const ApiFunctions: React.FC<ApiFunctionsProps> = () => {
  const [messages, setMessages] = React.useState("")
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const extensionHost = extensionContext.extensionSDK as ExtensionHostApi
  const sdk = extensionContext.coreSDK

  const buttonClick = () => {
    extensionHost
      .verifyHostConnection()
      .then(value => {
        if (value === true) {
          setMessages(messages + "\nHost verification success")
        } else {
          setMessages(messages + "\nInvalid response " + value)
        }
      })
      .catch(error => {
        setMessages(messages + "\nHost verification failure")
        console.error("Host verification failure", error)
      })
  }

  const updateTitleButtonClick = () => {
    const date = new Date()
    extensionHost.updateTitle(
      `Extension Title Update ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    )
  }

  const goToBrowseButtonClick = () => {
    extensionHost.updateLocation("/browse")
  }

  const goToMarketplaceButtonClick = () => {
    extensionHost.updateLocation("/marketplace")
  }

  const openMarketplaceButtonClick = () => {
    extensionHost.openBrowserWindow("/marketplace", "_marketplace")
  }

  const getConnectionsButtonClick = () => {
    extensionHost
      .invokeCoreSdkByName("all_connections")
      .then(response => {
        if (response.ok) {
          let message = ""
          response.value.forEach(connection => {
            message += connection.name + "\n"
          })
          setMessages(messages + "\n" + message)
        }
      })
      .catch(error => {
        setMessages(messages + "\nGet connections failure")
        console.error("Get connections failure", error)
      })
  }

  const getConnectionsUsingCoreSdkButtonClick = () => {
    sdk.all_connections().then((response: any) => {
      if (response.ok) {
        let message = ""
        response.value.forEach(connection => {
          message += connection.name + "\n"
        })
        setMessages(messages + "\n" + message)
      }
    })
  }

  const localStorageSet = () => {
    extensionHost
      .localStorageSetItem("testbed", new Date().toString())
      .then(() => {
        setMessages(messages + "\nSuccess")
      })
      .catch(error => {
        setMessages(messages + "\n" + error)
        console.error(error)
      })
  }

  const localStorageGet = () => {
    extensionHost
      .localStorageGetItem("testbed")
      .then(value => {
        setMessages(messages + "\n" + (value || "null"))
      })
      .catch(error => {
        setMessages(messages + "\n" + error)
        console.error(error)
      })
  }

  const localStorageRemove = () => {
    extensionHost
      .localStorageRemoveItem("testbed")
      .then(() => {
        setMessages(messages + "\nSuccess")
      })
      .catch(error => {
        setMessages(messages + "\n" + error)
        console.error(error)
      })
  }

  const inlineQueryClick = () => {
    sdk
      .run_inline_query({
        result_format: "json_detail",
        limit: 10,
        body: {
          total: true,
          model: "thelook",
          view: "users",
          fields: ["last_name", "gender"],
          sorts: [`last_name desc`]
        }
      })
      .then((response: any) => {
        if (response.ok) {
          setMessages(messages + "\n" + JSON.stringify(response.value, null, 2))
        }
      })
  }

  return (
    <>
      <Heading my="xlarge">API Functions</Heading>
      <Box display="flex" flexDirection="row">
        <Box display="flex" flexDirection="column" width="50%">
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={updateTitleButtonClick}
          >
            Update title
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={goToBrowseButtonClick}
          >
            Go to browse (update location)
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={goToMarketplaceButtonClick}
          >
            Go to Marketplace (update location)
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={openMarketplaceButtonClick}
          >
            Open marketplace new window
          </ExtensionButton>
          <ExtensionButton mt="small" variant="outline" onClick={buttonClick}>
            Verify host connection
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={getConnectionsButtonClick}
          >
            Get connections using api name
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={getConnectionsUsingCoreSdkButtonClick}
          >
            Get connections using Core SDK
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={inlineQueryClick}
          >
            Inline Query
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={localStorageSet}
          >
            Set local storage
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={localStorageGet}
          >
            Get local storage
          </ExtensionButton>
          <ExtensionButton
            mt="small"
            variant="outline"
            onClick={localStorageRemove}
          >
            Remove local storage
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
