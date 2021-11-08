
let state = {
    graphType: "circ-even",
    ringLayers: false,
    popup: false,
    drawLines: false
}

let bools = {
    mouseDown: false,
    boxMove: false,
    touchDown: false,
    svgPan: false,
    pinch: true,
    zoom: false,
    pan: false,
    boxResize: false,

    spotlightEnter: false,
    spotlightHasSubject: false,

    sideExtDown: true,
    hintReady: true,
    sidebarHover: false,

    speakerSelected: false,
    speakerHover: false,
    deselect: true // don't deselect if you are zooming
}

ev_t = {
    pageX: 0,
    pageY: 0,
    currentBox: {},
    sideExtLength: 500,
    sidebarWidth: 400, // this should match the css constant variable
    ceiling: 52, // this should match settings-box height css + 2
    
    removalIndex: 0,
    zIndexCount: 0,
    addBoxCount: 0,

    spotlightHintCount: 0,
    spotlightCount: 0,

    selectPos: 0,
}

let boxIdNumGenerator = 0;
const vertDistPopupBoxes = 50;
const horDistPopupBoxes = 25;
const maxVertPopupDist = 400;
const maxHorPopupDist = 800;

const boxHeightStairCase = 5;
const circleRadius = 16;
const largeCircleRadius = 250;


// ----------------- Sort Objects by data ------------- //

let mapSpeakers = new Map();

function includeSpeaker(obj) {
    if (obj.lifespan.start == "None") return false;
    return true;
}

function fillMap() {
    mapSpeakers.clear();
    let speakersSorted = [];
    for (let obj of dataAll.speakers) {
        if (!includeSpeaker(obj)) continue;
        speakersSorted.push({
            name: obj.name,
            x1: getNumFromDate(obj.lifespan.start),
            x2: getNumFromDate(obj.lifespan.end)
        })
    }
    speakersSorted.sort((a,b) => {
        return a.x1 - b.x1
    })
    for (let i = 0; i < speakersSorted.length; i++) {
        if (state.graphType == 'staircase') {
            mapSpeakers.set(speakersSorted[i].name, {
                name: speakersSorted[i].name,
                x: speakersSorted[i].x1 - 500,
                y: i * boxHeightStairCase - 480,
                index: i,
                width: speakersSorted[i].x2 - speakersSorted[i].x1,
                height: boxHeightStairCase,
            })
        }
        else if (state.graphType == 'circular') {
            mapSpeakers.set(speakersSorted[i].name, {
                name: speakersSorted[i].name,
                x: getTrigDecimalX(speakersSorted[i].x1) * largeCircleRadius * getCategoryMultiplier(speakersSorted[i].name) - circleRadius / 2,
                y: getTrigDecimalY(speakersSorted[i].x1) * largeCircleRadius * getCategoryMultiplier(speakersSorted[i].name) - 200 - circleRadius / 2,
                index: i,
                width: circleRadius,
                height: circleRadius,
            })
        }
        else if (state.graphType == 'circ-even') {
            mapSpeakers.set(speakersSorted[i].name, {
                name: speakersSorted[i].name,
                x: getTrigDecimalX(i / speakersSorted.length * 1000) * largeCircleRadius * getCategoryMultiplier(speakersSorted[i].name),
                y: getTrigDecimalY(i / speakersSorted.length * 1000) * largeCircleRadius * getCategoryMultiplier(speakersSorted[i].name) - 200,
                index: i,
                width: circleRadius,
                height: circleRadius,
            })
        }

    }
}

function getTrigDecimalX(num) {
    // num will be 0 - 1000
    let mult = 1 / 1000 * 2 * Math.PI * 1;  
    num *= mult;
    num -= Math.PI / 2;
    return Math.cos(num);
}
function getTrigDecimalY(num) {
    // num will be 0 - 1000
    let mult = 1 / 1000 * 2 * Math.PI * -1; 
    num *= mult;
    num -= Math.PI / 2;
    return Math.sin(num);
}

function getNumFromDate(date) {
    let num = date.substring(0, date.length - 3);
    if (num == 'N') { return -1} // speaker has no lifespan
    num = parseInt(num);
    if (date.substring(date.length - 2, date.length) == 'BC') {
        num *= -1;
    }
    num += 2250;
    num /= 2750;

    if (num > 1 || num < 0) console.log(num)
    num *= 1000;
    return num;
}


