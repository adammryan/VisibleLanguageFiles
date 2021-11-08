// console.log('arc diagram')

let dataArc = {
    speakers: [],
    connections: [],
    paths: [],
}

let settingsArc = {
    maxArc: 400,
    radius: 15,
    margin: 2, // distance between speakers
    animationDurationCircles: 500,
    animationDelayCircles: 100,
    animationDurationLines: 200,
    animationDelayLines: 30,
}

let stateArc = {

}

let xCoorMap = new Map();

let chronological = [
    "jared-brother","shule","omer", "jared","jared-daughter","akish","morianton",
    "morianton-servant", "lib1","ether","coriantumr","gilead","lib2","shiz","lehi","sariah","nephi1","laman",
    "lemuel","laban","zoram","ishmael","jacob","sherem","enos","mosiah","benjamin","zeniff",
    "noah","abinadi","alma","gideon","amulon","alma2","nehor","ammon2","aaron","omner-himni","amlici",
    "amnor","limher","manti","zeram","amulek","zeezrom","nephite-daughter","lamoni","lamoni-father","abish",
    "korihor","moroni1","zerahemnah","amalickiah","lehonti","teancum","pahoran","lehi2","ammoron",
    "laman-spy","jacob-apostate","pachus","helaman1","paanchi","kishkumen","moronihah","coriantumr2",
    "gadianton","nephi2","seezoram","seantum","samuel-lamanite","giddianhi","zemnarihah","gidgiddoni",
    "christ","ammaron","mormon","moroni2"
]

// Create integer map for connections
function setSpeakers() {
    let index = 0;
    for (speakerName of chronological) {
        let speaker = data.speakers.find(a => a.name == speakerName)
        if (!speaker) { continue; }
        if (speaker.percentage > .2) {
            // only use main speakers for the arc diagram
            dataArc.speakers.push({
                name: speaker.name,
                index: index,
                size: settingsArc.radius + speaker.percentage / 1.5
            })
            index++;
        }
    }
}
setSpeakers()

function setConnections() {
    for (speaker of dataArc.speakers) {
        let speakerObj = data.speakers.find(obj => obj.name == speaker.name);

        let outArray = []

        let cxsOut = speakerObj.outgoing;
        for (cx of cxsOut) {
            if (!cx.type.includes('language')) continue;
            let outObj = dataArc.speakers.find(obj => obj.name == cx.name);
            if (outObj) {
                // console.log(speaker.name, cx.name)
                // console.log(speaker.index, outObj.index)
                // console.count('cx')

                outArray.push(outObj.index)
            }
        }

        dataArc.connections.push({
            source: speaker.index,
            target: outArray
        })
    }
    // console.log(dataArc.connections)
}
setConnections();

function setData() {
    // create paths array off of connections objects
    for (obj of dataArc.connections) {
        for (let i = 0; i < obj.target.length; i++) {
            dataArc.paths.push({
                source: obj.source,
                target: obj.target[i]
            })
        }
    }

    // set parameters off of number of circles
    settingsArc.radius = Math.round((800 / (dataArc.speakers.length + 1) / 2 - settingsArc.margin) * 100) / 100;
    settingsArc.animationDelayCircles = 1000 / dataArc.speakers.length;
    settingsArc.animationDelayLines = 3000 / dataArc.paths.length;

    // Create a coordinate map for consistency
    for (let i = 0; i < dataArc.speakers.length; i++) {
        xCoorMap.set(i, (i + 1) * (2 * settingsArc.radius + settingsArc.margin));
        // dataArc.speakers[i].size = settingsArc.radius +  Math.random() * 15;
    }
    // console.log('paths', dataArc.paths)
}

function createConnections() {
    setData();
    document.getElementById('connections-svg').innerHTML = '';
    addNames();
    drawLines();
    speakersFlyIn();
}

function getTransformXString(offset) {
    return "translateX(" + offset + "px)"
}

function getImageURLString(name) {
    return "url(#" + name + ")"
}

function getSizeTransform(name) {
    let speaker = dataArc.speakers.find(obj=>obj.name == name);
    let scale = speaker.size / settingsArc.radius
    return 'scale(' + 1 + ')'
}

function getTransformStringXY(x, y) {
    return 'translateX(' + x + 'px) translateY(' + y + 'px)'
}

function getTransformStringNames(x, y) {
    return 'translateX(' + (x - 10) + 'px) translateY(' + (y + 30) + 'px) rotate(45deg)'
}

