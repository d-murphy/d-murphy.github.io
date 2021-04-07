
const marginC4 = {top: 30, right: 15, bottom: 20, left: 35}
const widthC4 = 1214 - marginC4.left - marginC4.right;
const heightC4 = 294 - marginC4.top - marginC4.bottom;


const svg4 = d3.select('#chart4')

const chart4 = svg4.append('g')
    .attr('class', 'bars')
    .attr('transform', `translate(${marginC4.left}, ${marginC4.top})`);

const yScaleC4 = d3.scaleBand()
    .domain([6,5,4,3,2,1,0])
    .range([heightC4, 0])
    .padding(0.2)

const weekdayLut = { 0: "Su", 1: "M", 2:"Tu", 3:"W", 4:"Th", 5:"F", 6:"Sa"}

chart4.append('g')
  .call(d3.axisLeft(yScaleC4)
    .tickFormat((d) => weekdayLut[d]));

const xScaleC4 = d3.scaleBand()
  .domain(d3.range(40))
  .range([0, widthC4])
  .padding(0.2)

const mthLUT = { 0: "July", 5: "Aug", 10:"Sept", 14: "Oct", 
                18:"Nov", 23:"Dec", 27:"Jan", 32:"Feb", 36:"Mar"}

chart4.append('g')
  .attr('transform', `translate(0, ${heightC4})`)
  .call(d3.axisBottom(xScaleC4).
    tickFormat((d) => mthLUT[d])
    .tickSize(0)
  );

const colorScale = d3.scaleLinear()
  .domain([0,d3.max(timelinePlotData, d => d.mileage)])
  .range(["#EEE", "#69b3a2"])


chart4
  .append("g")
  .selectAll("rect")
  .data(timelinePlotData)
  .join("rect")
    .attr('x', d => xScaleC4(d.weekNum))
    .attr('y', d => yScaleC4(d.weekPos))
    .attr('height', yScaleC4.bandwidth())
    .attr('width', xScaleC4.bandwidth() )
    .attr('fill', d => colorScale(d.mileage))
  .on('mouseover', function(event, d) {
    var tt4X = event.x - 70
    var tt4Y = event.pageY - (d.mileage>0 ? 110 : 50)
    d3.select("#chart4tt")
      .style("left", tt4X + "px")
      .style("top", tt4Y + "px")
      .html(d.mileage == 0 ? `0 miles` : 
            `<b>${new Date(d.date).getMonth()+1}/${new Date(d.date).getDate()}/${new Date(d.date).getFullYear()} 
            ${new Date(d.date).getHours()}:${new Date(d.date).getMinutes() < 10 ? 
            "0" + new Date(d.date).getMinutes() : new Date(d.date).getMinutes() }</b></br>
            Mileage: ${d.mileage}</br>Avg Mile: ${d.averageStr}</br>(Total: ${d.timeMinsString})`)
      .classed("hidden", false)
  })
  .on("mouseout", function() {
    d3.select("#chart4tt").classed("hidden", true)
  })

  chart4.append('text')
    .attr('x', widthC4 / 2 )
    .attr('y', -.02*heightC4)
    .attr('text-anchor', 'middle')
    .text(`Timeline of ${Object.keys(runLUT).length} Runs`)