// ----------------- Code for Data Conversion ------------- //




let data_t = [];
let lines_t = [];

function changeGraphType(type) {
    state.graphType = type;
    let options = document.getElementsByClassName('type-button')
    for (let option of options) {
        option.classList.remove('type-button-active')
    }
    if (type == 'staircase') { document.getElementById('type-button-str').classList.add('type-button-active'); }
    else if (type == 'circular') { document.getElementById('type-button-cir').classList.add('type-button-active'); }
    else if (type == 'circ-even') { document.getElementById('type-button-cir-even').classList.add('type-button-active'); }


    updateTimeline()
}

function changePopupSetting() {
    state.popup = !state.popup;
}
function changeLinesSetting() {
    state.drawLines = !state.drawLines;
    convertJSONtoTimelineData()
}

function convertJSONtoTimelineData() {
    fillMap();
    fillTimelineSpeakerArray();
    fillTimelineLinesArray()
}
convertJSONtoTimelineData();

function getConnectionsNamesArray(obj) {
    let arr = [];
    for (let out of obj.outgoing) {
        arr.push(out.name)
    }
    for (let inc of obj.incoming) {
        arr.push(inc.name)
    }
    arr = arr.filter(function(item, pos) {
        return arr.indexOf(item) == pos;
    })
    return arr;
}

function fillTimelineSpeakerArray() {
    data_t = [];
    for (let speaker of dataAll.speakers) {
        if (!includeSpeaker(speaker)) continue;
        let mapItem = mapSpeakers.get(speaker.name)
        data_t.push({
            name: speaker.name,
            connections: getConnectionsNamesArray(speaker),
            percentage: speaker.percentage,
            x: mapItem.x,
            y: mapItem.y,
            width: mapItem.width,
            height: mapItem.height,
            index_chron: mapItem.index,
            type: state.graphType
        })
    }
}
function fillTimelineLinesArray() {
    if (!state.drawLines) return;
    lines_t = [];
    for (let speaker of dataAll.speakers) {
        if (!includeSpeaker(speaker)) continue;
        let speaker1 = mapSpeakers.get(speaker.name)
        for (let out of speaker.outgoing) {
            if (!mapSpeakers.has(out.name)) continue;
            let speaker2 = mapSpeakers.get(out.name);
            // different start/end positions depending on type of graph
            if (state.graphType == 'staircase') {
                lines_t.push({
                    source: speaker.name,
                    target: out.name,
                    x1: speaker1.x,
                    y1: speaker1.y,
                    x2: speaker2.x,
                    y2: speaker2.y,
                })
            }
            else if (state.graphType == 'circular' || state.graphType == 'circ-even') {
                lines_t.push({
                    source: speaker.name,
                    target: out.name,
                    x1: speaker1.x + circleRadius / 2,
                    y1: speaker1.y + circleRadius / 2,
                    x2: speaker2.x + circleRadius / 2,
                    y2: speaker2.y + circleRadius / 2,
                })
            }

        }
    }
}


function getSomething() {
    switch (state.graphType) {
        // Convert data for Staircase Timeline
        case 'staircase':
            console.log('staircase graph')

        break;

        // Convert data for Circular Timeline
        case 'circular':
            console.log('circle graph')

        break;

        // Other
        default:
            console.log('other')

        break;
    }
}


let data_t_ex1 = [
    {
        x: 150,
        y: 50,
        width: 200,
        height: 100,
        radius: 15
    },
    {
        x: 220,
        y: 160,
        width: 250,
        height: 100,
        radius: 15
    },
    {
        x: 300,
        y: 270,
        width: 280,
        height: 100,
        radius: 15
    },
    {
        x: 450,
        y: 380,
        width: 300,
        height: 100,
        radius: 15
    },
    {
        x: 600,
        y: 490,
        width: 300,
        height: 100,
        radius: 15
    },
];



















// ----------------- Code for Popup Boxes ------------- //


function getBoxId() {
    ++boxIdNumGenerator;
    return idNames[boxIdNumGenerator];
    // This needs to be a unique ID for the page
}
function getPopupBoxStartCoors() {
    let x = boxIdNumGenerator * horDistPopupBoxes % (window.innerWidth - ev_t.sidebarWidth - 100) + 10;
    let y = boxIdNumGenerator * vertDistPopupBoxes % maxVertPopupDist + 20; // margin on top
    return [x,y];
}

