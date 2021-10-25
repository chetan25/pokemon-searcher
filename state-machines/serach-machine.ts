import { createMachine } from 'xstate';

type SearchEvent = 
| {
    type: '',
    value: ''
};

export interface InputContext {
    value: string;
    hasError: boolean;
} 

type SearchContext = {};
type SearchState = 
| {
  value: '',
  context: InputContext
};

export const createSearchMacine = (
    id: string,
    initialState: string,
    initialContextValue: string
) => {
    // context, event, state
   return createMachine<SearchContext, SearchEvent, SearchState>({
      id: id,
      initial: initialState,
      context: {
        value: initialContextValue,
        hasError: false
      },
      states: {
         
      }
   })
}