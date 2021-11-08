// console.log('speaker Info')

let state = {
    currentSpeaker: "nephi1", // uses id name
    speakerData: [],
    chartType: '3dChart',
}

const urlParams = new URLSearchParams(window.location.search);
if (data.speakers.find(obj => obj.name == urlParams.get('speaker'))) {
    state.currentSpeaker = urlParams.get('speaker')
    state.speakerData = data.speakers.find(obj => obj.name == urlParams.get('speaker'))
}
else {
    console.log('Speaker not found - loading Nephi...')
    state.currentDataSet = 'nephi1'
}
// console.log('loaded ', state.currentSpeaker)

function updateStats() {
    document.getElementById('percentage-stat').innerHTML = state.speakerData.percentage + "%";
}

function updateIncoming() {
    let box = d3.select('#incoming-connections');
    let cxs = box.selectAll('speaker-icon-small')
        .data(state.speakerData.incoming.filter(obj => obj.type.includes("language")))
        .enter()
        .append('div')

            .on('click', function(d, obj) {return updateSpeakerBanner(obj)})
            .on('mouseover', function(e, d) { return tooltipOn(d)})
            .on('mouseout', function() { return tooltipOff()})
            
            .attr('class', 'speaker-icon-small')
            .append('img')
                .attr('class', 'speaker-icon-small-image')
                .attr('src', function(d) { 
                    const imageString = "./images/" + d.name + ".jpg"
                    return  imageString
                })
                .attr('alt', function(d) { return getDisplayName(d.name) })
                .style('opacity', '0')
                .attr('title', function(d) { return getDisplayName(d.name)})



    cxs.transition()
        .style('opacity', '1')
        .duration('300')
        .delay(function(d, i) {return 100 * i})
}

function updateOutgoing() {
    let box = d3.select('#outgoing-connections');
    let cxs = box.selectAll('speaker-icon-small')
        .data(state.speakerData.outgoing.filter(obj => obj.type.includes("language")))
        .enter()
        .append('div')
            .on('click', function(d, obj) {return updateSpeakerBanner(obj)})
            .on('mouseover', function(e, d) { return tooltipOn(d)})
            .on('mouseout', function() { return tooltipOff()})

            .attr('class', 'speaker-icon-small')
            .append('img')
                .attr('class', 'speaker-icon-small-image')
                .attr('src', function(d) { 
                    const imageString = "./images/" + d.name + ".jpg"
                    return  imageString
                })
                .attr('alt', function(d) { return getDisplayName(d.name) })
                .style('opacity', '0')
                .attr('title', function(d) {return getDisplayName(d.name)})
            

    cxs.transition()
        .style('opacity', '1')
        .duration('300')
        .delay(function(d, i) {return 100 * i})
}

function updateSocialCX() {
    let box = d3.select('#social-connections');
    let cxs = box.selectAll('speaker-icon-small')
        .data(state.speakerData.outgoing.filter(obj => (!obj.type.includes("language") || obj.type.length > 1)))
        .enter()
        .append('div')
            .on('click', function(d, obj) {return updateSpeakerBanner(obj)})
            .on('mouseover', function(e, d) { return tooltipOn(d)})
            .on('mouseout', function() { return tooltipOff()})
            
            .attr('class', function(d) {return getClassForSmallIcon(d)})
            .append('img')
                .attr('class', 'speaker-icon-small-image')
                .attr('src', function(d) { 
                    const imageString = "./images/" + d.name + ".jpg"
                    return  imageString
                })
                .attr('alt', function(d) { return getDisplayName(d.name) })
                .style('opacity', '0')
                // .attr('title', function(d) {
                //     let title = getDisplayName(d.name) + " - ";
                //     let array = d.type;
                //     if (array.includes('language')) array.splice(array.indexOf('language'), 1)                    
                //     for (let i = 0; i < array.length; i++) {
                //         title += array[i]
                //         if (i < array.length - 1) title += ", "
                //     }
                //     return title
                // })
                
                .on('click', function(d, obj) {return updateSpeakerBanner(obj)})
            

    cxs.transition()
        .style('opacity', '1')
        .duration('300')
        .delay(function(d, i) {return 100 * i})
}

function getClassForSmallIcon(d) {
    if (d.type.includes('language')) d.type.splice(d.type.indexOf('language'), 1) 
    if (d.type.length > 1) {
        return 'speaker-icon-small icon-multiple'
    }
    else {
        return 'speaker-icon-small icon-' + d.type[0].toLowerCase()
    }
}

function updateTimeline() {
    // not using d3 for now
    document.getElementById('birth').innerHTML = "Birth: " + state.speakerData.lifespan.start;
    document.getElementById('death').innerHTML = "Death: " + state.speakerData.lifespan.end;
}

function updateInfo() {
    // Update Title
    let title = document.getElementById('info-title');
    title.innerHTML = "Timeline - " + getDisplayName(state.currentSpeaker)
    let image = document.getElementById('main-image');
    const imageString = './images/' + state.currentSpeaker + '.jpg'
    image.setAttribute('src', imageString)

    updateTimeline();
    updateStats();
    updateIncoming();
    updateOutgoing();
    updateSocialCX();
}
updateInfo();

// document.getElementById('arc-button').click()
// document.getElementById('3d-button').click()

document.getElementById('scroll-spin-button').click()
document.getElementById('scroll-spin-button').click()