function incrementBoxPromptCount() {
    if (!state.popup) return;
    ev_t.addBoxCount++;
    if (ev_t.addBoxCount == 2) {
        console.log('would you like...')
        // create a popup that can turn off popups
    }
}

let boxesData = []

function addBox(id) {
    if (!state.popup) return;



    if (id == null) id = getBoxId();
    else getBoxId();
    if (boxesData.find(obj => obj.id == id)) {
        highlightPBox(id)
        return
    };
    minimizeAllPBoxes(false);
    let coors = getPopupBoxStartCoors();
    let box = {
        id: id,
        height: 200,
        width: 200,
        top: coors[1],
        left: coors[0],
    }
    boxesData.push(box)
    addIndividualBox(box);
    updateInfoActiveBoxes();
    fillSpeakerContent(box.id);
}

function addIndividualBox(box) {
    let boxes =  d3.select('#p-boxes')
        // .data(d)
        // .enter()
        .append('div')
            .attr('class', 'p-box')
            .attr('id', function() { return box.id; })
            .attr('style', function() { return getStyleStringForBox(box); })
            .attr('onclick', function() { return "bringBoxToTop('" + box.id + "')"; })

    boxes.append('div')
        .attr('class', 'title')
        .html(function() { return getDisplayName(box.id); })

    boxes.append('div')
        .attr('class', 'img-container')
        .append('img')
            .attr('src', function() { return getImageString(box.id); })

    boxes.append('div')
        .attr('id', function() { return box.id + 'exit'; })
        .attr('class', 'exit-box box-option')
        .html("x")
        .attr('onclick', function() { return "exitBox('" + box.id + "')"; })

    boxes.append('div')
        .attr('id', function() { return box.id + 'minimize'; })
        .attr('class', 'minimize-box box-option')
        .html("-")
        .attr('onclick', function() { return "minimizeBox('" + box.id + "')"; })

    boxes.append('div')
        .attr('class', 'move-box box-option')
        // .html('m')
        .on('mousedown', function(e) { return onMouseDownBox(e, box.id); })

    boxes.append('div')
        .attr('class', 'content')
        .attr('id', function() { return box.id + 'content'; })

    boxes.append('div')
        .attr('class', 'resize')
        .on('mousedown', function(e) { return onBoxResizeDown(e, box.id); })
        .on('mouseup', function(e) { return onBoxResizeUp(e, box.id)})
}

function fillSpeakerContent(id) {
    let content = document.getElementById(id + "content");
    let speakerInfo = dataAll.speakers.find(obj => obj.name == id);
    let htmlString = "";
    htmlString += "<div>" + getDisplayName(id) + "</div>";
    htmlString += "<div>Lifespan: " + speakerInfo.lifespan.start + " - " + speakerInfo.lifespan.end + "</div>";
    htmlString += "<div>Percentage: " + speakerInfo.percentage + "%</div>";
    content.innerHTML = htmlString;
}

// This assumes you are populating from nothing. Clear container before calling this function
function populateBoxes() {
    for (let box of boxesData) {
        addIndividualBox(box)
    }
    for (let box of boxesData) {
        fillSpeakerContent(box.id)
    }
}

function moveBoxes(stagger) {
    let container = d3.select('#p-boxes');
    let boxes = container.selectAll(".p-box")
        .data(boxesData)
        
    boxes.transition()
        .attr('style', function(d) {
            // console.log(d)
            return getStyleStringForBox(d); })
        .duration(400)
        .delay(function(d, i) { return stagger ? i * 80 : 0; })
}

function moveIndividualBox(id) {
    let box = boxesData.find(obj => obj.id == id);
    let container = d3.select('#p-boxes');
    let boxSelect = container.selectAll("#" + id)
    console.log(boxSelect, box)
    boxSelect.transition()
        .attr('style', function(d) {
            console.log(d)
            return getStyleStringForBox(box);
        })
        // .duration(400)
}

function getStyleStringForBox(d) {
    // ev_t.zIndexCount++;
    return '--height: ' + d.height + 'px; --width: ' + d.width + 'px; --top: ' + d.top + 'px; --left: ' + d.left + 'px; --z-index: ' + ev_t.zIndexCount + ";";
}

