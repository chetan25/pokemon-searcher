import type { NextPage } from 'next'
import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import styles from '../styles/search-form.module.css';
import { createSearchMacine } from '../state-machines/serach-machine';
import { useMachine} from '@xstate/react';

const SearchForm: NextPage = () => {
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

  console.log(state);
  const { searchKey } = state.context;

  const handleFocus = () => {
    send('ON_INPUT_FOCUS');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    send({
      type: 'INPUT_CHANGED',
      value: event.target.value
    });
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    send('ON_SUBMIT');
  }

  return (
        <FormControl variant="standard" className={styles.formrapper}>
        <InputLabel htmlFor="pokemon-search">Pokemon Name</InputLabel>
        <Input
            id="pokemon-search"
            value={searchKey}
            onChange={handleChange}
            onFocus={handleFocus}
            aria-describedby="pokemon-search-text"
        />
        <LoadingButton
          loading={state.matches('onSearch.submiting')}
          loadingIndicator="Searching..." 
          variant="outlined"
          onClick={handleSearch}
        >
          Search
        </LoadingButton>
    </FormControl>
  )
}

export default SearchForm
