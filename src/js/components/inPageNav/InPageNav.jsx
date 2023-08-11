/**
 * InPageNav.jsx
 * Created by Andrea Blackwell 08/09/2023
 **/

import React, { useEffect, useState, useRef } from 'react';
import { throttle } from "lodash";
import { tabletScreen, mediumScreen } from 'dataMapping/shared/mobileBreakpoints';


const aboutSections = [
    {
        section: 'mission',
        label: 'Mission'
    },
    {
        section: 'background',
        label: 'Background'
    },
    {
        section: 'development',
        label: 'Development and Releases'
    },
    {
        section: 'licensing',
        label: 'Licensing'
    },
    {
        section: 'more-info',
        label: 'More Information'
    },
    {
        section: 'contact',
        label: 'Contact'
    },
    {
        section: 'mission2',
        label: 'Mission2'
    },
    {
        section: 'background2',
        label: 'Background2'
    },
    {
        section: 'development2',
        label: 'Development and Releases2'
    },
    {
        section: 'licensing2',
        label: 'Licensing2'
    },
    {
        section: 'more-info2',
        label: 'More Information2'
    },
    {
        section: 'contact2',
        label: 'Contact2'
    },
    {
        section: 'mission3',
        label: 'Mission3'
    },
    {
        section: 'background3',
        label: 'Background3'
    },
    {
        section: 'development3',
        label: 'Development and Releases3'
    },
    {
        section: 'licensing3',
        label: 'Licensing3'
    },
    {
        section: 'more-info3',
        label: 'More Information3'
    },
    {
        section: 'contact3',
        label: 'Contact3'
    }
];

const InPageNav = () => {
    const [windowWidth, setWindowWidth] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < tabletScreen);
    const navBar = useRef(null);

    const checkOverflow = (el) => {
        const isOverflowing = el.clientWidth < el.scrollWidth
            || el.clientHeight < el.scrollHeight;

        return isOverflowing;
    };

    /* check if the left chevron should show */
    const isScrolledLeft = () => {
        // how far to scroll left
        // first hidden element should scroll to 
    };

    function isHidden(el) {
        console.log(el);
        let hidden = false;
        const box = el.getBoundingClientRect();
        const documentWidth = document.documentElement.offsetWidth;
        console.log(el.offsetParent === null)

        // replace the document width with the width of the in page nav container element
        if (box.left < 0 || box.right > documentWidth) {
            console.log("hidden element", el);
            hidden = true;
        }
        // return (el.offsetParent === null);
        return hidden;
    }

    /* check which elements are visible and which ones are not */

    useEffect(() => {
        const handleResize = throttle(() => {
            const newWidth = window.innerWidth;
            if (windowWidth !== newWidth) {
                /* check if ref is in overflow*/
                // console.log(checkOverflow(navBar.current));
                // console.log(navBar.current.childNodes[0].childNodes);
                navBar.current.childNodes[0].childNodes.forEach((el) => {
                    isHidden(el);
                });
                setWindowWidth(newWidth);
                setIsMobile(newWidth < mediumScreen);
            }
        }, 50);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [windowWidth]);

    return (
        <nav className="in-page-nav-wrapper" ref={navBar}>
            <ul>
                {aboutSections.map((section) => (<li className="in-page-nav__element"><a href="">{section.label}</a> | </li>))}
            </ul>
        </nav>
    );
};

export default InPageNav;