function exitBox(id) {
    ev_t.closing = true;

    let index = boxesData.indexOf(boxesData.find(obj => obj.id == id));
    if (index == -1) {
        console.log('bad search')
        return;
    }
    boxesData.splice(index, 1);
    document.getElementById(id).remove();
    document.getElementById(id + 'info').remove();
    updateInfoActiveBoxes();

    if (boxesData.length == 0) clearAllPBoxes();
}

function minimizeBox(id) {
    if (!document.getElementById(id).classList.contains('p-box-minimized')) {
        document.getElementById(id).classList.add('p-box-minimized')
    }
    else {        
        document.getElementById(id).classList.remove('p-box-minimized')
    }
}

function bringBoxToTop(id) {
    ev_t.zIndexCount++;
    document.getElementById('zoom-helps').style.zIndex = ev_t.zIndexCount + 100;
    let box = document.getElementById(id)
    if (box) box.style.zIndex = ev_t.zIndexCount;

}

function onMouseDownBox(e, id) {
    updateSpotlightPicture(id);
    triggerSpotlightHint();
    ev_t.currentBox = boxesData.find(obj => obj.id == id);
    // console.log(ev_t.currentBox)
    bringBoxToTop();
    bools.mouseDown = true;
    bools.boxMove = true;
    ev_t.pageX = e.pageX
    ev_t.pageY = e.pageY;
    document.getElementById('zoom-helps').style.zIndex = ev_t.zIndexCount + 100;
}
function onMouseMoveBox(e) {
    let box = ev_t.currentBox;

    let shiftX = e.pageX - ev_t.pageX;
    box.left += shiftX;
    if (box.left < 1) box.left = 1;

    let shiftY = e.pageY - ev_t.pageY;
    box.top += shiftY;
    if (e.pageY < ev_t.ceiling + 25) box.top = 2;

    document.getElementById(box.id).setAttribute('style', getStyleStringForBox(box))
    ev_t.pageX = e.pageX
    ev_t.pageY = e.pageY
    if (bools.spotlightEnter) {
        bools.spotlightHasSubject = true;
    }
}
function onMouseUpBox(e) {
    // console.log(e)
    bools.mouseDown = false;
    bools.boxMove = false;
}
function onBoxResizeDown(e, id) {
    document.getElementById(id).classList.add('resizing')
    bools.mouseDown = true;
    bools.boxResize = true;
    ev_t.currentBox = boxesData.find(obj => obj.id == id);
    ev_t.pageX = e.pageX
    ev_t.pageY = e.pageY
}
function onBoxResizeUp(e, id) {
    document.getElementById(id).classList.remove('resizing')
}
function onBoxResizeMove(e) {
    let box = ev_t.currentBox;
    let shiftX = e.pageX - ev_t.pageX;
    if (e.pageX < (window.innerWidth - ev_t.sidebarWidth - 20)) {
        // if (shiftX < 0) box.width += shiftX;
        box.width += shiftX
    }
    if (box.width < 50) box.width = 50;
    console.log(document.getElementById(box.id).classList)
    if(!document.getElementById(box.id).classList.contains('p-box-minimized')) {
        let shiftY = e.pageY - ev_t.pageY;
        box.height += shiftY;
        if (box.height < 50) box.height = 50;
    }

    document.getElementById(box.id).setAttribute('style', getStyleStringForBox(box))
    ev_t.pageX = e.pageX
    ev_t.pageY = e.pageY
}
function highlightPBox(id) {
    
    let pBox = document.getElementById(id)
    pBox.click();
    pBox.classList.remove('highlight-animate');
    setTimeout(() => {
        pBox.classList.add('highlight-animate');
    }, 10)
}
function clearAllPBoxes() {
    for (let box of boxesData) {
        document.getElementById(box.id).remove();
    }
    boxesData = [];
    document.getElementById('active-speakers').innerHTML = '';
    boxIdNumGenerator = 0;
}

function minimizeAllPBoxes(expand) {
    let min = false;
    for (let box of boxesData) {
        if (!document.getElementById(box.id).classList.contains('p-box-minimized')) min = true;
        document.getElementById(box.id).classList.add('p-box-minimized');
    }
    if (!min && expand) {
        for (let box of boxesData) {
            document.getElementById(box.id).classList.remove('p-box-minimized');
        }
    }
}

