/**
 * RankVisualization.jsx
 * Created by Kevin Li 2/2/17
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveBar } from '@nivo/bar';
import HorizontalChart from './chart/HorizontalChart';
import RankVisualizationTooltip from './RankVisualizationTooltip';
import ChartMessage from './RankVisualizationChartMessage';

const defaultProps = {
    labelSeries: [],
    dataSeries: [],
    linkSeries: [],
    descriptions: [],
    width: 0,
    loading: true,
    error: false,
    disableTooltip: false,
    urlRoot: ''
};

const propTypes = {
    dataSeries: PropTypes.array,
    linkSeries: PropTypes.array,
    descriptions: PropTypes.array,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    meta: PropTypes.object,
    disableTooltip: PropTypes.bool,
    industryCodeError: PropTypes.bool,
    recipientError: PropTypes.bool
};

export default class RankVisualization extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showTooltip: false,
            selectedItem: {}
        };

        this.selectItem = this.selectItem.bind(this);
        this.deselectItem = this.deselectItem.bind(this);
    }

    selectItem(data) {
        if (this.props.disableTooltip) {
            return;
        }

        this.setState({
            showTooltip: true,
            selectedItem: data
        });
    }

    deselectItem() {
        if (this.props.disableTooltip) {
            return;
        }

        this.setState({
            showTooltip: false
        });
    }

    render() {
        let chart = (<ChartMessage message="No data to display" />);
        let chart2 = (<ChartMessage message="No data to display" />);

        let legend = null;
        if (this.props.loading) {
            chart = (<ChartMessage message="Loading data..." />);
            chart2 = (<ChartMessage message="Loading data..." />);
        }
        else if (this.props.error) {
            chart = (<ChartMessage message="An error has occurred." />);
            chart2 = (<ChartMessage message="An error has occurred." />);
            if (this.props.industryCodeError) {
                chart = (<ChartMessage message="Industry codes are unavailable for Sub-Awards." />);
                chart2 = (<ChartMessage message="Industry codes are unavailable for Sub-Awards." />);
            }
            else if (this.props.recipientError) {
                chart = (<ChartMessage message="Paging to 10,000 records and above is not available for Spending by Recipient." />);
                chart2 = (<ChartMessage message="Paging to 10,000 records and above is not available for Spending by Recipient." />);
            }
        }
        else if (this.props.dataSeries.length > 0) {
            const itemHeight = 35;
            // Height is number of results * item height + 30px padding
            const height = (this.props.dataSeries.length * itemHeight) + 30;
            chart = (
                <HorizontalChart
                    {...this.props}
                    itemHeight={itemHeight}
                    height={height}
                    selectItem={this.selectItem}
                    deselectItem={this.deselectItem} />
            );
            // would be better to have an array of objects here
            const dataStuff = [];
            if (this.props.dataSeries.length === this.props.labelSeries.length) {
                for (let i = 0; i < this.props.dataSeries.length; i++) {
                    dataStuff.push({
                        data: this.props.dataSeries[i],
                        label: this.props.labelSeries[i],
                        desc: this.props.descriptions[i],
                        link: this.props.linkSeries[i]
                    });
                }
            }

            chart2 = (
                <ResponsiveBar
                    data={dataStuff}
                    indexBy={dataStuff.label}
                    margin={{
                        top: 50, right: 130, bottom: 50, left: 60
                    }}
                    padding={0.5}
                    layout="horizontal"
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={{ scheme: 'greys' }}
                    defs={[
                        {
                            id: 'dots',
                            type: 'patternDots',
                            background: 'inherit',
                            color: '#38bcb2',
                            size: 4,
                            padding: 1,
                            stagger: true
                        },
                        {
                            id: 'lines',
                            type: 'patternLines',
                            background: 'inherit',
                            color: '#eed312',
                            rotation: -45,
                            lineWidth: 6,
                            spacing: 10
                        }
                    ]}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={null}
                    axisLeft={null}
                    legends={null}
                    role="application"
                    ariaLabel="Nivo bar chart demo" />
            );
            legend = (
                <div className="visualization-legend">
                    <div className="visualization-legend__circle" />
                    <div className="visualization-legend__label">
                        Amount Obligated
                    </div>
                </div>
            );
        }

        let tooltip = null;
        if (this.state.showTooltip) {
            tooltip = (<RankVisualizationTooltip
                {...this.state.selectedItem}
                {...this.props.meta} />);
        }
/*
                <section
                    className="results-visualization-rank-container"
                    aria-label="Spending by Category">
                    {chart}
                    {legend}
                    {tooltip}
                </section>
*/
        return (
            <>
                <div
                    style={{ height: "200px" }}
                    className="results-visualization-agencies-nivo"
                    aria-label="Spending by Category NIVO">
                    {chart2}
                </div>
            </>
        );
    }
}

RankVisualization.propTypes = propTypes;
RankVisualization.defaultProps = defaultProps;
