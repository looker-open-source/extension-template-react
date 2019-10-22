import * as React from "react"
import Button from "@material-ui/core/Button"

let lang: string = "TypeScript"

export default () => (
  <Button variant="contained" color="primary">
    Sample {lang} Extension Here
  </Button>
)
