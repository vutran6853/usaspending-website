/**
 * SearchSidebarv2.jsx
 * Created by Andrea Blackwell 11/05/2024
 **/

import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { SearchFilterCategories, FilterCategoryTree } from "dataMapping/search/newSearchFilterCategories";
import * as SidebarHelper from 'helpers/sidebarHelper';


// these are for the SearchFilter demo
import SearchFilter from "./SearchFilter";
import { SearchSidebarSubmitContainer } from "../../containers/search/SearchSidebarSubmitContainer";
import {TimePeriodContainer} from "../../containers/search/filters/TimePeriodContainer";

const SearchSidebar = (props) => {
    const [hide, setHide] = useState(false);
    const [drilldown, setDrilldown] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(1);

    const toggleHide = (e) => {
        e.preventDefault();
        setHide((prevState) => !prevState);
    };

    const setLevel2 = (e, item) => {
        setSelectedCategory(item);
        setDrilldown(FilterCategoryTree[item?.categoryKey]);
        setCurrentLevel(2);
    };

    const setLevel3 = (component) => {
        setDrilldown(component);
        setCurrentLevel(3);
    }

    const goBack = (e) => {
        console.log(currentLevel);
        if (currentLevel === 2) {
            e.preventDefault();
            setDrilldown(null);
            setCurrentLevel(1);
        } else if (currentLevel === 3) {
            setDrilldown(selectedCategory[FilterCategoryTree[selectedCategory?.categoryKey]]);
            setCurrentLevel(2);
        };

        if (currentLevel === 1) {
            console.log("log an error message");
        }

    };

    useEffect(() => {
        if (drilldown) {
            console.log(selectedCategory);
        }
    }, [drilldown]);

    return <>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <div onClick={(e) => toggleHide(e)}>hide / show</div>
        {/* finish filter category tree with each category mapping to components and display each filter correctly */}
        {/* format second level and third level panels */}
        {/* add transition to drilldown / opening new panels */}
        {/* style with back button */}
        {/* style with round button and docked/closed position */}
        <div className="search-sidebar" id="slide" style={hide ? { display: 'none' } : null}>
            {drilldown !== null ?
                <div>
                    <p>drilldown level - {currentLevel}</p>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <div onClick={(e) => goBack(e)}>Back</div>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    { drilldown?.children?.map((item) => <div onClick={(e)=> setLevel3(item.component)}>{item.title}</div>) }
                    { drilldown?.component }
                </div>
                :
                <>
                    <div className="search-sidebar--header">Search by...</div>
                    {SearchFilterCategories.map((item) => <SearchFilter
                        item={item}
                        iconName={item.iconName}
                        iconColor={item.iconColor}
                        iconBackgroundColor={item.iconBackgroundColor}
                        title={item.title}
                        description={item.description}
                        itemCount={item.itemCount}
                        selectedItems={item.selectedItems}
                        selectCategory={setLevel2} />)}
                </>
            }
            <div className="sidebar-bottom-submit v2">
                <SearchSidebarSubmitContainer />
            </div>
        </div>
    </>;
};

// SearchSidebar.propTypes = propTypes;
// SearchSidebar.defaultProps = defaultProps;

export default SearchSidebar;
