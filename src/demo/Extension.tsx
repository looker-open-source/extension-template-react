/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import React from "react"
import { LookList } from "./LookList"
import { QueryContainer } from "./QueryContainer"
import { Banner, Box, Heading, Flex } from "@looker/components"
import { ExtensionContext } from "@looker/extension-sdk-react"
import { ILook } from "@looker/sdk"
import { Switch, Route, RouteComponentProps, withRouter } from "react-router-dom"

interface ExtensionState {
  looks: ILook[]
  currentLook?: ILook
  selectedLookId?: number
  queryResult?: any
  runningQuery: boolean
  loadingLooks: boolean
  errorMessage?: string
}

class ExtensionInternal extends React.Component<RouteComponentProps, ExtensionState> {
  static contextType = ExtensionContext
  context!: React.ContextType<typeof ExtensionContext>

  constructor(props: RouteComponentProps) {
    super(props)
    this.state = {
      looks: [],
      selectedLookId: undefined,
      currentLook: undefined,
      queryResult: undefined,
      runningQuery: false,
      loadingLooks: true
    }
  }

  componentDidMount() {
    this.initialize()
  }

  async initialize() {
    await this.loadLooks()
    const path: string[] = this.props.location.pathname.split("/")
    if (path.length > 1) {
      const id: number = parseInt(this.props.location.pathname.split("/")[1], 10)
      this.setState({ selectedLookId: id })
      this.runLook(id)
    }
  }

  /*
  // TEMPLATE CODE FOR RUNNING ANY QUERY
  async runQuery() {
      try {
      const result = await this.context.coreSDK.ok(
        this.context.coreSDK.run_inline_query({
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
      )
      this.setState({
        queryResult: JSON.stringify(result, undefined, 2),
        runningQuery: false
      })
    } catch (error) {
      this.setState({
        queryResult: "",
        runningQuery: false,
        errorMessage: "Unable to run query"
      })
    }

  */

  async runLook(look_id: number) {
    const look = this.state.looks.find((l) => l.id == look_id)
    // If no matching Look then return
    if (look === undefined) {
      this.setState({
        currentLook: undefined,
        errorMessage: "Unable to load Look.",
        queryResult: "",
        runningQuery: false
      })
      return
    }

    // Set Page title
    this.context.extensionSDK.updateTitle(`Look: ${look.title || "unknown"}`)

    this.setState({ currentLook: look, runningQuery: true, errorMessage: undefined })

    try {
      const result = await this.context.coreSDK.ok(
        this.context.coreSDK.run_look({ look_id: look_id, result_format: "json" })
      )
      this.setState({
        queryResult: result,
        runningQuery: false
      })
    } catch (error) {
      this.setState({
        queryResult: "",
        runningQuery: false,
        errorMessage: "Unable to run look"
      })
    }
  }

  async loadLooks() {
    this.setState({ loadingLooks: true, errorMessage: undefined })
    try {
      var result = await this.context.coreSDK.ok(this.context.coreSDK.all_looks())
      this.setState({
        // Take up to the first 10 looks
        looks: result.slice(0, 9),
        loadingLooks: false
      })
    } catch (error) {
      this.setState({
        looks: [],
        loadingLooks: false,
        errorMessage: "Error loading looks"
      })
    }
  }

  onLookSelected(look: ILook) {
    this.props.history.push("/" + look.id)
    if (look.id !== this.state.selectedLookId) {
      this.setState({ selectedLookId: look.id })
      this.runLook(look.id!)
    }
  }

  render() {
    return (
      <>
        {this.state.errorMessage && <Banner intent='error'>{this.state.errorMessage}</Banner>}
        <Box m='large'>
          <Heading fontWeight='semiBold'>Welcome to the Looker Extension Template</Heading>
          <Flex width='100%'>
            <LookList
              loading={this.state.loadingLooks}
              looks={this.state.looks}
              selectLook={(look: ILook) => this.onLookSelected(look)}
            />
            <Switch>
              <Route path='/:id'>
                <QueryContainer
                  look={this.state.currentLook}
                  results={this.state.queryResult}
                  running={this.state.runningQuery}
                />
              </Route>
            </Switch>
          </Flex>
        </Box>
      </>
    )
  }
}

export const Extension = withRouter(ExtensionInternal)
