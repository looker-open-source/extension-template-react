import React from "react"
import { LookList } from "./LookList";
import { QueryContainer } from "./QueryContainer";
import { ExtensionContext } from "../framework/ExtensionWrapper"
import { ILook } from "@looker/sdk";
import { Switch, Route, RouteComponentProps, withRouter } from "react-router-dom"

interface ExtensionState {
  looks: ILook[]
  currentLook?: ILook
  selectedLookId?: number
  queryResult?: string
  runningQuery: boolean
  loadingLooks: boolean
}

class ExtensionInternal extends React.Component<RouteComponentProps, ExtensionState> {
  static contextType = ExtensionContext

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
      this.setState({selectedLookId: id})
      this.runLook(id)
    }
  }

  async runLook(look_id: number) {
    const look = this.state.looks.find(l => l.id == look_id)
    // If no matching Look then return
    if (look === undefined) {
      this.setState({
        currentLook: undefined,
        queryResult: "Unable to load Look.",
        runningQuery: false
      })
      return
    }

    // Set Page title
    this.context.extensionSDK.updateTitle(
      `Look: ${look.title || "unknown"}`
    )

    this.setState({currentLook: look, runningQuery: true})

    var result = await this.context.coreSDK.ok(
      this.context.coreSDK.run_look({look_id: look_id, result_format: "json"})
    )

    this.setState({
      queryResult: JSON.stringify(result),
      runningQuery: false
    })
  }

  async loadLooks() {
    this.setState({loadingLooks: true})
    var result = await this.context.coreSDK.ok(
      this.context.coreSDK.all_looks()
    )
    this.setState({
      // Take up to the first 10 looks
      looks: result.slice(0,9),
      loadingLooks: false
    })
  }

  onLookSelected(look: ILook) {
    this.props.history.push("/"+look.id)
    if (look.id !== this.state.selectedLookId) {
      this.setState({selectedLookId: look.id})
      this.runLook(look.id!)
    }
  }

  render() {
    return (
      <div>
        <LookList loading={this.state.loadingLooks} looks={this.state.looks} callback={(look: ILook) => this.onLookSelected(look)}/>
        <Switch>
          <Route path="/:id">
            <QueryContainer look={this.state.currentLook} results={this.state.queryResult} running={this.state.runningQuery}/>
          </Route>
        </Switch>
      </div>
    )
  }
}

export const Extension = withRouter(ExtensionInternal)