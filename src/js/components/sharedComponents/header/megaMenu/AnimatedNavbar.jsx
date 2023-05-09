import React, { Component } from "react";
import { Flipper } from "react-flip-toolkit";
import {
    spendingOptions,
    profileOptions,
    learnResourceOptions,
    referenceMaterialsOptions,
    developerOptions,
    awardDownloadOptions,
    accountDataOptions,
    allDownloadOptions
} from 'dataMapping/navigation/menuOptions';
import Navbar from "./Navbar";
import DropdownContainer from "./DropdownContainer";
import NavbarItem from './NavbarItem';
import ItemContent from './ItemContent';

const navbarConfig = [
    {
        title: "Search Award Data",
        url: '/search'
    },
    {
        title: "Explore the Data",
        section1Items: spendingOptions,
        section2Items: profileOptions,
        dropdown: ItemContent,
        section1Title: "Spending Explorer",
        section1Sub: "Annual federal spending through three different starting points",
        section2Title: "Profiles",
        section2Sub: "Federal spending through interactive snapshots"
    },
    {
        title: "Download the Data",
        section1Items: awardDownloadOptions,
        section2Items: accountDataOptions,
        section3Items: allDownloadOptions,
        dropdown: ItemContent,
        section1Title: "Award Data",
        section2Title: "Account Data",
        section3Title: "All Data",
        section1Sub: "Data about contracts, grants, loans, and other awards that the federal government has made",
        section2Sub: "Data from agency financial submissions, covering both award and non-award spending"
    },
    {
        title: "Find Resources",
        section1Items: learnResourceOptions,
        section2Items: referenceMaterialsOptions,
        section3Items: developerOptions,
        dropdown: ItemContent,
        section1Title: "Learn",
        section2Title: "Reference Materials",
        section3Title: "For Developers"
    }
];

export default class AnimatedNavbar extends Component {
    state = {
        activeIndices: []
    };

    onMouseEnter = (i) => {
        if (this.animatingOutTimeout) {
            clearTimeout(this.animatingOutTimeout);
            this.resetDropdownState(i);
            return;
        }

        if (this.state.activeIndices[this.state.activeIndices.length - 1] === i) {
            return;
        }

        this.setState((prevState) => ({
            activeIndices: prevState.activeIndices.concat(i),
            animatingOut: false
        }));
    };
    onMouseLeave = () => {
        this.setState({
            animatingOut: true
        });
        this.animatingOutTimeout = setTimeout(
            this.resetDropdownState,
            this.props.tweenConfig.duration
        );
    };

    resetDropdownState = (i) => {
        this.setState({
            activeIndices: typeof i === "number" ? [i] : [],
            animatingOut: false
        });
        delete this.animatingOutTimeout;
    };

    render() {
        const { tweenConfig } = this.props;

        let CurrentDropdown;
        let PrevDropdown;
        let direction;
        let currentSection1Props;
        let currentSection2Props;
        let currentSection3Props;
        let prevSection1Props;
        let prevSection2Props;
        let prevSection3Props;

        let currentSection1Title;
        let currentSection2Title;
        let currentSection3Title;
        let currentSection1Sub;
        let currentSection2Sub;
        let currentSection3Sub;

        const currentIndex = this.state.activeIndices[
            this.state.activeIndices.length - 1
        ];
        const prevIndex =
            this.state.activeIndices.length > 1 &&
            this.state.activeIndices[this.state.activeIndices.length - 2];

        if (typeof currentIndex === "number") {
            CurrentDropdown = navbarConfig[currentIndex]?.dropdown;
            currentSection1Props = navbarConfig[currentIndex].section1Items;
            currentSection2Props = navbarConfig[currentIndex].section2Items;
            currentSection3Props = navbarConfig[currentIndex].section3Items;

            currentSection1Title = navbarConfig[currentIndex].section1Title;
            currentSection2Title = navbarConfig[currentIndex].section2Title;
            currentSection3Title = navbarConfig[currentIndex].section3Title;

            currentSection1Sub = navbarConfig[currentIndex].section1Sub;
            currentSection2Sub = navbarConfig[currentIndex].section2Sub;
            currentSection3Sub = navbarConfig[currentIndex].section3Sub;
        }
        else if (typeof prevIndex === "number") {
            PrevDropdown = navbarConfig[prevIndex].dropdown;
            prevSection1Props = navbarConfig[prevIndex].section1Items;
            prevSection2Props = navbarConfig[prevIndex].section2Items;
            prevSection3Props = navbarConfig[prevIndex].section3Items;

            direction = currentIndex > prevIndex ? "right" : "left";
        }

        return (
            <Flipper flipKey={currentIndex} {...tweenConfig}>
                <Navbar onMouseLeave={this.onMouseLeave}>
                    {navbarConfig.map((n, index) => (
                        <NavbarItem
                            title={n.title}
                            index={index}
                            url={n.url}
                            closeDropdown={this.onMouseLeave}
                            onMouseEnter={this.onMouseEnter}>
                            {currentIndex === index && (
                                <DropdownContainer
                                    direction={direction}
                                    animatingOut={this.state.animatingOut}
                                    tweenConfig={this.props.tweenConfig}>
                                    <CurrentDropdown
                                        section1Items={currentSection1Props}
                                        section2Items={currentSection2Props}
                                        section3Items={currentSection3Props}
                                        section1Title={currentSection1Title}
                                        section2Title={currentSection2Title}
                                        section3Title={currentSection3Title}
                                        section1Sub={currentSection1Sub}
                                        section2Sub={currentSection2Sub}
                                        section3Sub={currentSection3Sub} />
                                    {PrevDropdown && <PrevDropdown section1Items={prevSection1Props} section2Items={prevSection2Props} section3Items={prevSection3Props} />}
                                </DropdownContainer>
                            )}
                        </NavbarItem>
                    ))}
                </Navbar>
            </Flipper>
        );
    }
}
