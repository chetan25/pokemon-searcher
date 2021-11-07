/**
 * @jest-environment jsdom
 */

 import { createModel } from "@xstate/test";
 import { assign } from "xstate";
 import React from 'react';
 import { render, RenderResult, waitFor, act } from "@testing-library/react";
 import user from "@testing-library/user-event";
 import { createSearchMacine } from '../state-machines/serach-machine';
import Home from '../pages/index';
import { GlobalStateProvider } from '../hooks/machine-context';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import {DUMMY_DATA } from '../mocks/handlers';


const theme = createTheme();

type PromiseCallbacks = {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
};

type Shared = {
  getPokemonDataCallback?: PromiseCallbacks;
};

type TestCycleContext = {
  target: RenderResult;
  shared: Shared;
  setGetPokemonDataCallback: (getPokemonDataCallbacktOrderCallbacks: PromiseCallbacks) => void;
  getPokemonDataMock: jest.Mock<any, any>;
};

const getEventConfigs = () => {
  const eventConfigs = {
    ON_INPUT_FOCUS: {
      exec: async ({ target: { container, getByText } }: TestCycleContext, event: any) => {
        const inpEL = container.querySelector('#pokemon-search');
        user.click(inpEL!);
        user.clear(inpEL!);
        user.type(inpEL!, event.value);
      },
      cases: [
        {
          value: 'test'
        }
      ]
    },
    INPUT_CHANGED: {
      exec: async ({ target: { container, getByText } }: TestCycleContext, event: any) => {
        const inpEL = container.querySelector('#pokemon-search');
        user.clear(inpEL!);
        user.type(inpEL!, event.value);
      },
      cases: [
        {
          value: 'test'
        }
      ]
    },
    ON_SUBMIT: {
      exec: async ({
        target: { container },
        getPokemonDataMock,
        setGetPokemonDataCallback,
      }: TestCycleContext) => {
        const getPokemonDataPromise = new Promise((resolve, reject) => {
          setGetPokemonDataCallback({ resolve, reject });
        });
        getPokemonDataMock.mockReturnValueOnce(getPokemonDataPromise);
      
        const inpEL = container.querySelector('#pokemon-search');
        user.clear(inpEL!);
        user.type(inpEL!, 'test');

        const btnEl = container.querySelector('#search');
        user.click(btnEl!)
      },
    },
    "done.invoke.searchPokemon": {
      exec: async ({ shared: { getPokemonDataCallback } }: TestCycleContext) => {
        if (getPokemonDataCallback) {
          getPokemonDataCallback.resolve()
        }
      },
    },
    "error.platform.searchPokemon": {
      exec: async ({ shared: { getPokemonDataCallback } }: TestCycleContext) => {
        if (getPokemonDataCallback) {
          getPokemonDataCallback.reject();
        }
      },
    }
  };

  return eventConfigs;
};

const idleStateTest = {
  test: ({ target: { getByText } }: TestCycleContext) => {
    const labelEl = getByText(/Pokemon Name/i);
    expect(labelEl).toHaveAttribute('data-shrink', 'false');
  },
};


const inputFocusTest = {
  test: ({ target: { container, getByText } }: TestCycleContext) => {
    const labelEl = getByText(/Pokemon Name/i);
    expect(labelEl).toHaveAttribute('data-shrink', 'true');

    const inpEL = container.querySelector('#pokemon-search');
    expect(inpEL).toHaveValue('test');
  },
};

const onSearchSubmittingTest = {
  test: async ({ target: { getByTestId }, getPokemonDataMock }: TestCycleContext) => {
    await waitFor(() => {
      expect(getByTestId("placeholder")).toBeVisible();
    });
  },
};


const onSearchValidatinTest = {
  test: async ({ target: { getByTestId } }: TestCycleContext) => {
    await waitFor(() => {
      expect(getByTestId("placeholder")).toBeVisible();
    });
  },
};

const displayResultTest = {
  test: async ({ target: { getByTestId } }: TestCycleContext) => {
    await waitFor(() => {
      expect(getByTestId("results-container")).toBeVisible();
      expect(getByTestId("pokemon-name")).toHaveTextContent(DUMMY_DATA[0].name);
    });
  },
};

const failureTest = {
  test: async ({ target: { queryByTestId  } }: TestCycleContext) => {
    await waitFor(() => {
      expect(queryByTestId("results-container")).not.toBeInTheDocument();
    });
  },
};

 describe('Search Input should accept user input', () => {
    describe('Seaarch input should have focus on clicking', () => {
      const getPokemonDataMock = jest.fn();
      const services = {
        getPokemonData: getPokemonDataMock
      };
      const actions = {
        updateSearchResults: assign((context: any) => {
          return {
            results: DUMMY_DATA,
            testSubmitSuccessCount: context.testSubmitSuccessCount + 1
          }
        }),
        updateErrorState: assign((context: any) => {
          return {
             errorMessage: 'error',
             results: null,
             testSubmitErrorCount: context.testSubmitErrorCount + 1
          }
        }),
      }
      const testMachine = createSearchMacine('idle', '', services, actions);

      (testMachine.states.idle as any).meta = idleStateTest;
      (testMachine.states.inputFocus as any).meta = inputFocusTest;
      (testMachine.states.onSearch as any).meta = onSearchValidatinTest;
      (testMachine.states.onSearch.states.submiting as any).meta = onSearchSubmittingTest;
      (testMachine.states.displayResults as any).meta = displayResultTest;
      (testMachine.states.failure as any).meta = failureTest;
      
      const testModel = createModel(testMachine).withEvents(
        getEventConfigs() as any
      );

      const testPlans = testModel.getShortestPathPlans({
        filter: (state) =>
          state.context.testSubmitSuccessCount <= 1 &&
          state.context.testSubmitErrorCount <= 1
      })
      // Added post-generation filter to reduce combinatorial explosion
      .filter(
        (plan) =>
          plan.state.context.testSubmitSuccessCount == 1 &&
          plan.state.context.testSubmitErrorCount == 1
      );

      testPlans.forEach((plan) => {
        describe(plan.description, () => {
          plan.paths.forEach((path) => {
            it(path.description, async () => {
              const shared: Shared = {};
  
              const setGetPokemonDataCallback = (
                getPokemonDataCallback: PromiseCallbacks
              ) => {
                shared.getPokemonDataCallback = getPokemonDataCallback;
              };
  
              //@ts-ignore
              await act(() => path.test({
                target: render(
                  <GlobalStateProvider services={services} actions={actions}>
                     <ThemeProvider theme={theme}>
                     <Home />
                     </ThemeProvider>
                  </GlobalStateProvider>
                ),
                shared,
                setGetPokemonDataCallback,
                getPokemonDataMock,
              } as TestCycleContext));

              // await path.test(render(
              //     <GlobalStateProvider>
              //        <ThemeProvider theme={theme}>
              //        <Home />
              //        </ThemeProvider>
              //     </GlobalStateProvider>
              //   ));
            });
          });
        });

        it("should have full coverage", () => {
          return testModel.testCoverage({
            filter: (stateNode) => !!stateNode.meta
          });
        });
      });
    });
 })