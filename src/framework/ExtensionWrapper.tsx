// The MIT License (MIT)

// Copyright (c) 2019 Looker Data Sciences, Inc.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, { useState } from "react"
import { MemoryRouter, useLocation } from "react-router-dom"
import {
  LookerExtensionSDK,
  ExtensionHostApi,
  connectExtensionHost
} from "bryns-extension-api"
import { LookerSDK } from "@looker/sdk/dist/sdk/methods"

export { LookerSDK }

/**
 * Extension context
 */
export interface ExtensionContextData {
  /**
   * Extension API.
   */
  extensionSDK: ExtensionHostApi
  /**
   * Looker SDK. Note that SDK calls are made by the extension host.
   */
  coreSDK: LookerSDK
}

/**
 * React context provider for extension API and SDK
 */
export const ExtensionContext = React.createContext<ExtensionContextData>(
  undefined as any // no one will ever see this undefined!
)

export interface ExtensionWrapperProps {
  /**
   * When true, host will track the clients route (client route will be appened to
   * host route). Note that this is only supported where the extension is mounted
   * in the main extension view. If the extension is mounted as a component of a
   * looker composite component (dashboard for example), hostTracksRoute will be
   * ignored.
   */
  hostTracksRoute?: boolean
  /**
   * Pathname change callback. Use when extension components need to modify their
   * state based upon the current route.
   */
  onPathnameChange?: (pathname: string) => void
  /**
   * Extension components
   */
  children: any
}

/**
 * ExtensionWrapper component. Provides access to the extension API and SDK (use
 * ExtensionContext) and react routing services.
 */
export const ExtensionWrapper: React.FC<ExtensionWrapperProps> = ({
  onPathnameChange,
  hostTracksRoute = true,
  children
}) => {
  const [initialRoute, setInitialRoute] = useState()
  const [hostInitialized, setHostInitialized] = useState(false)
  const [extensionData, setExtensionData] = React.useState<
    ExtensionContextData
  >()

  const initialized = () => {
    setHostInitialized(true)
  }

  React.useEffect(() => {
    connectExtensionHost({
      initializedCallback: initialized,
      restoreRoute: hostTracksRoute,
      setInitialRoute
    })
      .then(extensionHost => {
        const ctx = {
          extensionSDK: extensionHost,
          coreSDK: LookerExtensionSDK.createClient(extensionHost)
        }
        setExtensionData(ctx)
      })
      .catch(console.error)
  }, [])

  const initialEntries: string[] | undefined = initialRoute
    ? [initialRoute]
    : undefined

  return (
    <>
      {hostInitialized && (
        <MemoryRouter initialEntries={initialEntries}>
          <RouteChangeListener
            onPathnameChange={onPathnameChange}
            extensionHost={extensionData!.extensionSDK}
          />
          <ExtensionContext.Provider value={extensionData!}>
            {children}
          </ExtensionContext.Provider>
        </MemoryRouter>
      )}
    </>
  )
}

interface RouteChangeListenerProps {
  onPathnameChange?: (pathname: string) => void
  extensionHost: ExtensionHostApi
}

const RouteChangeListener: React.FC<RouteChangeListenerProps> = ({
  onPathnameChange,
  extensionHost
}) => {
  let location = useLocation()
  React.useEffect(() => {
    if (onPathnameChange) {
      onPathnameChange(location.pathname)
    }
    extensionHost.clientRouteChanged(location.pathname)
  }, [location])
  return <></>
}