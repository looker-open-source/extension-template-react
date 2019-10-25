import React from "react"

export interface ListItemProps {
  id: number,
  label: string,
  callback: () => void
}

export const ListItem: React.FC<ListItemProps> = (props) => {
  return (
    <div style={{margin: 5}}>
      <a onClick={()=>props.callback()} key={props.id} style={{textAlign: "center", cursor: "pointer"}}>
        {props.label}
      </a>
    </div>
  )
}