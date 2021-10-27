import type { NextPage } from 'next'
import React from 'react';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import { useGlobalStore } from '../hooks/machine-context';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
  formContainer: {
    gridTemplateColumns: 'auto auto',
    display: 'grid',
    width: '50%',
    gridGap: '1rem',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    },
  },
}));


const SearchForm: NextPage = () => {
  const [state, send] = useGlobalStore();
  const { searchKey } = state.context;
  const styles = useStyles();

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
    <FormControl variant="standard" className={styles.formContainer}>
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
