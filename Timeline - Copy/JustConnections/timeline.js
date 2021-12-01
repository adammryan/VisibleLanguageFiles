
var imageFiles = [
    "lehi", "nephi1", "jacob", "benjamin", "mosiah", "abinadi", "alma2", "ammon2", "amulek",
    "lamoni", "lamoni-father", "korihor", "pahoran", "helaman1", "nephi2", "giddianhi",
    "mormon", "moroni2"
]

let langCXForSVG = []
let relCXForSVG = []
let linesData = [];
let svgLangLines = [];
let svgRelLines = [];

let state = {
    speaker: "nephi1",
    typeLines: ["Language", "Family", "Associate", "Enemy"]
}
let parameters = new URLSearchParams(window.location.search);
if (imageFiles.includes(parameters.get("speaker"))) state.speaker = parameters.get("speaker")
else {
    state.speaker = "mormon";
    console.log("Bad URL parameter for speaker. Default to Mormon.")
}

const timelineBoxHeight = 40;
const timelineStart = 700;
const tickHeight = 50;
const markerNums = [-700, -600, -500, -400, -300, -200, -100, 0, 100, 200, 300, 400, 500]
const timelineOffsetY = 50;
function numToDate(num) {
    let tag = (num >= 0) ? "AD" : "BC";
    let year = Math.abs(num);
    return parseInt(year) + " " + tag;
}

const horzGap = 67;
const initOffset = 20;
const lineStartY = 210;

let xCoorMap = new Map();
let j_index = 0;
for (let name of imageFiles) {
    xCoorMap.set(name, j_index * horzGap + initOffset);
    j_index++;
}

function getImageLink(name) {
    return "images/" + name + ".jpg";
}

function updateMainInfo() {
    let name = document.getElementById('main-name')
    name.innerHTML = getDisplayName(state.speaker)

    let image = document.getElementById('main-image')
    image.setAttribute('src', getImageLink(state.speaker))
}
updateMainInfo();



// selects a new speaker and re-renders graphics
function updateSpeaker(speaker) {
    state.speaker = speaker;
    updateMainInfo();
    convertDataForSVGLines();
    drawLines();
    updateInfoBoxes();
}

function convertDataForSVGLines() {
    linesData = [];
    let startX, stopX;
    let obj;

    // Social Connections
    obj = relationshipData.find(a => a.name == state.speaker)
    startX = xCoorMap.get(obj.name);
    for (let rel of obj.relations) {
        if (!imageFiles.includes(rel.name)) continue;
        stopX = xCoorMap.get(rel.name);
        linesData.push({startX: startX, stopX: stopX, type: rel.type})
    }

    obj = timelineData.find(obj => obj.name == state.speaker);
    // Language Connections
    stopX = xCoorMap.get(obj.name);

    // incoming and outgoing relationships were determined by similar word choice.
    // we compiled this data from some of Alex Lyman's work, but honestly it would make sense to recompile this
    // data in a more repeatable and trackable way
    // the distinction of incoming and outgoing was made solely by who came first chronologically

    // incoming
    for (let inc of obj.incoming) {
        if (!imageFiles.includes(inc)) continue;
        startX = xCoorMap.get(inc);
        linesData.push({startX: startX, stopX: stopX, type: "Language"})
    }
    // outgoing
    startX = xCoorMap.get(obj.name);
    for (let out of obj.outgoing) {
        if (!imageFiles.includes(out)) continue;
        stopX = xCoorMap.get(out);
        linesData.push({startX: startX, stopX: stopX, type: "Language"})
    }
}
convertDataForSVGLines()

function createConnectionsDiagram() {
    // create lines
    drawLines();

    // create icons
    createIcons();
}
createConnectionsDiagram();

function createIcons() {
    let svg = d3.select("#speaker-icons")
    let icons = svg.selectAll('.icon')
    icons.data(imageFiles)
        .enter()
        .append('div')
            .attr('class', 'icon')
            .style('left', function(d) { return xCoorMap.get(d) + 'px'})
            .on('click', (e, d) => updateSpeaker(d))
            .append('div')
                .attr('class', 'icon-name')
                .html(function(d) { return getDisplayName(d); })
    
    let images = svg.selectAll('.icon')
        .append('div')
            .attr('class', 'img-cont')
                .append('img')
                .attr('src', function(d) { return getImageLink(d); })
}

