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

import { connect } from 'react-redux'
import React from 'react'
import {LookList} from './LookList'
import {QueryContainer} from './QueryContainer'
import {Banner, Box, Heading, Flex} from '@looker/components'
import {ExtensionContext} from '@looker/extension-sdk-react'
import {ILook} from '@looker/sdk'
import { hot } from "react-hot-loader/root"
import {Switch, Route, RouteComponentProps, withRouter} from 'react-router-dom'
import { State, allLooksRequest, runLookRequest } from '../data'

export type ExtensionProps = ExtensionStateProps &
  ExtensionDispatchProps &
  ExtensionOwnProps

interface ExtensionOwnProps extends RouteComponentProps {}

interface ExtensionDispatchProps {
  allLooks: () => void
  runLook: (lookId: number) => void
}

interface ExtensionStateProps {
  looks?: ILook[]
  currentLook?: ILook
  selectedLookId?: number
  queryResult?: any
  runningQuery: boolean
  loadingLooks: boolean
  errorMessage?: string
}

class ExtensionInternal extends React.Component<ExtensionProps, {}> {
  static contextType = ExtensionContext
  context!: React.ContextType<typeof ExtensionContext>

  constructor(props: ExtensionProps) {
    super(props)
  }

  componentDidMount() {
    const {initializeError} = this.context
    if (initializeError) {
      return
    }
    const { location, allLooks, runLook } = this.props
    allLooks()
  }

  componentDidUpdate() {
    const {initializeError} = this.context
    if (initializeError) {
      return
    }
    const {looks, selectedLookId, location, runningQuery} = this.props
    if (!runningQuery && looks) {
      if (!selectedLookId) {
        const path: string[] = location.pathname.split('/')
        if (path.length > 1 && path[1] !== '') {
          const id: number = parseInt(path[1], 10)
          if (!isNaN(id)) {
            const selectedLook = looks.find(look => look.id === id)
            if (selectedLook) {
              this.onLookSelected(selectedLook)
            }
          }
        }
      }
    }
  }

  onLookSelected(look: ILook) {
    const {selectedLookId, runLook, runningQuery} = this.props
    if (!runningQuery && selectedLookId !== look.id && look.id) {
      this.props.history.push('/' + look.id)
      this.context.extensionSDK.updateTitle(look.title || 'Unknown')
      runLook(look.id)
    }
  }

  render() {
    if (this.context.initializeError) {
      return <Banner intent='error'>{this.context.initializeError}</Banner>
    }
    const { errorMessage, loadingLooks, looks, currentLook, queryResult, runningQuery } = this.props
    return (
      <>
        {errorMessage && <Banner intent='error'>{errorMessage}</Banner>}
        <Box m='large'>
          <Heading fontWeight='semiBold'>Welcome to the Looker Extension Template</Heading>
          <Flex width='100%'>
            <LookList
              loading={loadingLooks}
              looks={looks || []}
              selectLook={(look: ILook) => this.onLookSelected(look)}
            />
            <Switch>
              <Route path='/:id'>
                <QueryContainer
                  look={currentLook}
                  results={queryResult}
                  running={runningQuery}
                />
              </Route>
            </Switch>
          </Flex>
        </Box>
      </>
    )
  }
}

const mapStateToProps = (state: any): ExtensionStateProps => {
  const {loading, error, looks, currentLookId, queries} = state as State
  return {
    looks: looks,
    currentLook: looks ? looks.find(look => look.id === currentLookId) : undefined,
    selectedLookId: currentLookId,
    queryResult: currentLookId ? queries[currentLookId] : undefined,
    runningQuery: loading && !!looks,
    loadingLooks: loading && !looks,
    errorMessage: error,
  }
}

const mapDispatchToProps = (dispatch: any): ExtensionDispatchProps => ({
  allLooks: () => {
    dispatch(allLooksRequest())
  },
  runLook: (lookId: number) => {
    dispatch(runLookRequest(lookId))
  },
})

export const Extension = hot(withRouter(connect<
  ExtensionStateProps,
  ExtensionDispatchProps,
  ExtensionOwnProps
>(mapStateToProps, mapDispatchToProps)(ExtensionInternal)))
