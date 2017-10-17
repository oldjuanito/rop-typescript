import * as ReactDOM from 'react-dom'

export type InitFunc<StateType> = () => StateType
export type DispatcherFunc<MsgType> = (newMsg: MsgType) => void
export type AsyncCmd<MsgType> = (dispatcher: DispatcherFunc<MsgType>) => void
export type UpdateFunc<StateType, MsgType> = (state: StateType, newMsg: MsgType) => [StateType, AsyncCmd<MsgType>[]]
export type ViewFunc<StateType, MsgType> = (dispatcher: DispatcherFunc<MsgType>, state: StateType) => JSX.Element

export class ElmishApp<StateType, MsgType> {
    private prevState: StateType
    constructor(private init: InitFunc<StateType>, 
                private update: UpdateFunc<StateType, MsgType>, 
                private view: ViewFunc<StateType, MsgType>) {
        this.start = this.start.bind(this)
    }
    start(rootElem: HTMLElement) {
        
        // now we just need to connect the pieces.
        this.prevState = this.init()
        // when we get an action, we want to update the state and re-render the ui
        const dispatch: DispatcherFunc<MsgType> = (action) => {
          const [ newState, asyncCmds ] = this.update(this.prevState, action)
          ReactDOM.render(this.view(dispatch, newState), rootElem)
          this.prevState = newState
          for (let cmdIdx = 0; cmdIdx < asyncCmds.length; cmdIdx++) {
            asyncCmds[cmdIdx](dispatch)
          }

        }
        // the initial render
        ReactDOM.render(this.view(dispatch, this.prevState), rootElem)
    }
}