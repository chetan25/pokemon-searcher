import type { NextPage } from 'next'
import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import styles from '../styles/search-form.module.css';

const SearchForm: NextPage = () => {
  const [name, setName] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
        <FormControl variant="standard" className={styles.formrapper}>
        <InputLabel htmlFor="component-helper">Name</InputLabel>
        <Input
            id="component-helper"
            value={name}
            onChange={handleChange}
            aria-describedby="component-helper-text"
        />
        <Button variant="outlined">Search</Button>
    </FormControl>
  )
}

export default SearchForm
