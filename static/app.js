var svgWidth = 960;
var svgHeight = 600;
var margin = {top: 20, right: 40, bottom: 80, left: 100};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var chart = svg.append('g');

  d3.csv('../dataset/data.csv', function(err, fileData) {
  if (err) throw err;
  //console.log(fileData[0])

  fileData.forEach(function(data) {
    data.populationBelowPovertyLevel = +data.populationBelowPovertyLevel;
    data.activeVeteranNum = +data.activeVeteranNum;
    //console.log(data)
  });

  // Create scale functions
  var yLinearScale = d3.scaleLinear().range([height, 0]);
  var xLinearScale = d3.scaleLinear().range([0, width]);
  
  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  
  // Scale the domain
  xLinearScale.domain([
    20,
    d3.max(fileData, function(data) {
      return +data.populationBelowPovertyLevel;
    }),
  ]);
  yLinearScale.domain([
    0,
    d3.max(fileData, function(data) {
      return +data.activeVeteranNum * 1.2;
    }),
  ]);

  var toolTip = d3
    .tip()
    .attr('class', 'tooltip')
    .offset([80, -60])
    .html(function(data) {
      var location = data.geography;
      var population_poverty = +data.populationBelowPovertyLevel;
      var numVeteran = +data.activeVeteranNum;
      return (
        'Location: '+ location + '<br># below poverty: ' + population_poverty + '<br># of veterans: ' + numVeteran
      );
    });
  chart.call(toolTip);
  
  chart
    .selectAll('circle')
    .data(fileData)
    .enter()
    .append('circle')
    .attr('cx', function(data, index) {
      //console.log(data)
      return xLinearScale(data.populationBelowPovertyLevel);
    })
    .attr('cy', function(data, index) {
      return yLinearScale(data.activeVeteranNum);
    })
    .attr('r', '15')
    .attr('fill', 'pink')
    .on('click', function(data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on('mouseout', function(data, index) {
      toolTip.hide(data);
    });
  chart
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);
  
    chart.append('g').call(leftAxis);
  
  chart
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left + 40)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .attr('class', 'axisText')
    .text('Number Of veterans in the state');
  // Append x-axis labels
  chart
    .append('text')
    .attr(
      'transform',
      'translate(' + width/2  + ' ,' + (height + margin.top + 40) + ')',
    )
    .attr('class', 'axisText')
    .text('Population below poverty');
});