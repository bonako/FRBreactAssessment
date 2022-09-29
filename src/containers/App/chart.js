import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const Charts = ({ graphData, units }) => {
  const [data, setData] = useState(graphData || []);

  useEffect(() => {
    setData(graphData);
  }, [graphData]);

  useEffect(() => {
    if (data && data.length > 0) {
      graphFunc(data);
    }
  }, [data]);

  return (
    <div
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '30px auto',
      }}
    >
      <div className={'graph-heading-text-y-axis'}>
        <div style={{ rotate: '-90deg' }}>{units}</div>
      </div>
      <div>
        <div id="my_dataviz"></div>
      </div>
    </div>
  );
};

export function graphFunc(data) {
  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  let svg;
  svg = d3
    .select('#my_dataviz')
    .append('svg')
    .attr(
      'viewBox',
      `0 0 ${width + margin.left + margin.right} ${
        height + margin.top + margin.bottom
      }`,
    )
    // .attr('width', width + margin.left + margin.right)
    // .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  //Read the data
  // Now I can use this dataset:
  const x = d3
    .scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return d.date;
      }),
    )
    .range([0, width]);
  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain([
      d3.min(data, function (d) {
        return +d.value;
      }),
      d3.max(data, function (d) {
        return +d.value;
      }),
    ])
    .range([height, 0]);
  svg.append('g').call(d3.axisLeft(y));

  // Add the line
  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr(
      'd',
      d3
        .line()
        .x(function (d) {
          return x(d.date);
        })
        .y(function (d) {
          return y(d.value);
        }),
    );
}

export default Charts;
