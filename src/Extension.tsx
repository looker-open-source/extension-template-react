import React, { useState } from "react"
import Button from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import Paper from '@material-ui/core/Paper'
import { makeStyles } from "@material-ui/styles";
import { ModelDictionary } from "./ModelDictionary"

interface ExtensionProps {
  lang: string
}

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

export const Extension: React.FC<ExtensionProps> = (props) => {
  const [count, setCount] = useState(0)
  const classes = useStyles()

  return (
    <Grid
        container 
        className={classes.root}
        spacing={2}
    >
      <Grid item xs={12}>
          <Paper className={classes.control}>
              <Grid container>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => setCount(count+1)}>
                    Sample {props.lang} Extension Here.
                  </Button>
                  <Box>
                    Click {count}
                  </Box>
                </Grid>
              </Grid>
          </Paper>
      </Grid>
      <Grid item xs={12}>
        <Grid container justify="center">
          <Grid item>
            <ModelDictionary/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

