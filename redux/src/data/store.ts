import { applyMiddleware, createStore } from 'redux'
import {sagaCallbacks, reducer} from './'
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga'

const sagaMiddleware: SagaMiddleware = createSagaMiddleware()

const registerSagas = (callbacks: any[]) => {
  callbacks.forEach((callback) => sagaMiddleware.run(callback))
}

export const configureStore = () => {
  const store: any = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
  )
  registerSagas([sagaCallbacks])
  return store
}
