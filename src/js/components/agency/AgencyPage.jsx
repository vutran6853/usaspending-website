/**
 * AgencyPage.jsx
 * Created by Maxwell Kendall 01/31/2020
 */

import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { throttle } from "lodash";
import {
    ComingSoon,
    ErrorMessage,
    FiscalYearPicker,
    ShareIcon
} from 'data-transparency-ui';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useQueryParams } from 'helpers/queryParams';

import { getStickyBreakPointForSidebar } from 'helpers/stickyHeaderHelper';
import { agencyPageMetaTags } from 'helpers/metaTagHelper';
import { scrollToY } from 'helpers/scrollToHelper';
import { getBaseUrl, handleShareOptionClick } from 'helpers/socialShare';

import Sidebar from 'components/sharedComponents/sidebar/Sidebar';
import AgencySection from './AgencySection';
import AgencyOverview from './overview/AgencyOverview';
import AwardSpendingSubagency from './awardSpending/AwardSpendingSubagency';
import StatusOfFunds from './statusOfFunds/StatusOfFunds';
import PageWrapper from '../sharedComponents/PageWrapper';
import PageTitle from './overview/PageTitle';

require('pages/agency/index.scss');

const scrollPositionOfSiteHeader = getStickyBreakPointForSidebar();

const propTypes = {
    selectedFy: PropTypes.string,
    latestFy: PropTypes.number,
    setSelectedFy: PropTypes.func,
    isError: PropTypes.bool,
    isLoading: PropTypes.bool,
    errorMessage: PropTypes.string,
    agencySlug: PropTypes.string
};

export const AgencyProfileV2 = ({
    selectedFy,
    setSelectedFy,
    isError,
    errorMessage,
    isLoading,
    latestFy,
    agencySlug
}) => {
    const history = useHistory();
    const query = useQueryParams();

    const { pathname, search } = useLocation();
    const path = `${pathname.substring(1)}${search}`;

    const [activeSection, setActiveSection] = useState(query.section || 'overview');
    const { name } = useSelector((state) => state.agency.overview);

    const dataThroughDates = useSelector((state) => state.agency.dataThroughDates);
    const overviewDataThroughDate = dataThroughDates?.overviewDataThroughDate;
    const statusDataThroughDate = dataThroughDates?.statusDataThroughDate;
    const awardSpendingDataThroughDate = dataThroughDates?.awardSpendingDataThroughDate;

    const handleShare = (optionName) => {
        handleShareOptionClick(optionName, path, {
            subject: `USAspending.gov Agency Profile: ${name}`,
            body: `View the spending activity for this Agency on USAspending.gov: ${getBaseUrl(path)}`
        });
    };

    const backgroundColor = {
        backgroundColor: "#1a4480"
    };

    const sections = [
        {
            name: 'overview',
            display: 'Overview',
            icon: 'landmark',
            dataThroughDate: overviewDataThroughDate,
            component: <AgencyOverview fy={selectedFy} dataThroughDate={overviewDataThroughDate} />
        },
        {
            name: 'status-of-funds',
            display: 'Status of Funds',
            icon: 'money-check-alt',
            dataThroughDate: statusDataThroughDate,
            component: <StatusOfFunds fy={selectedFy} />
        },
        {
            name: 'sub-agency',
            display: 'Award Spending',
            icon: 'hand-holding-usd',
            dataThroughDate: awardSpendingDataThroughDate,
            component: <AwardSpendingSubagency fy={`${selectedFy}`} />
        }
    ];

    const jumpToSection = (section = '') => {
        // we've been provided a section to jump to
        // check if it's a valid section
        const matchedSection = sections.find((obj) => obj.name === section);
        if (!matchedSection) {
            // no matching section
            return;
        }

        // find the section in dom
        const sectionDom = document.querySelector(`#agency-v2-${matchedSection.name}`);
        if (!sectionDom) {
            return;
        }

        // add section to url
        history.replace(`${history.location.pathname}${history.location.search}&section=${section}`);

        // update the state
        // setActiveSection(matchedSection.name);
        setActiveSection(section);

        // add offsets
        if (activeSection === 'overview') {
            scrollToY(sectionDom.offsetTop - 150, 700);
        }
        else {
            // scrollY set to the top of the section, subtracting the height of sticky elements + 20px of margin
            scrollToY(sectionDom.offsetTop - 86, 700);
        }
    };

    useEffect(throttle(() => {
        // this allows the page to jump to a section on page load, when
        // using a link to open the page
        // prevents a console error about react unmounted component leak
        let isMounted = true;
        if (isMounted) {
            const urlSection = query.section;
            if (urlSection) {
                jumpToSection(urlSection);
            }
        }
        return () => {
            isMounted = false;
        };
    }, 100), [history, query.section]);

    return (
        <PageWrapper
            pageName="Agency Profile"
            classNames="usa-da-agency-page-v2"
            overLine="Agency Profile"
            title={name}
            metaTagProps={isLoading ? {} : agencyPageMetaTags({ id: agencySlug, name })}
            toolBarComponents={[
                <FiscalYearPicker backgroundColor={backgroundColor} selectedFy={selectedFy} latestFy={latestFy} handleFyChange={(fy) => setSelectedFy({ fy })} />,
                <ShareIcon url={getBaseUrl(path)} onShareOptionClick={handleShare} />
            ]}>
            <main id="main-content" className="main-content usda__flex-row">
                <div className="sidebar usda__flex-col">
                    <Sidebar
                        pageName="agency-v2"
                        fixedStickyBreakpoint={scrollPositionOfSiteHeader}
                        isGoingToBeSticky
                        active={activeSection}
                        jumpToSection={jumpToSection}
                        detectActiveSection={setActiveSection}
                        sections={sections.map((section) => ({
                            section: section.name,
                            label: section.display
                        }))} />
                </div>
                <div className="body usda__flex-col">
                    <PageTitle fy={selectedFy} />
                    {isError
                        ? <ErrorMessage description={errorMessage} />
                        : sections.map((section) => (
                            <AgencySection key={section.name} section={section} isLoading={isLoading} icon={section.icon} dataThroughDate={section.dataThroughDate}>
                                {section.component || <ComingSoon />}
                            </AgencySection>
                        ))}
                </div>
            </main>
        </PageWrapper>
    );
};

AgencyProfileV2.propTypes = propTypes;

export default AgencyProfileV2;
