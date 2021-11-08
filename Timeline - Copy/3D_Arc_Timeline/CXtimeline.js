let state = {
    current: 'timeline',
}

let data = {
    // probably do objects with speaker and speaker size
    // [ {speaker: 'Lehi', size: '3.5', ... }, ... {}, {} ]
    speakers: [
        {name: 'Lehi', size: 20},
        {name: 'Nephi', size: 20},
        {name: 'Jacob', size: 20},
        {name: 'Enos', size: 20},
        {name: 'Alma', size: 20},
        {name: 'Abinadi', size: 20},
        {name: 'Ammon', size: 20},
        {name: 'Korihor', size: 20},
        {name: 'Mormon', size: 20},
        {name: 'Moroni', size: 20},
        // "Lehi", "Nephi", "Jacob", "Enos", "Alma", "Abinadi", "Ammon", "Korihor", "Mormon", "Moroni",
    
    ],
    connections: [
        { source: 0, target: [1, 2, 4, 9]},
        { source: 1, target: [0, 2, 4]},
        { source: 2, target: [0, 1, 3, 4]},
        { source: 3, target: [2]},
        { source: 4, target: [0, 1, 2, 5]},
        { source: 5, target: [4, 6, 8]},
        { source: 6, target: [5, 7]},
        { source: 7, target: [6, 8]},
        { source: 8, target: [5, 7]},
        { source: 9, target: [0]},
        ],
    paths: [],
    maxArc: 400,
    radius: 20,
    margin: 2, // distance between speakers
    animationDurationCircles: 200,
    animationDelayCircles: 100,
    animationDurationLines: 200,
    animationDelayLines: 30,
}

let xCoorMap = new Map();

const svgns = "http://www.w3.org/2000/svg";


function swapTools() {
    let timeline = document.getElementById('timeline-container');
    let connections = document.getElementById('connections-container');
    let button = document.getElementById('swap-button');

    button.setAttribute('onclick', '')

    if (state.current == 'timeline') {
        // timeline is up -> go to connections
        state.current = 'connections';
        button.innerHTML = 'Change to Timeline';

        // shrink timeline
        timeline.style.transform = 'scale(0)'

        // swap displays after shrinking
        setTimeout(()=>{
            timeline.style.display = 'none';
            connections.style.display = 'block';
            // bring in connections with function
            createConnections();
        }, 600) // length of timeline shrinking animation

        
    }
    else {
        // connections is up -> go to timeline
        button.innerHTML = 'Change to Connections';
        state.current = 'timeline';

        connections.style.display = 'none';
        timeline.style.display = 'block';
        timeline.style.transform = 'scale(1)'
    }
    // button can't be clicked again until 1 second
    setTimeout(()=>{ button.setAttribute('onclick', 'swapTools()') }, 1000)
    
}

function setData() {
    // create paths array off of connections objects
    for (obj of data.connections) {
        for (let i = 0; i < obj.target.length; i++) {
            data.paths.push({
                source: obj.source,
                target: obj.target[i]
            })
        }
    }

    // set parameters off of number of circles
    data.radius = Math.round((800 / (data.speakers.length + 1) / 2 - data.margin) * 100) / 100;
    data.animationDelayCircles = 1000 / data.speakers.length;
    data.animationDelayLines = 1000 / data.paths.length;

    // Create a coordinate map for consistency
    for (let i = 0; i < data.speakers.length; i++) {
        xCoorMap.set(i, (i + 1) * (2 * data.radius + data.margin));
        data.speakers[i].size = data.radius +  Math.random() * 15;
    }
}

function createConnections() {
    setData();
    document.getElementById('connections-svg').innerHTML = '';
    drawLines();
    speakersFlyIn();
}

function speakersFlyIn() {
    let svg = d3.select('#connections-svg')
    // console.log(svg);
    let lines = svg.selectAll('path')
    let circles = svg.selectAll('.speaker-circle')
        .data(data.speakers)
        .enter()
        .append('circle')
        .attr('r', function(r) {return r.size})
        .attr('cx', function(d) {return parseInt(xCoorMap.get(data.speakers.indexOf(d)))} )
        .attr('cy', data.maxArc + data.radius)
        .attr('class', 'speaker-circle')
        .attr('opacity', '0')
        .style('transform', 'translateY(10px)')

        .on('mouseover', function(d, obj) { // d is event, obj is the data point from data.speakers
            // selected circle stands out
            circles.style('opacity', .2)
            d3.select(this).style('opacity', 1)

            // selected lines stand out
            lines.style('stroke-opacity', function (line) { return (line.source == data.speakers.indexOf(obj)) ? 1 : .2; })
            lines.style('stroke-width', function (line) { return (line.source == data.speakers.indexOf(obj)) ? '4px' : '1px'; })
        })
        .on('mouseout', function(d) {
            circles.style('opacity', 1);
            lines.style('stroke-opacity', 1)
            lines.style('stroke-width', '1px')
        })

    circles.transition()
        .attr('opacity', '1')
        .style('transform', 'translateY(0px)')
        // animation fade in left to right
        .duration(data.animationDurationCircles)
        .delay(function(d, i) { return data.animationDelayCircles * i})
}

function getPathString(source, target) {
    // M 0 0 a 1 1 0 0 0 50 0

    let xStart = parseInt(xCoorMap.get(source));
    let yStart = parseInt(data.maxArc);
    let diameter = parseInt(xCoorMap.get(target) - xCoorMap.get(source));
    let flag = '1';
    if (target - source < 0) flag = '0';
    let pathString = 'M ' + xStart + ' ' + yStart + ' a 1 1 0 0 ' + flag + ' ' + diameter + ' 0'
    return pathString;
}

function getArcLength(source, target) {
    return Math.abs(source - target) * (2 * data.radius + data.margin) * Math.PI;
}

function drawLines() {
    // for each object in connections
    let svg = d3.select('#connections-svg')

    let lines = svg.selectAll('.line')
        .data(data.paths)
        .enter()
        .append('path')
        .attr('d', function(d) {return getPathString(d.source, d.target)})
        .attr("stroke-dasharray", function(d) {return getArcLength(d.source, d.target)})
        .attr("stroke-dashoffset", function(d) {return getArcLength(d.source, d.target)})
        .attr('opacity', '0')
        
        
    lines.transition()
        .attr('opacity', '1')
        .attr('class', 'line')
        // .attr("stroke-dasharray", '0')
        .duration(data.animationDurationLines)
        .delay(function(d, i) { return data.animationDelayLines * i + 300})

}