function speakersFlyIn() {

    let svg = d3.select('#connections-svg')
    // console.log(svg);
    let lines = svg.selectAll('path')
    let names = svg.selectAll('.cx-name')
    let circles = svg.selectAll('.speaker-circle')
        .data(dataArc.speakers)
        .enter()
        .append('g')        
        .style('transform', function(d) { return getTransformStringXY(parseInt(xCoorMap.get(dataArc.speakers.indexOf(d))), settingsArc.maxArc + settingsArc.radius)})
        // .attr('x', function(d) {return parseInt(xCoorMap.get(dataArc.speakers.indexOf(d)))} )
        // .attr('y', settingsArc.maxArc + settingsArc.radius)
        .append('circle')    
        .style('transform', function(d) { return getSizeTransform(d.name)})
        .attr('r', '15')

        .attr('class', 'speaker-circle')
        .attr('opacity', '0')
        .attr('fill', function(d) {return getImageURLString(d.name)})
        // .attr('fill', 'black')

        .on('click', function(d, obj) {return updateSpeakerBanner(obj)})

        .on('mouseover', function(e, obj) { // d is event, obj is the data point from data.speakers
            // tooltipOn(obj)
            // selected circle stands out
            circles.style('opacity', .2)
            d3.select(this).style('opacity', 1)

            // selected lines stand out
            lines.style('stroke-opacity', function (line) { return (line.source == dataArc.speakers.indexOf(obj) || line.target == dataArc.speakers.indexOf(obj)) ? 1 : .2; })
            lines.style('stroke-width', function (line) { return (line.source == dataArc.speakers.indexOf(obj) || line.target == dataArc.speakers.indexOf(obj)) ? '4px' : '1px'; })

            names.style('opacity', function (name) {return (name.name == obj.name) ? 1 : .2 })
            names.style('font-size', function (name) {return (name.name == obj.name) ? '16px' : '8px' })
        })
        .on('mouseout', function(d) {
            // tooltipOff();
            circles.style('opacity', 1);
            lines.style('stroke-opacity', 1)
            lines.style('stroke-width', '1px')
            names.style('font-size', '13px')            
            names.style('opacity', 1)
        })

    circles.transition()
        .attr('opacity', '1')
        .style('transform', function(d) { return getSizeTransform(d.name)})
        // animation fade in left to right
        .duration(settingsArc.animationDurationCircles)
        .delay(function(d, i) { return settingsArc.animationDelayCircles * i})
}

function getPathString(source, target) {
    // M 0 0 a 1 1 0 0 0 50 0

    let xStart = parseInt(xCoorMap.get(source));
    let yStart = parseInt(settingsArc.maxArc);
    let diameter = parseInt(xCoorMap.get(target) - xCoorMap.get(source));
    let flag = '1';
    if (target - source < 0) flag = '0';
    let pathString = 'M ' + xStart + ' ' + yStart + ' a 1 1 0 0 ' + flag + ' ' + diameter + ' 0'
    return pathString;
}

function getArcLength(source, target) {
    return Math.abs(source - target) * (2 * settingsArc.radius + settingsArc.margin) * Math.PI;
}

function drawLines() {
    // for each object in connections
    let svg = d3.select('#connections-svg')

    let circles = svg.selectAll('.speaker-circle')

    let lines = svg.selectAll('.line')
        .data(dataArc.paths)
        .enter()
        .append('path')
        
            .attr('d', function(d) {return getPathString(d.source, d.target)})
            .attr("stroke-dasharray", function(d) {return getArcLength(d.source, d.target)})
            .attr("stroke-dashoffset", function(d) {return getArcLength(d.source, d.target)})
            .attr('opacity', '0')
            .attr('fill', 'none')

            // .on('mouseover', function(e, line) { // e is event
            //     // console.log(line)
            //     // tooltipOn(obj)

            //     // // selected line stands out
            //     lines.style('opacity', .2)
            //     d3.select(this).style('opacity', 1)
            //     d3.select(this).style('stroke-width', '4px')

            //     // lines.style('stroke-width', function (line) { return (line.source == dataArc.speakers.indexOf(obj) || line.target == dataArc.speakers.indexOf(obj)) ? '4px' : '1px'; })
            // })
            // .on('mouseout', function(d) {
            //     tooltipOff();
            //     lines.style('opacity', 1)
            //     lines.style('stroke-width', '1px')
            // })
        
        
    lines.transition()
        .attr('opacity', function(d) { return d.source < d.target ? '1' : '0'})
        .attr('class', 'line')
        // .attr("stroke-dasharray", '0')
        .duration(settingsArc.animationDurationLines)
        .delay(function(d, i) { return settingsArc.animationDelayLines * i + 300})

}

function addNames() {
    let svg = d3.select('#connections-svg')
    let names = svg.selectAll('.cx-name')
        .data(dataArc.speakers)
        .enter()
        .append('text')
            .attr('class', 'cx-name')
            .style('transform', function(d) { return getTransformStringNames(parseInt(xCoorMap.get(dataArc.speakers.indexOf(d))), settingsArc.maxArc + settingsArc.radius)})
            .attr('opacity', '0')
            .html(function(d) {
                // console.log(d.name)
                return getDisplayName(d.name)
            })

    names.transition()
        .attr('opacity', '1')
        // animation fade in left to right
        .duration(settingsArc.animationDurationCircles)
        .delay(function(d, i) { return settingsArc.animationDelayCircles * i})
}

