import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useGlobalStore } from '../hooks/machine-context';
import Image from 'next/image';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
    pokemonName: {
        textAlign: 'center',
        marginTop: '1rem'
    },
  displayWrapper: {
    flexGrow: 1, 
    margin: '5rem',
    border: '2px solid grey',
    [theme.breakpoints.down('sm')]: {
      border: 'none',
      margin: '2rem',
      width: '100%'
    },
  },
  gridContainer: {
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'center'
    }
  },
  imageGrid: {
      [theme.breakpoints.down('sm')] : {
        display: 'flex',
        maxWidth: '100%',
        textAlign: 'center',
        maxHeight: '60vh'
      }
  },
  imageItem: {
    margin: '0 auto',
    maxWidth: '20rem',
    maxHeight: '20rem',
     [theme.breakpoints.down('sm')]: {
        maxWidth: '80%',
        maxHeight: '40%',
     }
  },
  listGrid: {
    [theme.breakpoints.down('sm')]: {
        maxWidth: '100%',
        width: '100%', 
     }
  },
  listInner: {
    marginLeft: '3rem',
    [theme.breakpoints.down('sm')]: {
        marginLeft: 'unset',
     }
  },
  textMargin: {
    marginTop: '0.5rem'
  }
}));

// import styles from '../styles/display.module.css';



const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2),
  },
}));


const DisplayResults = () => {
    const styles =useStyles();
    const [state] = useGlobalStore();
    const { results } = state.context;
    const pokemonData = results[0];
   

    const myLoader = ({ src, width, quality }: {
        src: string; width: number | undefined; quality?: number;
    }) => {
        return `${pokemonData.sprite}?w=${width}&q=${quality || 75}`
    }

      
    return (
        <Box className={styles.displayWrapper} data-testid="results-container">
            {/* <Box sx={{ flexGrow: 1, border: '2px solid grey', padding: '2rem', minHeight: '80vh' }}> */}
                <Grid container spacing={1} className={styles.gridContainer}>
                    <Grid item xs={5} className={styles.imageGrid}>
                        <Box className={styles.imageItem}>
                            <Image
                                loader={myLoader}
                                layout="responsive"
                                src="me.png"
                                alt={`Picture of ${pokemonData.name}`}
                                width={300}
                                height={300}
                            />
                           <Typography  data-testid="pokemon-name" variant="h3" gutterBottom component="h3" className={styles.pokemonName}>
                              {pokemonData.name}
                            </Typography>
                            <Typography variant="subtitle2" gutterBottom component="p">
                               {pokemonData.description}
                            </Typography>
                        </Box>
                    
                    </Grid>
                    <Grid item xs={7} className={styles.listGrid}>
                        <Box sx={{ pt: 0.5 }} className={styles.listInner}>
                            <Root>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                      primary={
                                        <Divider>
                                           <Chip label="Species" color="success"/>
                                        </Divider>
                                      }
                                      secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline', fontSize: '1.2em' }}
                                                variant="caption"
                                                gutterBottom
                                                component="span"
                                                color="text.primary"
                                                className={styles.textMargin}
                                            >
                                               {pokemonData.species}
                                            </Typography>
                                            {/* {" — I'll be in your neighborhood doing errands this…"} */}
                                        </>
                                    }
                                    />
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                      primary={
                                        <Divider>
                                           <Chip label="Type" color="success"/>
                                        </Divider>
                                      }
                                      secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline', fontSize: '1.2em' }}
                                                variant="caption"
                                                gutterBottom
                                                component="span"
                                                color="text.primary"
                                                className={styles.textMargin}
                                            >
                                               {pokemonData.types.join(',')}
                                            </Typography>
                                            {/* {" — I'll be in your neighborhood doing errands this…"} */}
                                        </>
                                    }
                                    />
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                      primary={
                                        <Divider>
                                           <Chip label="Abilities" color="success"/>
                                        </Divider>
                                      }
                                      secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline', fontSize: '1.2em' }}
                                                variant="caption"
                                                gutterBottom
                                                component="span"
                                                color="text.primary"
                                                className={styles.textMargin}
                                            >
                                               {
                                                   Object.keys(pokemonData.abilities).map(key => {
                                                       const abilities = pokemonData.abilities[key].join(', ');
                                                       const abilityKey = key.charAt(0).toUpperCase() + key.slice(1)
                                                       return (
                                                           <span key={key}>{`${abilityKey} abilities are ${abilities}`}</span>
                                                        )
                                                   })
                                               }
                                            </Typography>
                                            {/* {" — I'll be in your neighborhood doing errands this…"} */}
                                        </>
                                    }
                                    />
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                      primary={
                                        <Divider>
                                           <Chip label="Egg Groups" color="success"/>
                                        </Divider>
                                      }
                                      secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline', fontSize: '1.2em' }}
                                                variant="caption"
                                                gutterBottom
                                                component="span"
                                                color="text.primary"
                                                className={styles.textMargin}
                                            >
                                               {pokemonData.eggGroups.join(',')}
                                            </Typography>
                                        </>
                                    }
                                    />
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                      primary={
                                        <Divider>
                                           <Chip label="Legendary" color="success"/>
                                        </Divider>
                                      }
                                      secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline', fontSize: '1.2em' }}
                                                variant="caption"
                                                gutterBottom
                                                component="span"
                                                color="text.primary"
                                                className={styles.textMargin}
                                            >
                                              {
                                                  `Is ${pokemonData.legendary ? 'a' : 'not a'} Legendary Pokemon`
                                              }
                                            </Typography>
                                        </>
                                    }
                                    />
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                      primary={
                                        <Divider>
                                           <Chip label="Mythical " color="success"/>
                                        </Divider>
                                      }
                                      secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline', fontSize: '1.2em' }}
                                                variant="caption"
                                                gutterBottom
                                                component="span"
                                                color="text.primary"
                                                className={styles.textMargin}
                                            >
                                              {
                                                  `Is ${pokemonData.mythical ? 'a' : 'not a'} Mythical Pokemon`
                                              }
                                            </Typography>
                                        </>
                                    }
                                    />
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                      primary={
                                        <Divider>
                                           <Chip label="Evolution Stage" color="success"/>
                                        </Divider>
                                      }
                                      secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline', fontSize: '1.2em' }}
                                                variant="caption"
                                                gutterBottom
                                                component="span"
                                                color="text.primary"
                                                className={styles.textMargin}
                                            >
                                              {
                                                  `Is a ${pokemonData.family.evolutionStage} stage evolution of pokemon`
                                              }
                                            </Typography>
                                        </>
                                    }
                                    />
                                </ListItem>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                      primary={
                                        <Divider>
                                           <Chip label="Evolution" color="success"/>
                                        </Divider>
                                      }
                                      secondary={
                                        <Stepper nonLinear activeStep={1}>
                                           {
                                               pokemonData.family.evolutionLine.map((name: string) => {
                                                   return (
                                                    <Step key={name}>
                                                        <Typography
                                                            sx={{ display: 'inline', fontSize: '1.2em' }}
                                                            variant="caption"
                                                            gutterBottom
                                                            component="span"
                                                            className={styles.textMargin}
                                                            color={pokemonData.name === name ? 'blue' :  "text.primary"}
                                                        >
                                                         {name}
                                                        </Typography>
                                                    </Step>
                                                   )
                                               })
                                           }
                                        </Stepper>
                                    }
                                    />
                                </ListItem>
                            </List>
                            </Root>
                        </Box>
                    </Grid>
                </Grid>
            {/* </Box>     */}
        </Box>
    )
}

export default DisplayResults;