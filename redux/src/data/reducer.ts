import { ILook } from "@looker/sdk"
import { Actions, Action, RunLookSuccess } from '.'

export interface State {
  loading: boolean
  error?: string
  looks?: ILook[]
  currentLookId?: number
  queries: Record<string, Record<string, any>>
}

const defaultState: Readonly<State> = Object.freeze({
  loading: false,
  queries: {},
})

export const reducer = (
  state: State = defaultState,
  action: Action
): State => {
  switch (action.type) {
    case Actions.ALL_LOOKS_REQUEST:
    case Actions.RUN_LOOK_REQUEST:
      return {
        ...state,
        loading: true,
        error: undefined
      }
    case Actions.ALL_LOOKS_SUCCESS:
      return {
        ...state,
        loading: false,
        looks: action.payload as ILook[]
      }
    case Actions.RUN_LOOK_SUCCESS:
      const { lookId, result } = action.payload as RunLookSuccess
      const newState = {
        ...state,
        loading: false,
        currentLookId: lookId,
        queries: {
          ...state.queries,
          [lookId]: result
        }
      }
      return newState
    case Actions.ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload as string
      }
    default:
        return state
    }
}
