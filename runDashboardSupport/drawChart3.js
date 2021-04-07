// margin, width, height not defined and instead used from drawChart1.js

const svg3 = d3.select('#chart3')

const chart3 = svg3.append('g')
    .attr('class', 'bars')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const yScaleC3 = d3.scaleLinear()
    .domain([d3.min(monthlyTotals, d => d.avgMile)-.25, 
             d3.max(monthlyTotals, d => d.avgMile)+.25])
    .range([height, 0])

chart3.append('g')
  .call(d3.axisLeft(yScaleC3)
    .ticks(4)
  );

const xScaleC3 = d3.scaleLinear()
  .domain([d3.min(monthlyTotals, d => d.monthSort)-.5, 
           d3.max(monthlyTotals, d => d.monthSort)+.5])  
  .range([0, width])

chart3.append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(xScaleC3))

yVals = monthlyTotals.map(d => d.avgMile)
xMin = d3.min(monthlyTotals.map(d => d.monthSort))
  
// a blank rect to catch pointer events
svg3.append("rect")
  .attr("width", width-10)
  .attr("height", height + margin.top + margin.bottom)
  .attr('transform', `translate(${margin.left+10}, ${margin.top})`)
  .style("fill", "none")
  .style("pointer-events", "all")
  .on("mouseover", function() { d3.select("#chart3tt").classed("hidden", false) })
  .on("mouseout", function() { d3.select("#chart3tt").classed("hidden", true) })
  .on("mousemove", function (event, d) {
    var xPosInChart = Math.round(xScaleC3.invert(event.layerX)) - 1
    var tt3Y = yVals[xPosInChart - xMin]
    var tt3X = event.x
    d3.select("#chart3tt")
    .style("left", tt3X - 60 + "px")
    .style("top", yScaleC3(tt3Y)+20 + "px")
    .html(`<b>${monthLUT[xPosInChart]}</b></br>Average Mile: ${Math.round(yVals[xPosInChart - xMin]*100)/100}`)
})

chart3
  .append("path")
  .datum(monthlyTotals)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x( d => xScaleC3(d.monthSort))
    .y( d => yScaleC3(d.avgMile))
  )

chart3.append('text')
  .attr('x', width / 2 )
  .attr('y', -.05*height)
  .attr('text-anchor', 'middle')
  .text('Average Mile by Month')