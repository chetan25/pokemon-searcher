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
  testSubmitSuccessCount: number;
  testSubmitErrorCount: number
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


export const searchPokemon = (value: string) => {
  console.log('sdsdsdds');
  return axios.get(`/api/pokemon/${value}`);
}


const updatSearchValue = assign<SearchContext, any>({
  searchKey: (_: any, event: { value: string; }) => {
    return event.value;
  }
}) as any; 

const updateSearchResults = assign<SearchContext, any>({
  results: (_: any, event: { data: any }) => {
    console.log(event, 'event');
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

export const getMachineDefinition = (initialState: string, initialContextValue: string) => {
    return {
      id: 'searchMachine',
      initial: initialState,
      context: {
        searchKey: initialContextValue,
        results: null,
        errorMessage: null,
        testSubmitSuccessCount: 0,
        testSubmitErrorCount: 0
      },
      states: {
        idle: { 
          on: {
            'ON_INPUT_FOCUS': 'inputFocus'
          }
        },
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
                src: 'getPokemonData',
                onDone: {
                  target: '#searchMachine.displayResults'
                },
                onError: {
                  target: '#searchMachine.failure'
                }
              }
            },
          }
        },
        displayResults: { 
          entry: 'updateSearchResults',
          on: {
            'INPUT_CHANGED': [
              {
                actions: ['updatSearchValue']
              }
            ]
          }
        },
        failure: {
          entry: 'updateErrorState',
          on: {
              // ON_RETRY: 'submitting'
          }
        }
      },
      on: { 
        'ON_INPUT_FOCUS': 'inputFocus', 
        'ON_SUBMIT':  {
            target: 'onSearch'
        }
      }
    }
}

export const machineActions = {
  updatSearchValue: updatSearchValue,
    updateSearchResults: updateSearchResults,
    updateErrorState: updateErrorState,
    resetResults: resetResults
}
 
 export const machineGaurds = {
  isInputValid: isInputValid
 }

export const createSearchMacine = (
    initialState: string,
    initialContextValue: string,
    services: {
      getPokemonData: any
    } = {
      getPokemonData: (context: SearchContext) => searchPokemon(context.searchKey)
    },
    overrideActions: {} = {}
) => {
   
  const machineDefinition = getMachineDefinition(initialState, initialContextValue)
    // context, event, state
   return createMachine<SearchContext, SearchEvent, SearchState>(
     machineDefinition, {
      actions: {
        ...machineActions,
        ...overrideActions
      },
      guards: machineGaurds,
      services: {
       ...services
      }
    }
   )
}