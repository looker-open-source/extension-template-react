import React, { useState } from "react"
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from "@material-ui/styles";
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { ILookmlModel } from "@looker/sdk"
import { CurrentExplore } from "./ModelDictionary"
import styled from "styled-components"

const notHidden = explore => !explore.hidden
const matchesSearch = search => explore =>
  explore.label.toLowerCase().indexOf(search.toLowerCase()) !== -1


interface ExploreListProps {
  models: ILookmlModel[]
  currentExplore?: CurrentExplore
  onExploreSelected: (explore: CurrentExplore) => void
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: 8,
  },
}));

export const ExploreList: React.FC<ExploreListProps> = (props) => {
  const classes = useStyles();
  const [search, setSearch] = useState("")

  return (
    <Paper className={classes.root}>
      <Box>
          Model Dictionary
      </Box>
      <Box>
        <TextField placeholder={"Search Models"} value={search} onChange={e => setSearch(e.currentTarget.value)}/>
      </Box>
      {props.models
        .filter(
          model =>
            model.explores.filter(notHidden).filter(matchesSearch(search))
              .length > 0
        )
        .map(model => {
          return (
            <MenuList key={model.name}>
             {model.label}
              {model.explores
                .filter(notHidden)
                .filter(matchesSearch(search))
                .map(explore => {
                  return (
                    <MenuItem
                      key={explore.name}
                      onClick={() => props.onExploreSelected({ model, explore })}
                    >
                      {explore.label}
                    </MenuItem>
                  )
                })}
            </MenuList>
          )
        })}
    </Paper>
  )
}