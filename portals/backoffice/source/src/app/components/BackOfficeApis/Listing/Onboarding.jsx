/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import LaunchIcon from '@material-ui/icons/Launch';
import OnboardingMenuCard from 'AppComponents/BackOfficeApis/Listing/components/OnboardingMenuCard.tsx';
import Configurations from 'Config';

const useStyles = makeStyles((theme) => ({
    actionStyle: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
    },
}));

/**
 * BackOffice On boarding
 *
 * @returns {void} Onboarding page for Back Office
 */
function Onboarding() {
    const classes = useStyles();

    const handleOnClick = async () => {
        console.log('click');
    };
    
    return (
        <Box id='itest-service-catalog-onboarding' pt={10}>
            <Grid
                container
                direction='row'
                justify='center'
                alignItems='center'
                spacing={5}
            >
                {/* Create BackOffice API */}
                <OnboardingMenuCard
                    iconSrc={
                        Configurations.app.context + '/site/public/images/wso2-intg-service-icon.svg'
                    }
                    heading={(
                        <FormattedMessage
                            id='BackOfficeApis.Listing.Onboarding.create.heading'
                            defaultMessage='Create BackOffice APIs'
                        />
                    )}
                    description={(
                        <FormattedMessage
                            id='BackOfficeApis.Listing.Onboarding.create.heading.text'
                            defaultMessage='Search APIs from here and publish them to BackOffice'
                        />
                    )}
                >
                    <Button
                        className={classes.actionStyle}
                        size='large'
                        id='itest-services-landing-deploy-sample'
                        variant='outlined'
                        color='primary'
                        onClick={handleOnClick}
                    >
                        <FormattedMessage
                            id='BackOfficeApis.Listing.Onboarding.create.link'
                            defaultMessage='Create BackOffice APIs'
                        />
                    </Button>
                </OnboardingMenuCard>

                {/* Read Documentation */}
                <OnboardingMenuCard
                    iconSrc={
                        Configurations.app.context + '/site/public/images/wso2-intg-service-sample-icon.svg'
                    }
                    heading={(
                        <FormattedMessage
                            id='BackOfficeApis.Listing.Onboarding.read.heading'
                            defaultMessage='Read Documentation'
                        />
                    )}
                    description={(
                        <FormattedMessage
                            id='BackOfficeApis.Listing.Onboarding.read.heading.text'
                            defaultMessage='Read more about BackOffice APIs from below documentation'
                        />
                    )}
                >
                    <Button
                        className={classes.actionStyle}
                        size='large'
                        variant='outlined'
                        color='primary'
                        href='https://apim.docs.wso2.com/en/4.1.0/design/create-api/create-an-api-using-a-service/'
                        target='_blank'
                        rel='noopener noreferrer'
                        endIcon={<LaunchIcon style={{ fontSize: 15 }} />}
                    >
                        <FormattedMessage
                            id='BackOfficeApis.Listing.Onboarding.sample.add'
                            defaultMessage='Read Documentation'
                        />
                    </Button>
                </OnboardingMenuCard>
            </Grid>
        </Box>
    );
}

export default Onboarding;
