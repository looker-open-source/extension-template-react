import { Box, MenuGroup, MenuItem, MenuItemProps } from "@looker/components"
import * as React from "react"
import { Link as RouterLink, LinkProps } from "react-router-dom"
import styled from "styled-components"
import { SidebarProps } from "./"
import omit from "lodash/omit"

const API_ROUTE = "/api"
const SANDBOX_ROUTE = "/sandbox"
const LENS_ROUTE = "/lens"

export const Sidebar: React.FC<SidebarProps> = ({ pathname }) => {
  return (
    <Box display="flex" flexDirection="column">
      <MenuGroup type="none" mt="xsmall">
        <StyledRouterLink to={API_ROUTE}>
          <MenuItem icon="Flag" current={pathname === API_ROUTE}>
            Api Functions
          </MenuItem>
        </StyledRouterLink>
        <StyledRouterLink to={SANDBOX_ROUTE}>
          <MenuItem icon="Clock" current={pathname === SANDBOX_ROUTE}>
            Sandbox Functions
          </MenuItem>
        </StyledRouterLink>
        <StyledRouterLink to={LENS_ROUTE}>
          <MenuItem icon="Clock" current={pathname === LENS_ROUTE}>
            Lens Playground
          </MenuItem>
        </StyledRouterLink>
      </MenuGroup>
    </Box>
  )
}

const StyledRouterLinkInner: React.FC<LinkProps & MenuItemProps> = props => (
  <RouterLink {...omit(props, "customizationProps")} />
)

const StyledRouterLink = styled(StyledRouterLinkInner)`
  text-decoration: none;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`
