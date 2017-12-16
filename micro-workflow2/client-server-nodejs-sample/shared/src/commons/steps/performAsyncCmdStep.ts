import { PropInfoTxtInput } from '../presentation/viewTypes'
import { pass } from '../rop/rop'
import { createStepFunc } from '../workflowStepMappers'
import { SyncWorkflowStep } from '../workflowStep'

export interface AsyncCmd<Context, AsyncResult> {
    readonly promise: Promise<AsyncResult>,
    readonly successMsgSetter: (context: Context, result: AsyncResult) => Context,
    readonly failureMsgSetter: (context: Context, reason: any) => Context,

}

export function performAsyncCmdStep<Context>(props: PropInfoTxtInput[],
                                             cmdsGetter: ((context: Context) => AsyncCmd<Context, {}>[]),
                                             workFlowStarter: (context: Context) => void): SyncWorkflowStep<Context> {
    const startCmdFunc = (context: Context) => {

        const cmds = cmdsGetter(context)
        for (let cmdIdx = 0; cmdIdx < cmds.length; cmdIdx++) {
            const cmd = cmds[cmdIdx];
            cmd.promise
                .then((result) => {
                        const newcontext = cmd.successMsgSetter(context, result)
                        workFlowStarter(newcontext)
                    }
                )
                .catch((reason) => {
                        const newcontext = cmd.failureMsgSetter(context, reason)
                        workFlowStarter(newcontext)
                    }
                )
        }
        return pass(context)
    }
    const step = createStepFunc<Context, Context, Context>({
            func: startCmdFunc,
            name: 'performAsyncCmdStep'
        }
    )
    return step
}