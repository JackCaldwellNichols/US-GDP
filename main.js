import { max } from 'd3';
import './style.css'




let req = new XMLHttpRequest();

let svg;

const height = 500
const width = 900
const padding = {
  x: 60,
  y: 30
}

const createTitle = () => {
  return d3.select('main')
          .append('title')
          .attr('id', 'title')
          .text('US GDP')
}


const createCanvas = () => {
  const svg = d3.select('main')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
      
    return svg
}


const createTooltip = () => {
  return d3.select('body')
          .append('div')
          .attr('id', 'tooltip')
}

const sendRequest = (req) => {
  const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  req.open("GET", url,true);
  return req
}



const defineScales = (dates, gdps) => {
  console.log(gdps)
  const minDate = d3.min(dates, (d) => new Date(d));
  const maxDate = d3.max(dates, (d) => new Date(d))
  const maxGdp = d3.max(gdps, (d) => d)
  const xScale = d3.scaleTime()
                  .domain([minDate, maxDate])
                  .range([0, width - padding.x])

  const yScale = d3.scaleLinear()
                  .domain([0, maxGdp])
                  .range([height - padding.y, padding.y])

  return {xScale, yScale}

}

const createAxes = (scales, svg) => {
  svg.append('g')
      .attr('id', 'x-axis')
      .call(d3.axisBottom(scales.xScale))
      .attr('transform', `translate(${padding.x}, ${height - padding.y})`)

  svg.append('g')
      .attr('id', 'y-axis')
      .call(d3.axisLeft(scales.yScale))
      .attr('transform', `translate(${padding.x})`)
      .attr('class', 'tick')
}


const createBars = (dates, gdps, scales) => {
      svg.selectAll('rect')
          .data(gdps)
          .enter()
          .append('rect')
          .attr('x', (d, i) => scales.xScale(new Date(dates[i])))
          .attr('y', (d) => scales.yScale(d))
          .attr('width', ( width - padding.x * 1.33) / gdps.length )
          .attr('height', (d) => height - scales.yScale(d) - padding.y)
          .attr('transform', `translate(${padding.x})`)
          .attr('class', 'bar')
          .attr('data-date', (d, i) => dates[i])
          .attr('data-gdp', (d) => d)
          .on('mouseover', (e, d) => {
            let billion = d.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1')
            d3.select('#tooltip')
              .style('opacity', 0.85)
              .style('left', e.pageX + 6 + 'px')
              .style('top', e.pageY + 6 + 'px')
              .html(`<p>Date: ${dates[gdps.indexOf(d)]}</p><p>$${billion} billion</p>`)
              .attr('data-date', dates[gdps.indexOf(d)])
          })
          .on('mouseout', () => {
            return d3.select('#tooltip')
                      .style('opacity', 0)
                      .style('left', 0)
                      .style('top', 0)
          })
}


req.onload = () => {
  const dates = []
  const gdps = []
  const dataset = JSON.parse(req.responseText)
  dataset.data.forEach(element => {
      gdps.push(element[1])
      dates.push(element[0])

  });
  const scales = defineScales(dates, gdps)
  createAxes(scales, svg)
  createBars(dates, gdps, scales)
  //createSourceLinkAndDate(dataset)
}

const starter = () => {
  createTitle()
  svg = createCanvas()
  createTooltip()
  req = sendRequest(req)
  req.send()
}


starter()



