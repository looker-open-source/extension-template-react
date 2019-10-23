  
import * as React from "react"
import { ILookmlModel, ILookmlModelNavExplore } from "@looker/sdk"
import SvgIcon from '@material-ui/core/SvgIcon';
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import Paper from '@material-ui/core/Paper';
import { makeStyles } from "@material-ui/styles";
import Typeography from "@material-ui/core/Typography"
import { ExtensionContext } from "./framework/ExtensionWrapper"
import ExploreList from "./ExploreList"

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: 8,
    },
  }));

export type CurrentExplore = {
  explore: ILookmlModelNavExplore
  model: ILookmlModel
}

interface ModelDictionaryState {
  loading: boolean
  models: ILookmlModel[]
  currentExplore?: CurrentExplore
}

const BigEmptyState = () => {
  return (
      <Box component="span">
        <SvgIcon>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
        <Typeography variant="h6" gutterBottom>
            Pick an explore to see what data is available.
        </Typeography>
      </Box>
  )
}

export class ModelDictionary extends React.Component<{}, ModelDictionaryState> {
  static contextType = ExtensionContext

  constructor(props: {}) {
    super(props)

    this.state = { loading: true, models: [] }
  }

  async loadModels() {
    this.setState({
      models: await this.context.coreSDK.ok(
        this.context.coreSDK.all_lookml_models()
      ),
      loading: false
    })
  }

  componentDidMount() {
    this.loadModels()
  }

  render() {
    const classes = useStyles();

    if (this.state.loading) {
      return <Box> Loading </Box>
    } else {
      return (
        <Grid container justify="center">
            <Grid item>
                <ExploreList
                models={this.state.models}
                currentExplore={this.state.currentExplore}
                onExploreSelected={currentExplore =>
                    this.setState({ currentExplore })
                }
                />
            </Grid>
            <Grid item>
                {this.state.currentExplore ? (
                    //<ExploreInformation {...this.state.currentExplore} />
                    <Box>
                        Stuff will go here
                    </Box>
                ) : (
                <BigEmptyState />
                )}
            </Grid>
        </Grid>
      )
    }
  }
}