function arrangeLeft() {
    for (let i = 0; i < boxesData.length; i++) {
        document.getElementById(boxesData[i].id).classList.add('p-box-arrange')
        boxesData[i].left = 3;
        boxesData[i].top = 10 + 48 * i;
        boxesData[i].width = 180;
    }

    moveBoxes(true);
    minimizeAllPBoxes(false);
    for (let i = 0; i < boxesData.length; i++) {
        document.getElementById(boxesData[i].id).classList.remove('p-box-arrange');
    }

}





















// -------------------------- Code for Sidebar Info ------------------------------- //

function updateInfoActiveBoxes() {
    let container = d3.select('#active-speakers')
    let activeBoxes = container.selectAll('.active-speaker')
        .data(boxesData)
        .enter()
        .append('div')
            .attr('class', 'active-speaker')
            .attr('id', function(d) { return d.id + 'info'})
            .html(function(d) { return getDisplayName(d.id); })
            .attr('onclick', function(d) { return "highlightPBox('" + d.id + "')"})
}

function toggleExt() {
    console.log('toggle')
    if (bools.sideExtDown) {
        // hide the div
        extendSpotlightPage()
    }
    else {
        // reveal the div
        collapseSpotlightPage();
        document.getElementById('sidebar-ext').style.top = "0px";
    }
    bools.sideExtDown = !bools.sideExtDown;
}
function extendSpotlightPage() {
    document.getElementById('sidebar-ext').style.top = "0px";
}
function collapseSpotlightPage() {
    document.getElementById('sidebar-ext').style.top = "-" + (ev_t.sideExtLength - 5) + "px";
}
function updateExtContent() {
    let box = ev_t.currentBox;
    let speakerInfo = dataAll.speakers.find(obj => obj.name == box.id);
    let htmlString = "";
    htmlString += "<div>" + getDisplayName(box.id) + "</div>";
    htmlString += "<div>Lifespan: " + speakerInfo.lifespan.start + " - " + speakerInfo.lifespan.end + "</div>";
    htmlString += "<div>Percentage: " + speakerInfo.percentage + "%</div>";
    htmlString += "<div>Incoming: ...</div>";
    htmlString += "<div>Outgoing: ...</div>";
    htmlString += "<div>Connections Diagram: ...</div>";
    htmlString += "<div>Content Frequency (for speaker): ...</div>";
    htmlString += "<div>Word Search Results: ...</div>";

    document.getElementById('ext-content').innerHTML = htmlString;
}


function updateSpotlightPicture(id) {
    document.getElementById('sheet-image').setAttribute('src', './images/' + id + '.jpg')
    document.getElementById('sheet-image').setAttribute('alt', getDisplayName(id))
}







// ----------------- Code for SVG Graphic ------------- //

let svgBox = document.getElementById('svg-box');

function populateTimeline() {
    convertJSONtoTimelineData();
    populateLines();
    populateTimelineBlocks();
}

function populateTimelineBlocks() {
    
    let svg = d3.select('#svg-box')
    svg.selectAll('.item').remove()
    let items = svg.selectAll('.item')
        .data(data_t)
        .enter()
        .append('rect')
            .attr('class', 'item')
            .attr('class', function(d) {
                if (d.type == 'staircase') return 'staircase-item item'
                else if (d.type == 'circular' || d.type == 'circ-even') return 'circular-item item'
            })
            .attr('id', function(d) { return d.name + '_t'})
            .attr('x', function(d) { return d.x; })
            .attr('y', function(d) { return d.y; })
            .attr('width', function(d) { return d.width; })
            .attr('height', function(d) { return d.height; })
            .attr('rx', function(d) {
                if (d.type == 'staircase') { return 0; }
                else if (d.type == 'circular' || d.type == 'circ-even') { return largeCircleRadius; }
            })
            .style('fill', function(d) { return getCategoryFill(d.name); })

            .on('mouseover', function(e, d) {
                showToolTip();;
                updateToolTip(getDisplayName(d.name));
                bools.speakerHover = true;
                highlightConnections(d.name);
            })
            .on('mouseleave', function(e, d) {
                hideToolTip();
                bools.speakerHover = false;
                resetHighlightConnections();
            })
            .on('click', function(e, d) {
                incrementBoxPromptCount(); // prompt user to turn off popup boxes if they'd like
                addBox(d.name);
                svgItemSelected(d.name)
            })
}


