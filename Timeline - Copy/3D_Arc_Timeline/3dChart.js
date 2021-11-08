// console.log('3d')

let data3d = []

let framework_initial = [
    {date: "0 BC", text: 'Birth of Christ'},
    {date: "425 AD", text: 'Moroni buries the plates'},
    {date: "595 BC", text: 'Lehi & family leave Jerusalem'},
    {date: "91 BC", text: 'Reign of Judges begins'},
    {date: "340 AD", text: 'Moroni born'},

]
let framework = []

let settings3d = {
    timelineWidth: 1000,
    spin: true,
    scaled: false,
    widthMultiplier: 4.5,
    percentageMin: -1,
    percentageMax: 100,
    nameCheck: true,
}

let state3d = {
    currentScroll: -15,
    scrollAtStart: -15,
    isDown: false,
    startX: 0,
    timeStamp: 0, // this needs to be set at the start of the animation
}

document.getElementById('scroll-spin-button').addEventListener('click', function(e) {
    // console.log('click', e)
    toggleScrollSpin(e);
    return
})

function scale() {
    if (settings3d.scaled) {
        settings3d.scaled = false;
        // document.getElementById('scale-button').innerHTML = "Scaled"
    }
    else {
        settings3d.scaled = true;
        // document.getElementById('scale-button').innerHTML = "Not scaled"
    }
    convertJSON3d();
    populate3d();
    addFramework();
}

function getNumFromDate(date) {
    let num = date.substring(0, date.length - 3);
    if (num == 'N') { return -1} // speaker has no lifespan
    num = parseInt(num);
    if (date.substring(date.length - 2, date.length) == 'BC') {
        num *= -1;
    }
    num += 2250;
    num = num / 2750;
    // console.log(num)
    if (settings3d.scaled) {
        if (num < .58) { // before apx 650 BC - OT timeline
            num /= .58;
            num *= .10;
        }
        else { // after apx 650 BC - standard BOM timeline
            num -= .58;
            num /= .42;
            num *= .90;
            num+= .10;
        }
    }
    if (num > 1 || num < 0) console.log(num)
    num *= 1000;
    // console.log(num)
    return num;
}

function getY(id) {
    let y = 0;
    if (group_major.includes(id)) {
        y += -50
        y += group_major.indexOf(id) % 10 * 5
    }
    else if (group_secondary.includes(id)) {
        y += 20
        y += group_secondary.indexOf(id) % 10 * 5
    }
    else if (group_minimal.includes(id)) {
        y += 90
        y += group_minimal.indexOf(id) % 10 * 5
    }
    else if (group_jaredites.includes(id)) {
        y += 150
        y += group_jaredites.indexOf(id) % 10 * 5
    }
    else if (group_OT.includes(id)) {
        y += 180
        y += group_OT.indexOf(id) % 10 * 5
    }







    return y;
    // return Math.random() * 200
}
function getHeightFromPercent(num) {
    return 4 + 10 * Math.sqrt(num);
}

function convertJSON3d() {
    data3d = [];
    
    for (speaker of data.speakers) {
        // console.log(speaker.name)
        let x = getNumFromDate(speaker.lifespan.start);
        if (x == -1) continue; // speaker has no lifespan
        let width = getNumFromDate(speaker.lifespan.end) - x;
        // console.log(speaker.name, speaker.percentage, settings3d.percentageMin, settings3d.percentageMax)
        if (parseFloat(speaker.percentage) < settings3d.percentageMin || parseFloat(speaker.percentage) > settings3d.percentageMax) {
            
            continue;
        }
        // console.log('add', speaker.name)
        data3d.push({
            name: speaker.name,
            // incoming: speaker.incoming,
            // outgoing: speaker.outgoing,
            height: getHeightFromPercent(speaker.percentage),
            percentage: speaker.percentage,
            width: width * settings3d.widthMultiplier,
            x: x,
            y: getY(speaker.name),
            lifespan: speaker.lifespan
            
        })
    }
}
convertJSON3d();

function createFramework() {
    // Needs to convert because the location will change depending on scale
    framework = [];
    for (item of framework_initial) {
        let x = getNumFromDate(item.date)
        framework.push({
            x: x,
            type: 'line'
        })
        let htmlText = '<div>' + item.date + "</div><div>" + item.text + "</div>"
        framework.push({
            x: x,
            type: 'text',
            text: htmlText
        })
    }
    let num_segments = 200
    for (let i = 0; i < num_segments; i++) {
        framework.push({
            x: i/num_segments * 1000,
            type: 'ring'
        })
    }

    // I could create a more elaborate data structure for the rings and build it with d3. That would allow different colors, hover abilities, etc.
}

function getStyleFramework(d) {
    let x = "--x:" + d.x/settings3d.timelineWidth + ";";
    return x;
}

function addFramework() {
    createFramework();

    let timeline = d3.select('#timeline-3d')
    timeline.selectAll('.framework').remove()
    timeline.selectAll('.framework')
        .data(framework)
        .enter()
        .append('div')
            .attr('class', function(d) {
                if (d.type == 'line') return 'framework framework-line'
                if (d.type == 'text') return 'framework framework-text'
                if (d.type == 'ring') return 'framework framework-ring'
            })
            .attr('style', function(d) { return getStyleFramework(d) })
            .html(function(d) {
                if (d.type == 'text') return d.text;
                else return '';
            })
}


