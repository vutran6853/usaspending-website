import React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const CustomTick = (props) => {
    const {
        x, y, payload, link
    } = props;

    const offsetY = payload.value.length < 33 ? -10.5 : -21;
    const screenSizeMd = window.innerWidth < 993;

    return (
        <g transform={`translate(${x},${y})`} >
            <a href={`${link[payload.index].link}`}>
                <foreignObject x={screenSizeMd ? -130 : -230} y={offsetY} dy={0} textAnchor="end" fill="#666" width={230} height={42}>
                    <div className="hellow" >{payload.value}</div>
                </foreignObject>
            </a>
        </g>);
};

const SpendingByCategoriesChart = (props) => {
    const dataStuff = [];
    if (props.dataSeries?.length === props.labelSeries?.length) {
        for (let i = 0; i < props.dataSeries.length; i++) {
            dataStuff.push({
                value: props.dataSeries[i],
                label: props.labelSeries[i],
                desc: props.descriptions[i],
                link: props.linkSeries[i]
            });
        }
    }

    return (
        <div className="recharts-time-visualization-container">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={dataStuff}
                    layout="vertical"
                    barCategoryGap={10}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 200,
                        bottom: 10
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                        type="category"
                        dataKey="label"
                        tick={<CustomTick link={dataStuff} />}
                        fontSize="12px"
                        link="link" />
                    {/* todo - tooltips in next ticket */}
                    {/* <Tooltip /> */}
                    <Bar dataKey="value" fill="#8884d8" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SpendingByCategoriesChart;

