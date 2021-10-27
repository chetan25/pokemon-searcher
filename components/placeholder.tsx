
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const DisplayPlaceholder = () => {
    return (
        <Box sx={{ flexGrow: 1, margin: '5rem' }}>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                   <Skeleton variant="rectangular" width={300} height={300} />
                </Grid>
                <Grid item xs={9}>
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