function populate3d() {
    let timeline = d3.select('#timeline-3d')

    timeline.selectAll('.event').remove()
    // console.log(data3d)
    timeline.selectAll('.event')
        .data(data3d)
        .enter()
        .append('div')
            .on('mouseover', function(e, d) { return tooltipOn(d)})
            .on('mouseout', function() { return tooltipOff()})
            
            .attr('class', function(d) {
                return 'event ' + getGroupString(d.name)
            })
            .attr('style', function(d) {return getStyleVarString(d)})
            .style('height', function(d) {return d.height})
            .style('width', function(d) {return d.width})

            .on('click', function(e, d) {
                updateSpeakerBanner(d)
                center(d)
            })

            .append('div')
                .attr('class', 'event-title')
                .text(function(d) { if (settings3d.nameCheck) return getDisplayName(d.name) })

    timeline
            .on('mousedown', function(e) {onMouseDown(e)})
            .on('mouseup', function(e) {onMouseUp(e)})
            // .on('mouseleave', function(e) {onMouseLeave(e)})
            .on('mousemove', function(e) {onMouseMove(e)})


            
}

function getStyleScrollVar(scroll) {
    return '--scroll: ' + scroll + 'deg; --position: ' + state3d.scrollAtStart + 'deg;'
}

function scrollChange(shift) {
    if (settings3d.spin == true) document.getElementById('scroll-spin-button').click()
    setTimelineScroll(state3d.currentScroll + parseInt(shift));
}

function setTimelineScroll(num) {
    state3d.currentScroll = num;
    document.getElementById('timeline-3d').setAttribute('style', getStyleScrollVar(state3d.currentScroll, state3d.scrollAtStart));
}
setTimelineScroll(0);

function getZDepth(num) {
    // 0 to 1% > 800 to 750
    if (num < 1) return 800 - num * 100    
    // 1% to 35% > 750 to 650
    return 700 - num
}

function getStyleVarString(d) {
    let x = " --x:" + d.x/settings3d.timelineWidth + ";";
    let y = " --y:" + d.y + ";";
    let z = " --z:" + getZDepth(d.percentage) + ";";
    // let z = " --z: 650;";
    let height = " --height:" + d.height + ";";
    let width = " --width:" + d.width + ";";
    return x + y + z + height + width;
}
function testFn() {
    console.log('down')
}

function secondsToDegrees(num) {
    // animation as of 8/6/21 - 30s for 360deg
    // 30000 > 360
    // 1000 > 12
    return num / 30000 * 360
}

function spin(e) {
    // position variable needs to be where the current scroll is
    state3d.scrollAtStart = state3d.currentScroll
    state3d.timeStamp = e.timeStamp;
    setTimelineScroll(state3d.currentScroll)



    settings3d.spin = true;
    document.getElementById('timeline-3d').setAttribute('class', 'timeline-3d spin-animation');
    // document.getElementById('scroll-spin-button').innerHTML = 'Scroll';
}
function scroll(e) {
    // position variable needs to be where the current scroll is plus animation scrolling
    let timePassed = e.timeStamp - state3d.timeStamp;
    // console.log('length of animation', timePassed)
    // console.log('degrees spun', secondsToDegrees(timePassed))
    state3d.currentScroll -= secondsToDegrees(timePassed);

    setTimelineScroll(state3d.currentScroll)



    settings3d.spin = false;
    document.getElementById('timeline-3d').setAttribute('class', 'timeline-3d timeline-scroll');
    // document.getElementById('scroll-spin-button').innerHTML = 'Spin';
}

function toggleScrollSpin(e) {
    // console.log(state3d.currentScroll, state3d.scrollAtStart)
    if (settings3d.spin) {
        // To Scroll
        scroll(e)
    }
    else {
        // To Spin
        spin(e);
    }
}

function center(item) {
    if (settings3d.spin == true) document.getElementById('scroll-spin-button').click()
    let pos = Math.trunc(state3d.currentScroll / 360);
    pos *= 360;
    setTimelineScroll(pos + item.x / settings3d.timelineWidth * -360 - 6)
    console.log(item)
}

// scrolling functions

let scrollBox = document.getElementById('scroll-box');
scrollBox.addEventListener('mousedown', function(e) {onMouseDown(e)})
scrollBox.addEventListener('mousemove', function(e) {onMouseMove(e)})
scrollBox.addEventListener('mouseleave', function(e) {onMouseLeave(e)})
scrollBox.addEventListener('mouseup', function(e) {onMouseUp(e)})


function onMouseDown(e) {
    state3d.isDown = true;
    state3d.startX = e.pageX;
}
function onMouseUp(e) {
    state3d.isDown = false;
    state3d.startX = e.pageX
}
function onMouseLeave(e) {
    state3d.isDown = false;
}
function onMouseMove(e) {
    if (!state3d.isDown) return;
    e.preventDefault();
    let x = e.pageX;
    let slide = (x - state3d.startX) / 5;
    setTimelineScroll(state3d.currentScroll + slide)
    state3d.startX = e.pageX;
}

function updateInfo(d) {
    console.log(d)
    document.getElementById('stat-1').innerHTML = d.name;
    document.getElementById('stat-2').innerHTML = d.lifespan.start + " to " + d.lifespan.end;
    // document.getElementById('stat-3').innerHTML = d.x;
    // document.getElementById('stat-4').innerHTML = d.y;
}

function checkNames() {
    settings3d.nameCheck = !settings3d.nameCheck;
    filter3d()
}

function filter3d(event) {
    if (event != undefined) {
        event.preventDefault();  
    }
    // console.log(document.getElementById('percentage-min').value, document.getElementById('percentage-max').value)
    settings3d.percentageMin = parseFloat(document.getElementById('percentage-min').value);
    settings3d.percentageMax = parseFloat(document.getElementById('percentage-max').value);

    convertJSON3d();
    populate3d();
    addFramework();
}

populate3d();
addFramework();