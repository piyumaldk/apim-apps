import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';

import LetterGenerator from 'AppComponents/Apis/Listing/components/ImageGenerator/LetterGenerator';


const useStyles = makeStyles((theme) => ({
    root: {
        width: theme.spacing(25),
        height: theme.spacing(35),
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
            cursor: 'pointer',
        },
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
        backgroundColor: '#F6F7F9',
        backgroundSize: 'contain',
        boxShadow: '0px 1px 3px #00000033',
    },
    typeIcon: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    usageChip: {
        width: theme.spacing(5),
        // boxShadow: theme.shadows[1], // Lowest shadow
    },
}));

/**
 *
 * @returns
 */
export default function BackOfficeCard(props) {
    const { backOfficeApis } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [raised, setRaised] = React.useState(false);
    
    return (
        <Paper
            elevation={raised ? 3 : 1}
            classes={{ root: classes.root }}
            onMouseOver={() => setRaised(true)}
            onMouseOut={() => setRaised(false)}
        >
            <Link
                color='inherit'
                underline='none'
                component={RouterLink}
                to={`/service-catalog/${backOfficeApis.id}/overview`}
            >
                <CardMedia
                    className={classes.media}
                    component={LetterGenerator}
                    width={theme.spacing(25)}
                    height={theme.spacing(15)}
                    artifact={backOfficeApis}
                />
                <Box p={1} pb={0}>
                    <Tooltip placement='top-start' interactive title={backOfficeApis.name}>
                        <Typography display='block' noWrap variant='h5' component='h2'>
                            {backOfficeApis.name}
                        </Typography>
                    </Tooltip>
                    <Box pt={1} pb={3} fontFamily='fontFamily' fontSize='body2.fontSize' color='text.secondary'>
                        <FormattedMessage
                            id='ServiceCatalog.Listing.components.ServiceCard.version'
                            defaultMessage='Context'
                        />
                        <br/>
                        <b>{backOfficeApis.context}</b>
                    </Box>
                </Box>
                <Box>
                    <Grid
                        container
                        direction='row'
                        justify='space-between'
                        alignItems='center'
                    >
                        <Box pl={1}>
                            <Grid item>
                                <Chip  
                                    color='primary'
                                    label={(
                                        <Box
                                            fontFamily='fontFamily'
                                            color='text.primary'
                                        >
                                            {backOfficeApis.state}
                                        </Box>
                                    )}
                                    size='small'
                                    variant='outlined'
                                />
                            </Grid>
                        </Box>
                    </Grid>
                </Box>
            </Link>
        </Paper>
    );
}