function deselectSVG(event, e) {
    if (bools.speakerHover) return;
    if (event == 'down') {
        ev_t.selectPos = [e.pageX, e.pageY]
    }
    else if (e.pageX == ev_t.selectPos[0] && e.pageY == ev_t.selectPos[1] ) {
        console.log('deselect')
        bools.speakerSelected = false;
        resetHighlightConnections();
    }

}
svgBox.addEventListener('mousedown', function(e) { deselectSVG('down', e) });
svgBox.addEventListener('mouseup', function(e) { deselectSVG('up', e) });

function svgItemSelected(name) {
    // if one's already selected, turn off highlight and turn back on
    bools.speakerSelected = false;
    highlightConnections(name);
    bools.speakerSelected = true;;

}

function updateTimeline() {
    convertJSONtoTimelineData();
    udpateLines();
    updateTimelineBlocks();
}

function updateTimelineBlocks() {
    convertJSONtoTimelineData();
    
    let svg = d3.select('#svg-box')
    let items = svg.selectAll('.item')
        .data(data_t)
    items.transition()
        .attr('class', 'item')
        .attr('class', function(d) {
            if (d.type == 'staircase') return 'staircase-item item'
            else if (d.type == 'circular' || d.type == 'circ-even') return 'circular-item item'
        })
        .attr('id', function(d) { return d.name + '_t'})
        .attr('x', function(d) { return d.x; })
        .attr('y', function(d) { return d.y; })
        .attr('width', function(d) { return d.width; })
        .attr('height', function(d) { return d.height; })
        .attr('rx', function(d) {
            if (d.type == 'staircase') { return 0; }
            else if (d.type == 'circular' || d.type == 'circ-even') { return largeCircleRadius; }
        })
        .style('fill', function(d) { return getCategoryFill(d.name); })
        .duration(1500)
        // .delay(function(d) { 
        //     return d.index_chron * 5; 
        // })
}

function getCategoryFill(name) {
    if (group_major.includes(name)) return "var(--primary-group)";
    else if (group_secondary.includes(name)) return "var(--secondary-group)";
    else if (group_minimal.includes(name)) return "var(--minimal-group)";
    else if (group_jaredites.includes(name)) return "var(--jaredite-group)";
    else if (group_OT.includes(name)) return "var(--OT-group)";
}
function getCategoryMultiplier(name) {
    if (!state.ringLayers) return 1;
    if (group_major.includes(name)) return .7;
    else if (group_secondary.includes(name)) return .9;
    else if (group_minimal.includes(name)) return 1.1;
    else if (group_jaredites.includes(name)) return .9;
    else if (group_OT.includes(name)) return 1.1;
}
function changeRingLayers() {
    state.ringLayers = !state.ringLayers;
    let button = document.getElementById('ring-button');
    if (button.classList.contains('ring-button-active')) {
        button.classList.remove('ring-button-active')
    }
    else {
        button.classList.add('ring-button-active')
    }
    updateTimeline();
}






// ------------------------- SVG Lines -------------------- //


function populateLines() {
    let svg = d3.select('#svg-box')
    svg.selectAll('.line').remove()
    let lines = svg.selectAll('.line')
        .data(lines_t)
        .enter()
        .append('path')
            .attr('class', 'line')
            .attr('d', function(d) { return getLinePath(d.x1, d.y1, d.x2, d.y2); })
}

function udpateLines() {
    let svg = d3.select('#svg-box')
    let lines = svg.selectAll('.line')
        .data(lines_t)
    lines.transition()
        .attr('d', function(d) { return getLinePath(d.x1, d.y1, d.x2, d.y2); })
        .duration(1500)
}

function getLinePath(x1, y1, x2, y2) {
    let string = 'M ' + parseInt(x1) + ' ' + parseInt(y1) + ' L ' + parseInt(x2) + ' ' + parseInt(y2);
    return string;
}

function highlightConnections(name) {
    if (bools.speakerSelected) return;
    bools.speakerHover = true;
    let current = data_t.find(obj => obj.name == name);
    let svg = d3.select('#svg-box')
    let lines = svg.selectAll('.line')
        .data(lines_t)
        .attr('class', function(d) { return (d.source == name || d.target == name) ? 'line line-highlighted' : 'line line-faded'})

    let items = svg.selectAll('.item')
        .data(data_t)
        .style('opacity', function(d) { return (d.name == name || d.connections.includes(current.name)) ? 1 : .2})

}
function resetHighlightConnections() {
    if (bools.speakerSelected) return;
    let svg = d3.select('#svg-box')
    let lines = svg.selectAll('.line')
        .data(lines_t)
        .attr('class', 'line')

    let items = svg.selectAll('.item')
        .data(data_t)
        .style('opacity', 1)
}