const iconHeight = 40;


function drawLines() {
    let svg = d3.select("#svg-connections")
    svg.selectAll('.line').remove()
    let lines = svg.selectAll('.line')
    lines.data(linesData)
        .enter()
        .append('path')
            .attr('class', function(d) { return getLineClass(d.type, 'animate')})
            .attr('d', function(d) { return getLinePath(d); })
            
            .attr("stroke-dasharray", function(d) { return getArcLength(d.startX, d.stopX); })
            .attr("stroke-dashoffset", function(d) { return getArcLength(d.startX, d.stopX); })
}

function updateLines() {
    let svg = d3.select("#svg-connections")
    let lines = svg.selectAll('.line')
    lines.data(linesData)
        .attr('class', function(d) { return getLineClass(d.type, '')})
        .attr("stroke-dasharray", 0 )
        .attr("stroke-dashoffset", 0 )
}

function getArcLength(x1, x2) {
    let r = Math.abs(x2 - x1);
    return r * 3.14 / 2 + 20
}

function getLinePath(obj) {
    const fineTuneX = 7;
    let start = obj.startX + initOffset + fineTuneX;
    let stop = obj.stopX + initOffset + fineTuneX;
    let top = (stop > start) ? 1 : 0;
    let y = lineStartY;
    let ratio = 1 + Math.abs(stop - start) / 450
    return "M " + start + " " + y + " A " + ratio + " 1 0 0 " + top + " " + stop + " " + y;
}
function getLineClass(type, animate) {
    if (!state.typeLines.includes(type)) return "line unselected " + animate;
    if (type == "Language") return "line " + animate;
    if (type == "Family") return "line family " + animate;
    if (type == "Associate") return "line associate " + animate;
    if (type == "Enemy") return "line enemy " + animate;
    return "line" + animate;
}




function updateInfoBoxes() {
    updateIncomingInfoBox();
    updateOutgoingInfoBox();
    updateRelationshipInfoBox();
}
updateInfoBoxes();

function updateIncomingInfoBox() {
    const box = document.getElementById('incoming');
    box.innerHTML = "";
    const current = timelineData.find(obj => obj.name == state.speaker);
    // console.log(current)

    for (let speaker of current.incoming) {
        if (!imageFiles.includes(speaker)) continue;
        let icon = createSmallIcon('in', speaker);
        box.append(icon)
    }
}
function updateOutgoingInfoBox() {
    const box = document.getElementById('outgoing');
    box.innerHTML = "";
    const current = timelineData.find(obj => obj.name == state.speaker);

    for (let speaker of current.outgoing) {
        if (!imageFiles.includes(speaker)) continue;
        let icon = createSmallIcon('out', speaker);
        box.append(icon)
    }
}
function updateRelationshipInfoBox() {
    const box = document.getElementById('relationships');
    box.innerHTML = "";
    const current = relationshipData.find(obj => obj.name == state.speaker);

    for (let obj of current.relations) {
        if (!imageFiles.includes(obj.name)) continue;
        if (!imageFiles.includes(obj.name)) continue;
        let icon = createSmallIcon('rel', obj.name);
        box.append(icon)
    }
}

