import '../styles/globals.css'
import type { AppProps } from 'next/app';
import  {useEffect } from 'react';
// import Layout from '../components/layout';
import { GlobalStateProvider } from '../hooks/machine-context';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import dynamic from 'next/dynamic';

const Layout = dynamic(() => import('../components/layout'), {
  ssr: false
});


if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const { worker } = require('../mocks/browser')
  worker.start()
}  else {
  const { server  } = require("../mocks/server");
  server.listen();
}

const theme = createTheme();

function MyApp({ Component, pageProps }: AppProps) {

  return <GlobalStateProvider>
     <ThemeProvider theme={theme}>
       <Layout><Component {...pageProps} /></Layout>
      </ThemeProvider>
  </GlobalStateProvider>
}
export default MyApp
