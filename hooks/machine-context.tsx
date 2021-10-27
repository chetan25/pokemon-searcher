import React, { createContext, useContext } from "react";
import { createSearchMacine, SearchContext, SearchEvent, SearchState } from '../state-machines/serach-machine';
import { useMachine } from '@xstate/react';
import { State } from 'xstate';

export type StoreState =  State<SearchContext, SearchEvent, any, SearchState>;
export type StoreDispatch = any;

const StoreContext = createContext<[StoreState, StoreDispatch]>([
    {} as StoreState,
    () => {}
]);

export const GlobalStateProvider = ({children}: {children: React.ReactNode}) => {
    const searchMachine = createSearchMacine(
        'idle',
        ''
    );
    
    const [state, send] = useMachine(searchMachine, {
        // services: {
        // }
        // actions: {
        // }
    });

    return (
        <StoreContext.Provider value={[state, send]}>
          {children}
        </StoreContext.Provider>
      );
}

export const useGlobalStore = () => {
    return useContext(StoreContext);
};
  