function createSmallIcon(type, speaker) {
    let icon = document.createElement('div');
    icon.setAttribute('class', 'icon-small');
    icon.setAttribute('id', type + "-col-" + speaker)

    let speakerName = document.createElement('div');
    speakerName.setAttribute('class', 'name');
    speakerName.innerHTML = getDisplayName(speaker)

    let imgBox = document.createElement('div');
    imgBox.setAttribute('class', 'img-cont-small');
    let img = document.createElement('img');
    img.setAttribute('src', getImageLink(speaker));
    imgBox.appendChild(img);

    let imageAndName = document.createElement('div');
    imageAndName.setAttribute('class', 'icon-small-speaker');
    imageAndName.appendChild(imgBox);
    imageAndName.appendChild(speakerName);

    let collapseIcon = document.createElement('div')
    collapseIcon.setAttribute('class', 'small-collapse')
    collapseIcon.setAttribute("onclick", "expandSmallIcon('" + type + "-col-" + speaker + "')")
    collapseIcon.innerHTML = "v"

    let header = document.createElement('div')
    header.setAttribute('class', 'header')
    header.appendChild(imageAndName);
    header.appendChild(collapseIcon);

    let content = document.createElement('div')
    content.setAttribute('class', 'content')
    // FIXME - This placeholder description needs to be replaced.
    // Truman Callens was working on these descriptions for the main connections we are showing for the 20ish speakers
    let pairArray = [];
    pairArray.push(state.speaker)
    pairArray.push(speaker);
    pairArray.sort();
    let textFileName = getTextFileNameFromPair(pairArray);
    
    content.innerHTML = "Description not created yet."

    let request = new XMLHttpRequest();
    request.open('GET', textFileName, false);
    request.onload = function() {
        if (request.status === 200) {
            content.innerHTML = request.response;
        }
    }
    request.send(null);

    icon.appendChild(header)
    icon.appendChild(content)
    return icon
}

function expandSmallIcon(id) {
    let icon = document.getElementById(id);
    if (icon.classList.contains('icon-small-expanded')) {
        // collapse
        icon.classList.remove('icon-small-expanded')
    }
    else {
        // expand
        icon.classList.add('icon-small-expanded')
    }
}

function getTextFileNameFromPair(arr) {
    arr.sort();
    let result = "./CXDescriptions/";
    for (let i = 0; i < arr.length; i++) {
        result += arr[i];
        if (i < arr.length - 1) {
            result += "-";
        }
    }
    result += ".txt"
    return result;
}


function collapseLegend() {
    let legend = document.getElementById('legend');
    if (legend.classList.contains('legend-collapsed')) {
        // is collapsed -> not collapsed
        legend.classList.remove('legend-collapsed')
        document.getElementById('legend-collapse').innerHTML = "Less"
    }
    else {
        // is not collapsed ->  collapsed
        legend.classList.add('legend-collapsed')
        document.getElementById('legend-collapse').innerHTML = "More"
    }
}

function check(option) {
    let id = "check-" + option.toLowerCase();
    let index = state.typeLines.indexOf(option);
    if (index == -1) {
        // add type to array
        state.typeLines.push(option)
        document.getElementById(id).classList.remove('unchecked')
    }
    else {
        state.typeLines.splice(index, 1);
        document.getElementById(id).classList.add('unchecked')
    }
    updateLines();

}



// decides window for lifespan - assumes standard values set beforehand
function setWindow(obj) {
    // Lifespan = "None"
    if (obj.birth[0] === 'N') {
        obj.window = "none";
        return obj;
    }

    // Jaredite Plates Speakers
    // window 2250BC - 0
    else if (obj.birth[0] === "B") {
        let year = obj.birth;
        year = year.substring(3,year.length);
        // console.log(year);
        year = parseInt(year);
        if (year > 650) {
            obj.window = "OT";
            return obj;
        }
    }
    return obj;
    // within standard BOM timeline
    // window = 650BC - 425AD
}

function getLifespanLine(option) {
    if (1) {
        return "M 0 40 L 1100 40";
    }
}








function tooltipEventListener(e) {
    const toolTip = document.querySelector('.tooltip');

    if (toolTip == null) return;

    toolTip.style.left = e.pageX - 8 + 'px';
    toolTip.style.top = e.pageY - 45 + 'px';

    return;
}

function createTooltipEventListener() {
    document.addEventListener('mousemove', tooltipEventListener); // moves tooltip with mouse

    return;    
}

function destroyTooltipEventListener() {
    document.removeEventListener("mousemove", tooltipEventListener);

    return;
}

function tooltipOn(name) {
    let tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = idNameToDisplayName(name)
    tooltip.setAttribute('class', 'tooltip tooltip-visible');
    createTooltipEventListener();
}
function tooltipOff() {
    document.getElementById('tooltip').setAttribute('class', 'tooltip tooltip-hidden');
    destroyTooltipEventListener();
}


window.addEventListener('load', function() {
    let message = {
        height: document.body.scrollHeight,
        width: document.body.scrollWidth
    };

    window.top.postMessage(message, "*");
})

