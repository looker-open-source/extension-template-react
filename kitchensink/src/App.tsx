import { Sidebar } from "./components/Sidebar"
import { SandboxFunctions } from "./components/SandboxFunctions"
import { ApiFunctions } from "./components/ApiFunctions"
import React, { useState } from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import { theme, Box, GlobalStyle } from "@looker/components"
import styled, { ThemeProvider } from "styled-components"
import { LensPlayground } from "./components/LensPlayground"
import { ExtensionProvider } from "@looker/extension-sdk-react"

interface AppProps {
  standalone?: boolean
}

enum ROUTES {
  API_ROUTE = "/api",
  SANDBOX_ROUTE = "/sandbox",
  LENS_ROUTE = "/lens"
}

export const App: React.FC<AppProps> = ({ standalone }) => {
  const [pathname, setPathname] = useState("")

  return (
    <ExtensionProvider onPathnameChange={setPathname}>
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyle />
          <Layout>
            <Sidebar pathname={pathname} />
            <Box>
              <Switch>
                <Route path={ROUTES.API_ROUTE}>
                  <ApiFunctions />
                </Route>
                <Route path={ROUTES.SANDBOX_ROUTE}>
                  <SandboxFunctions />
                </Route>
                <Route path={ROUTES.LENS_ROUTE}>
                  <LensPlayground />
                </Route>
                <Redirect to={ROUTES.API_ROUTE} />
              </Switch>
            </Box>
          </Layout>
        </>
      </ThemeProvider>
    </ExtensionProvider>
  )
}

export const Layout = styled(Box)`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 200px auto;
`
