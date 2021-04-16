/**
 * About.jsx
 * Created by Mike Bray 11/20/2017
 **/

import React from 'react';
import { PageHeader } from 'data-transparency-ui';

import { aboutPageMetaTags } from 'helpers/metaTagHelper';
import { getStickyBreakPointForSidebar } from 'helpers/stickyHeaderHelper';

import Footer from 'containers/Footer';
import Header from 'containers/shared/HeaderContainer';

import MetaTags from '../sharedComponents/metaTags/MetaTags';

import AboutContent from './AboutContent';

require('pages/about/aboutPage.scss');

export default class About extends React.Component {
    render() {
        return (
            <div className="usa-da-about-page">
                <MetaTags {...aboutPageMetaTags} />
                <Header />
                <PageHeader title="About" stickyBreakPoint={getStickyBreakPointForSidebar()}>
                    <main
                        id="main-content"
                        className="main-content">
                        <AboutContent />
                    </main>
                    <Footer />
                </PageHeader>
            </div>
        );
    }
}
