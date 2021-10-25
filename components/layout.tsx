import Head from 'next/head'
import React from 'react';
import styles from '../styles/layout.module.css'
import Typography from '@mui/material/Typography';

const Layout = ({children}: {children: React.ReactNode}) => {
   return (
    <div className={styles.container}>
        <Head>
            <title>Pokemon Searcher</title>
            <meta name="description" content="Pokemon searcher app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <header className={styles.header}>
            <Typography variant="h4" component="h4" gutterBottom>
                Pokemon Finder
            </Typography>
        </header>
        <main className={styles.content}>
            {children}
        </main>
        <footer className={styles.footer}>
        </footer>
    </div>
   )
}

export default Layout;