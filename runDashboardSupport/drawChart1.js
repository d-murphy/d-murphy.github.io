const margin = {top: 35, right: 15, bottom: 30, left: 35}
const width = 394 - margin.left - margin.right;
const height = 294 - margin.top - margin.bottom;

var groupKey = "monthSort";
var keys = ['numRuns', 'mileage'];

const svg1 = d3.select('#chart1')

const chart1 = svg1.append('g')
    .attr('class', 'bars')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(monthlyTotals, d => d.mileage)])
    .range([height, 0])

chart1.append('g')
  .call(d3.axisLeft(yScale));

const xScale = d3.scaleLinear()
  .domain([d3.min(monthlyTotals, d => d.monthSort)-.5, 
           d3.max(monthlyTotals, d => d.monthSort)+.5])  
  .range([0, width])

var barWidth = (width / monthlyTotals.length)-10 ;

const xScale2 = d3.scaleBand()
  .domain(keys)
  .rangeRound([0, barWidth])
  .padding(0.05)

monthLUT = {"7": "Jul 20", "8": "Aug 20", "9": "Sep 20", "10": "Oct 20", "11": "Nov 20", "12": "Dec 20", 
            "13": "Jan 21", "14": "Feb 21", "15": "Mar 21"};

chart1.append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(xScale).tickFormat((d) => monthLUT[d]));


chart1
  .append("g")
  .selectAll('g')
  .data(monthlyTotals)
  .join("g")
    .attr("transform", d=> `translate(${xScale(d[groupKey])},0)`)
  .selectAll("rect")
  .data(d => keys.map(key => ({key, value: {value: d[key], groupKey: d[groupKey] }})))
  .join("rect")
    .attr('x', (d) => xScale2(d.key) - xScale2.bandwidth())
    .attr('y', (d) => yScale(d.value.value))
    .attr('height', (d) => height - yScale(d.value.value))
    .attr('width', xScale2.bandwidth() )
    .attr('fill', (d) => d.key=='numRuns' ? "#000" : "#888")
  .on('mouseover', function(event, d) {
    var tt1X = event.x - 60 - 10
    var tt1Y = yScale(d.value.value) + margin.top 
    d3.select("#chart1tt")
      .style("left", tt1X + "px")
      .style("top", tt1Y + "px")
      .html(`<b>${monthLUT[d.value.groupKey]}</b></br>
              ${d.key == "numRuns" ? "# of Runs" : "Mileage"}: ${Math.round(10 * d.value.value)/10}`)
      .classed("hidden", false)
  })
  .on("mouseout", function() {
    d3.select("#chart1tt").classed("hidden", true)
  })

  chart1.append('text')
    .attr('x', width / 2 )
    .attr('y', -.05*height)
    .attr('text-anchor', 'middle')
    .text('# of Runs and Mileage')