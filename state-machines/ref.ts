import { createMachine, assign, Interpreter } from 'xstate';


export type InputInsacne<T> = Interpreter<InputContext<T>, InputStateSchema<T>, InputEvent<T>>;

export interface InputContext<T> {
    value: T;
    hasError: boolean;
} 
  
type InputStateSchema<T> = 
| {
    value: 'idle';
    context: InputContext<T>
  }
| {
    value: 'focus';
    context: InputContext<T>
}
| {
    value: 'onSubmit';
    context: InputContext<T>
} | {
    value: 'onSubmit.submitting';
    context: InputContext<T>
} | {
    value: 'onSubmit.success';
    context: InputContext<T>
} | {
    value: 'onSubmit.failure';
    context: InputContext<T>
} | {
    value: 'success.done';
    context: InputContext<T>
};  
  
type InputEvent<T> = 
 | {
    type: 'INPUT_CHANGED';
    value: T
} | {
    type: 'ON_RETRY',
} | {
    type: 'ON_FOCUS'
} | {
    type: 'ON_SUBMIT'
};


const updatInputValue = assign<InputContext<any>, any>({
    value: (_: any, event: { value: any; }) => {
      return event.value;
    }
}) as any;  

const checkInputState = assign<InputContext<any>, any>({
    hasError: (ctx: any) => {
        return ctx.value && ctx.value.length < 3 ? true : false
    } 
});

const submitUser = <T>(value: T) => {
    return fetch('/login', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: value})
    });
}


export const createLoginMachine = <T>(id: string, initialState: string, initialContextValue: T) => {
    return createMachine<InputContext<T>, InputEvent<T>, InputStateSchema<T>>({
        id: id,
        initial: initialState,
        context: {
          value: initialContextValue,
          hasError: false
        },
        states: {
            idle: {
                on: {
                    'ON_FOCUS': 'focus'
                }
            },
            focus: {
                // always: [
                //     {
                //         target: 'valid',
                //         cond: 'isInputValid'
                //     },
                // ],
                on: {
                    'INPUT_CHANGED': [
                        {
                          actions: ['updatInputValue', 'checkInputState'],
                        }
                    ]
                }
            },
            onSubmit: {
               initial: 'submitting',
               states: {
                    submitting: {
                        invoke: {
                            id: 'getUser',
                            src: (context) => submitUser<T>(context.value as T),
                            onDone: {
                              target: 'success',
                              actions: 'updateGlobalState'
                            },
                            onError: {
                              target: 'failure',
                            //   actions: assign({ error: (context, event) => event.data })
                            }
                        }
                    },
                    success: { },
                    failure: {
                        on: {
                            ON_RETRY: 'submitting'
                        }
                    }
                }
            }
        },
        on: {  
            'ON_SUBMIT':  {
                target: 'onSubmit',
                cond: 'isFormValid'
            }
        }
    }, {
        actions: {
            updatInputValue: updatInputValue,
            checkInputState: checkInputState,
            // updateGlobalState: updateGlobalState
        },
        guards: {
            // can provide default implementatin here
            isFormValid: (context: any) => {
                return context.value && context.value.length > 3; 
            }
            // isInputValid: (context) => { 
            //     return nameValid<string>(context.value);
            // },
            // isInputInValid: (context) => { 
            //     return nameValid<string>(context.value);
            // },
        } 
    });
} 