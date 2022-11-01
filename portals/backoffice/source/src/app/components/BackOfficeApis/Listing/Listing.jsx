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

import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Progress } from 'AppComponents/Shared';
import ResourceNotFound from 'AppComponents/Base/Errors/ResourceNotFound';
// import Alert from 'AppComponents/Shared/Alert';
// import ServiceCatalog from 'AppData/ServiceCatalog';
import Onboarding from 'AppComponents/BackOfficeApis/Listing/Onboarding';
import Alert from 'AppComponents/Shared/Alert';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import BackOfficeApisTopMenu from 'AppComponents/BackOfficeApis/Listing/components/BackOfficeApisTopMenu';

/**
 * Listing for service catalog entries
 *
 * @function Listing
 * @returns {any} Listing Page for Services
 */
function Listing() {
    const [backOfficeData, setBackOfficeData] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isGridView, setIsGridView] = useState(true);
    const intl = useIntl();

    // Get Services
    const getData = (limit = 25, offset = 0) => {
        // mock-fetch
        const url = new URL(`https://virtserver.swaggerhub.com/SanojPunchihewa/BackOfficeAPI/1.0.0/backoffice-apis`);
        const params = { limit, offset };
        url.search = new URLSearchParams(params);
        fetch(url).then(response => response.json()).then((data) => {
            setBackOfficeData(data);
            // eslint-disable-next-line no-console
            console.log(data);
        }).catch((error) => {
            if (error.response) {
                Alert.error(error.response.body.description);
            } else {
                Alert.error(intl.formatMessage({
                    defaultMessage: 'Error while loading BackOffice APIs',
                    id: 'BackOfficeApis.Listing.Listing.error.loading',
                }));
            }
            const { status } = error;
            if (status === 404) {
                setNotFound(true);
            }
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(getData, []);

    if (loading || !backOfficeData) {
        return <Progress per={90} message='Loading BackOffice APIs ...' />;
    }
    if (notFound) {
        return <ResourceNotFound response={0}/>;
    }

    // This count should be null when no BackOffice APIs and should be >0 when have. (Length)
    const haveBackOfficeData = backOfficeData.list.length !== 0;
    
    return (
        <Box flexGrow={1}>
            <Grid
                container
                direction='column'
                justify='flex-start'
                alignItems='stretch'
            >
                <Grid xs={12}>
                    <BackOfficeApisTopMenu
                        showBackOfficeApiToggle={haveBackOfficeData}
                        isGridView={isGridView}
                        totalBackOfficeApis='5'
                        setIsGridView={setIsGridView}
                    />
                </Grid>
                <Box px={4} pt={4}>
                    <Grid xs={12}>
                        {!haveBackOfficeData && <Onboarding />}
                        {haveBackOfficeData && (isGridView
                            ? (
                                <h1>BackOffice API Page Gird View</h1>
                            )
                            : <h1>BackOffice API Page Table View</h1>)}
                    </Grid>
                </Box>
            </Grid>
        </Box>
    );
}

export default Listing;