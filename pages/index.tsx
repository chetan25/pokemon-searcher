import type { NextPage } from 'next'
import SearchForm from '../components/search-form';
import DisplayPlaceholder from '../components/placeholder';
import { useGlobalStore} from '../hooks/machine-context';
import DisplayResults from '../components/display';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({ 
  errorMessagee: {
    margin: '3rem'
  }
}));

const Error = () => {
  const styles = useStyles();
  return (
    <Alert severity="error" className={styles.errorMessagee}>
      <AlertTitle>Error</AlertTitle>
      Error fetching pokemon details — <strong>check if the pokemon name is correct!</strong>
  </Alert>
  )
}
const Home: NextPage = () => {
  const [state] = useGlobalStore();
  const { results } = state.context;

  return (
    <div>
      <SearchForm />
      {
        state.matches('onSearch.submiting')  ?  <DisplayPlaceholder /> : null 
      }
      {
        results && !state.matches('onSearch.submiting') ? <DisplayResults /> : null
      }
      {
        state.matches('failure') ? <Error /> : null
      }
    </div>
  )
}

export default Home
