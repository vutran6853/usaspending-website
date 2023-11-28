/**
 * AgencyPage.jsx
 * Created by Maxwell Kendall 01/31/2020
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    ComingSoon,
    ErrorMessage,
    FiscalYearPicker,
    ShareIcon
} from 'data-transparency-ui';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useQueryParams } from 'helpers/queryParams';

import { agencyPageMetaTags } from 'helpers/metaTagHelper';
import { getBaseUrl, handleShareOptionClick } from 'helpers/socialShare';
import { stickyHeaderHeight } from 'dataMapping/stickyHeader/stickyHeader';
import { getStickyBreakPointForSidebar } from 'helpers/stickyHeaderHelper';

import AgencySection from './AgencySection';
import AgencyOverview from './overview/AgencyOverview';
import AwardSpendingSubagency from './awardSpending/AwardSpendingSubagency';
import StatusOfFunds from './statusOfFunds/StatusOfFunds';
import PageWrapper from '../sharedComponents/PageWrapper';
import PageTitle from './overview/PageTitle';

require('pages/agency/index.scss');

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
    const { isStatusOfFundsChartLoaded } = useSelector((state) => state.agency);

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
            section: 'overview',
            label: 'Overview',
            icon: 'landmark',
            dataThroughDate: overviewDataThroughDate,
            component: <AgencyOverview fy={selectedFy} dataThroughDate={overviewDataThroughDate} />
        },
        {
            section: 'status-of-funds',
            label: 'Status of Funds',
            icon: 'money-check-alt',
            dataThroughDate: statusDataThroughDate,
            component: <StatusOfFunds fy={selectedFy} />
        },
        {
            section: 'award-spending',
            label: 'Award Spending',
            icon: 'hand-holding-usd',
            dataThroughDate: awardSpendingDataThroughDate,
            component: <AwardSpendingSubagency fy={`${selectedFy}`} />
        }
    ];

    const jumpToSection = (section = '') => {
        // we've been provided a section to jump to
        // check if it's a valid section
        const matchedSection = sections.find((obj) => obj.section === section);
        if (!matchedSection) {
            // no matching section
            return;
        }

        // find the section in dom
        const sectionDom = document.querySelector(`#agency-v2-${matchedSection.section}`);
        if (!sectionDom) {
            return;
        }

        // add section to url
        if (!window.location.href.includes(`section=${section}`)) {
            history.replace(`${history.location.pathname}?section=${section}`);
        }

        // update the state
        setActiveSection(section);

        // add offsets
        const conditionalOffset = window.scrollY < getStickyBreakPointForSidebar() ? stickyHeaderHeight : 10;
        const sectionTop = (sectionDom.offsetTop - stickyHeaderHeight - conditionalOffset);
        window.scrollTo({
            top: sectionTop - 24,
            left: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        if (isStatusOfFundsChartLoaded && query.section) {
            jumpToSection(query.section);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query.section, isStatusOfFundsChartLoaded]);

    return (
        <PageWrapper
            pageName="Agency Profile"
            classNames="usa-da-agency-page-v2"
            overLine="Agency Profile"
            title={name}
            metaTagProps={isLoading ? {} : agencyPageMetaTags({ id: agencySlug, name })}
            sections={sections}
            jumpToSection={jumpToSection}
            activeSection={activeSection}
            extraHeightInHeader
            toolBarComponents={[
                <FiscalYearPicker backgroundColor={backgroundColor} selectedFy={selectedFy} latestFy={latestFy} handleFyChange={(fy) => setSelectedFy({ fy })} />,
                <ShareIcon url={getBaseUrl(path)} onShareOptionClick={handleShare} />
            ]}>
            <main id="main-content" className="main-content usda__flex-row">
                <div className="body usda__flex-col">
                    <PageTitle fy={selectedFy} />
                    {isError
                        ? <ErrorMessage description={errorMessage} />
                        : sections.map((section) => (
                            <AgencySection key={section.section} section={section} isLoading={isLoading} icon={section.icon} dataThroughDate={section.dataThroughDate}>
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
