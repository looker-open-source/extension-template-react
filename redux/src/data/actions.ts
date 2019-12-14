import { ILook } from "@looker/sdk"

export const Actions = {
  ALL_LOOKS_REQUEST:  'ALL_LOOKS_REQUEST',
  ALL_LOOKS_SUCCESS: 'ALL_LOOKS_SUCCESS',
  RUN_LOOK_REQUEST:  'RUN_LOOK_REQUEST',
  RUN_LOOK_SUCCESS: 'RUN_LOOK_SUCCESS',
  ERROR: 'ERROR'
}

export interface RunLookSuccess {
  lookId: number
  result: Record<string, any>
}

export interface Action {
  type: string
  payload?: ILook[] | string | number | RunLookSuccess
}

export const allLooksRequest = ():Action => ({
  type: Actions.ALL_LOOKS_REQUEST,
})

export const allLooksSuccess = (looks: ILook[]):Action => ({
  type: Actions.ALL_LOOKS_SUCCESS,
  payload: looks
})

export const runLookRequest = (lookId: number):Action => ({
  type: Actions.RUN_LOOK_REQUEST,
  payload: lookId
})

export const runLookSuccess = (lookId: number, result: Record<string, any>):Action => ({
  type: Actions.RUN_LOOK_SUCCESS,
  payload: {
    lookId,
    result
  }
})

export const error = (error: string):Action => ({
  type: Actions.RUN_LOOK_SUCCESS,
  payload: error
})
