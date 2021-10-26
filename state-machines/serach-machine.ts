import { createMachine, assign } from 'xstate';
import axios from 'axios';

type SearchEvent = 
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

type SearchState = 
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
  // https://pokeapi.co/docs/v2#evolution-section/
  return axios.get(`https://pokeapi.glitch.me/v1/pokemon/${value}`);
}


const updatSearchValue = assign<SearchContext, any>({
  searchKey: (_: any, event: { value: string; }) => {
    return event.value;
  }
}) as any; 

const updateSearchResults = assign<SearchContext, any>({
  results: (_: any, event: { data: any }) => {
    console.log(event.data, 'data');
    return event.data;
  }
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
                      cond: 'isInputValid'
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
        }
    }
   }, {
    actions: {
      updatSearchValue: updatSearchValue,
      updateSearchResults: updateSearchResults
    },
    guards: {
      isInputValid: isInputValid
    }
   })
}