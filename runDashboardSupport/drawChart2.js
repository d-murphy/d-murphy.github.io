// margin, width, height not defined and instead used from drawChart1.js

const svg2 = d3.select('#chart2')

const chart2 = svg2.append('g')
    .attr('class', 'bars')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const yScaleC2 = d3.scaleLinear()
    .domain([d3.min(runsTimeAndDistance, d => d.average)-.25, 
             d3.max(runsTimeAndDistance, d => d.average)+.25])
    .range([height, 0])

chart2.append('g')
  .call(d3.axisLeft(yScaleC2)
    .ticks(4)
  );

const xScaleC2 = d3.scaleLinear()
  .domain([d3.min(runsTimeAndDistance, d => d.mileage)-.5, 
           d3.max(runsTimeAndDistance, d => d.mileage)+.5])  
  .range([0, width])

chart2.append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(xScaleC2))


chart2
  .append("g")
  .selectAll("dot")
  .data(runsTimeAndDistance)
  .enter()
  .append("circle")
    .attr("cx", d => xScaleC2(d.mileage))
    .attr("cy", d => yScaleC2(d.average))
    .attr("r", 5)
    .attr('opacity', .5)
    .style("fill", "#69b3a2")

  .on('mouseover', function(event, d) {
    var tt2X = event.x - 80
    var tt2Y = yScaleC2(d.average) + margin.bottom - 35
    d3.select("#chart2tt")
      .style("left", tt2X + "px")
      .style("top", tt2Y + "px")
      .html(`<b>${new Date(d.date).getMonth()+1}/${new Date(d.date).getDate()}/${new Date(d.date).getFullYear()} 
                ${new Date(d.date).getHours()}:${new Date(d.date).getMinutes() < 10 ? 
                    "0" + new Date(d.date).getMinutes() : new Date(d.date).getMinutes() }</b></br>
                Mileage: ${d.mileage}</br>Avg Mile: ${d.averageStr}</br>(Total: ${d.timeMinsString})`)
      .classed("hidden", false)
  })
  .on("mouseout", function() {
    d3.select("#chart2tt").classed("hidden", true)
  })

  chart2.append('text')
    .attr('x', width / 2 )
    .attr('y', -.05*height)
    .attr('text-anchor', 'middle')
    .text('Average Mile Speed and Mileage')