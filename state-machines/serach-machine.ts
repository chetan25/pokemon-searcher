import { createMachine, assign } from 'xstate';
import axios from 'axios';

export type SearchEvent = 
| {
    type: 'ON_VALID_INPUT'
} | {
  type: 'ON_INPUT_FOCUS'
} | {
  type: 'INPUT_CHANGED',
  value: string;
} | {
  type: 'ON_SUBMIT'
};

export interface SearchContext {
  searchKey: string;
  results: any;
  errorMessage: string | null;
} 

export type SearchState = 
| {
  value: 'idle';
  context: SearchContext
}
| {
  value: 'inputFocus';
  context: SearchContext
}
| {
  value: 'onSearch';
  context: SearchContext
} | {
  value: 'onSearch.validating';
  context: SearchContext
} | {
  value: 'onSearch.submiting';
  context: SearchContext
} | {
  value: 'failure';
  context: SearchContext
} | {
  value: 'displayResults';
  context: SearchContext
};  


const searchPokemon = (value: string) => {
  return axios.get(`/api/pokemon/${value}`);
}


const updatSearchValue = assign<SearchContext, any>({
  searchKey: (_: any, event: { value: string; }) => {
    return event.value;
  }
}) as any; 

const updateSearchResults = assign<SearchContext, any>({
  results: (_: any, event: { data: any }) => {
   
    return event.data.data.pokemon;
  }
});

const updateErrorState = assign<SearchContext, any>({
  results: (_: any, event: { data: any }) => {
    return null;
  },
  errorMessage: (_: any, event:any) => {
    return event.data.message;
  },
})

const resetResults = assign<SearchContext, any>({
  results: (_: any, event: { data: any }) => {
    return null;
  },
});

const isInputValid = (context: SearchContext) => {
  return context.searchKey && context.searchKey.length > 1 ? true : false;
}

export const createSearchMacine = (
    initialState: string,
    initialContextValue: string
) => {
    // context, event, state
   return createMachine<SearchContext, SearchEvent, SearchState>({
      id: 'searchMachine',
      initial: initialState,
      context: {
        searchKey: initialContextValue,
        results: null,
        errorMessage: null
      },
      states: {
        idle: { },
        inputFocus: {
          on: {
            'INPUT_CHANGED': [
              {
                actions: ['updatSearchValue']
              }
            ]
          }
        },
        onSearch: {
          id: 'onSearch',
          initial: 'validating',
          states: {
            validating: {
              always: [
                  {
                      target: 'submiting',
                      cond: 'isInputValid',
                      actions: 'resetResults'
                  },
                  {
                    target: '#searchMachine.inputFocus',
                  },
              ],
            },
            submiting: {
              invoke: {
                id: 'searchPokemon',
                src: (context: SearchContext) => searchPokemon(context.searchKey),
                onDone: {
                  target: '#searchMachine.displayResults',
                  actions: 'updateSearchResults'
                },
                onError: {
                  target: '#searchMachine.failure',
                  actions: 'updateErrorState'
                }
              }
            },
          }
        },
        displayResults: { },
        failure: {
          on: {
              // ON_RETRY: 'submitting'
          }
        }
      },
      on: {  
        'ON_SUBMIT':  {
            target: 'onSearch'
        },
        'ON_INPUT_FOCUS': 'inputFocus'
    }
   }, {
    actions: {
      updatSearchValue: updatSearchValue,
      updateSearchResults: updateSearchResults,
      updateErrorState: updateErrorState,
      resetResults: resetResults
    },
    guards: {
      isInputValid: isInputValid
    }
   })
}