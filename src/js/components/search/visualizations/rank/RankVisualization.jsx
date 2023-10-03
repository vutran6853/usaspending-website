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
            chart2 = (
                <ResponsiveBar
                    data={data}
                    keys={[
                        'hot dog',
                        'burger',
                        'sandwich',
                        'kebab',
                        'fries',
                        'donut'
                    ]}
                    indexBy="country"
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
                    fill={[
                        {
                            match: {
                                id: 'fries'
                            },
                            id: 'dots'
                        },
                        {
                            match: {
                                id: 'sandwich'
                            },
                            id: 'lines'
                        }
                    ]}
                    borderColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                1.6
                            ]
                        ]
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'country',
                        legendPosition: 'middle',
                        legendOffset: 32
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'food',
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                1.6
                            ]
                        ]
                    }}
                    legends={[
                        {
                            dataFrom: 'keys',
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemDirection: 'left-to-right',
                            itemOpacity: 0.85,
                            symbolSize: 20,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
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

        return (
            <>
                <section
                    className="results-visualization-rank-container"
                    aria-label="Spending by Category">
                    {chart}
                    {legend}
                    {tooltip}
                </section>
                <section
                    className="results-visualization-agencies-nivo"
                    aria-label="Spending by Category">
                    {chart2}
                    {legend}
                    {tooltip}
                </section>
            </>
        );
    }
}

RankVisualization.propTypes = propTypes;
RankVisualization.defaultProps = defaultProps;