// ------------------------- Zoom ------------------------- //

let pinchDist = 0;
let startX = 0;
let startY = 0;
let viewBox = [-500, -500, 1000, 1000] // Does this match what's on the html file?
let page_scale = 1;

let tsfms = {
    zoom: 1.5,
    x: 0,
    y: 100
}
function getSVGTransform() {
    return "scale(" + tsfms.zoom + ") translateX(" + tsfms.x + ") translateY(" + tsfms.y + ")";
}

function setViewBox() {
    // top left width height
    let viewBoxString = parseFloat(viewBox[0]) + ' ' + parseFloat(viewBox[1]) + ' ' + parseFloat(viewBox[2]) + ' ' + parseFloat(viewBox[3])
    document.getElementById('svg-box').setAttribute('viewBox', viewBoxString)
}



function snapSVGView(option) {
    if (option == 'O') {
        viewBox = [-500, -500, 650, 650];
        page_scale = 0.6;
    }
    else if (option == 'S') { 
        viewBox = [-5, -435, 550, 550];
        page_scale = 0.55; 
    }
    else if (option == 'N') {
         viewBox = [-10, -430, 300, 300];
         page_scale = 0.3; 
    }
    else if (option == 'B') {
         viewBox = [130, -350, 430, 430];
         page_scale = 0.43;  
    }
    setViewBox();
}

function zoom(scale) {

    viewBox[0] += viewBox[3] * (1 - scale) / 2;
    viewBox[1] += viewBox[2] * (1 - scale) / 2;
    viewBox[2] *= scale;
    viewBox[3] *= scale;
    page_scale *= scale;
    
    setViewBox();
}

svgBox.addEventListener('touchstart', function(e) {onTouchDownSVG(e)})
svgBox.addEventListener('touchmove', function(e) {onTouchMoveSVG(e)})
svgBox.addEventListener('touchend', function(e) {onTouchEndSVG(e)})

function onTouchDownSVG(e) {
    if (e.touches.length == 1) {
        bools.touchDown = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        bools.pinch = false;
    }
    else if (e.touches.length == 2) {
        // pinch zoom
        bools.touchDown = false;
        bools.pinch = true;
        pinchDist = Math.hypot((e.touches[0].clientX - e.touches[1].clientX), (e.touches[0].clientY - e.touches[1].clientY));
    }
    else {
        bools.touchDown = false;
        bools.pinch = false;
    }
}

function onTouchMoveSVG(e) {
    e.preventDefault();
    if (bools.touchDown) {
        let x = e.touches[0].clientX;
        let slideX = 1.3 * (x - startX) * page_scale;  
        viewBox[0] -= slideX;
        let y = e.touches[0].clientY;
        let slideY = 1.3 * (y - startY) * page_scale;
        viewBox[1] -= slideY;

        // console.log(slideX, slideY)



        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        setViewBox();
    }
    else if (bools.pinch) {
        let newPinchDist = Math.hypot((e.touches[0].clientX - e.touches[1].clientX), (e.touches[0].clientY - e.touches[1].clientY));
        // console.log(newPinchDist, pinchDist);
        zoom(pinchDist / newPinchDist);
        pinchDist = newPinchDist;
    }
}


function onTouchEndSVG(e) {
    if (e.touches.length == 0) {
        bools.touchDown = false;
        bools.pinch = false;
    }
    else if(e.touches.length == 1) {
        // cannot go to panning after zooming - this stops the graphic from jumping
        bools.touchDown = false;
        bools.pinch = false;
    }
    else if (e.touches.length == 2) {
        bools.touchDown = false;
        bools.pinch = true;
    }
    else {
        bools.touchDown = false;
        bools.pinch = false;
    }
}

svgBox.addEventListener('mousedown', function(e) { onMouseDownSVG(e); })
svgBox.addEventListener('mousemove', function(e) { onMouseMoveSVG(e); })
svgBox.addEventListener('mouseup', function(e) { onMouseUpSVG(e); })
svgBox.addEventListener('wheel', function(e) {
    onMouseScroll(e); })

function onMouseDownSVG(e) {
    bools.mouseDown = true;
    bools.svgPan = true;
    startX = e.pageX;
    startY = e.pageY;
}

