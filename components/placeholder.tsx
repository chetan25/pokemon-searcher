
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
   placeholderWrapper: {
    flexGrow: 1,
    margin: '5rem',
    [theme.breakpoints.down('sm')]: {
        margin: '5rem 2rem',
        width: '100%'
      },
   },
   imageHolder: {
    width: '300px',
    height: '300px',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        height: '100%'
      },
   }
}));

const DisplayPlaceholder = () => {
    const styles = useStyles();

    return (
        <Box className={styles.placeholderWrapper} data-testid="placeholder">
            <Grid container spacing={1}>
                <Grid item xs={5}>
                   <Skeleton variant="rectangular" className={styles.imageHolder} />
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ pt: 0.5 }}>
                        <Skeleton width="30%" />
                        <Skeleton width="80%" />
                        <Skeleton width="80%" />
                        <Skeleton width="80%" />
                        <Skeleton width="80%" />
                        <Skeleton width="80%" />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default DisplayPlaceholder;