function onMouseMoveSVG(e) {
    if (bools.mouseDown && bools.svgPan) {
        let x = e.pageX;
        let slideX = 1.3 * (x - startX) * page_scale;  
        viewBox[0] -= slideX;
        let y = e.pageY;
        let slideY = 1.3 * (y - startY) * page_scale;
        viewBox[1] -= slideY;

        startX = e.pageX;
        startY = e.pageY;
        setViewBox();
    }
}

function onMouseUpSVG(e) {
    bools.mouseDown = false;
    bools.svgPan = false;
}

function onMouseScroll(e) {
    e.preventDefault(); // prevents page from scrolling
    if (e.deltaY < 0) {
        zoom(1 / 1.1);
    }
    else {
        zoom(1.1);
    }
}















// --------------------- General Event Listeners ------------------------ //

const sideBarElement = document.getElementById('sidebar-container');
const sideBarSheet = document.getElementById('sidebar-sheet');
sideBarElement.addEventListener('mouseenter', function(e) {
    bools.sidebarHover = true;
    if (bools.boxMove) {
        bools.spotlightEnter = true;
        sideBarSheet.classList.add('hover')
        sideBarSheet.classList.remove('hidden')

        // document.getElementById('sidebar-sheet').classList.remove('hidden')
        // document.getElementById('sidebar-sheet').classList.add('fade-in')
        console.log(ev_t.currentBox);
    }
});
sideBarElement.addEventListener('mouseup', function(e) {
    if (bools.spotlightHasSubject) {
        
        setTimeout(() => {
            sideBarSheet.classList.remove('hover')
            sideBarSheet.classList.add('hidden')
        }, 300)

        updateExtContent()
        extendSpotlightPage()
        ev_t.currentBox.top = 48 * ev_t.spotlightCount++ % 240 + 10;
        ev_t.currentBox.left = (window.innerWidth - ev_t.sidebarWidth) - ev_t.currentBox.width - 30;
        moveBoxes(false);
    }
});
sideBarElement.addEventListener('mouseleave', function(e) {
    bools.spotlightEnter = false;
    bools.sidebarHover = false;

    if (bools.boxMove) ;
});

// svgBox.addEventListener('mouseenter', function() {
//     if (bools.boxMove) {
//         document.getElementById('sidebar-sheet').classList.remove('fade-in')
//         document.getElementById('sidebar-sheet').classList.add('fade-out')
//         setTimeout(() => {
//             document.getElementById('sidebar-sheet').classList.add('hidden')
//             document.getElementById('sidebar-sheet').classList.remove('fade-out')
//         }, 300)
//     }
// })

window.addEventListener('mousemove', function(e) {
    if (bools.boxMove) {
        // if (ev_t.spotlightHintCount < 3)
        onMouseMoveBox(e);
        return;
    }
    if (bools.boxResize) {
        onBoxResizeMove(e)
    }
});

function triggerSpotlightHint() {
    if (ev_t.spotlightHintCount > 3) return;
    if (!bools.hintReady) return;
    ev_t.spotlightHintCount++
    bools.hintReady = false;
    let hint = document.getElementById('spotlight-hint');
    hint.classList.remove('spotlight-hint-animate');
    hint.classList.add('spotlight-hint-animate');
    setTimeout(() => {
        hint.classList.remove('spotlight-hint-animate');
        bools.hintReady = true;
    }, 4000)
}

function mouseUp() {
    bools.mouseDown = false;
    bools.boxMove = false;
    bools.boxResize = false;
    bools.spotlightHasSubject = false;
    setTimeout(() => {
        sideBarSheet.classList.remove('hover')
        sideBarSheet.classList.add('hidden')
    }, 100)
}

const tooltip = document.querySelector('#tooltip')

function updateToolTip(string) {
    // get tooltip and change text
    tooltip.innerHTML = string;
}

function showToolTip() {
    // change visibility of tooltip
    tooltip.classList.replace('hidden', 'visible')
}

function hideToolTip() {
    // change visibility of tooltip
    tooltip.classList.replace('visible', 'hidden')
}


window.addEventListener('mousemove', function(e) {
    tooltip.style.top = e.pageY - ev_t.ceiling + 'px';
    tooltip.style.left = e.pageX + 10 + 'px';
})


window.addEventListener('mouseup', function(e) {
    // console.log(e)
    mouseUp();
});

