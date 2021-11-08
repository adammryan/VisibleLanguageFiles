/*
This javascript file is linked to packedbubbles.html and controls the drawing of the packed
bubble charts. The javascript to draw the tree charts is found in the treecharts.html file, not
a separate js file. I intended to separate it from the html, but never reached that point.
*/

// Some documentation added by Adam Ryan - November 2021



// Initialization of Bubbles app state
let state =  {
    currentDataSet: "nephi1",
    currentChartType: "content",
    currentChartData: {},
    isDrillDown: false,
    currentFilteredData: {},
    isFiltered: false,
    isInitialized: false,
    showTooltip: false,
    currentSpeakerData: {},
    animateBubbles: true,
}
const urlParams = new URLSearchParams(window.location.search);
let path = window.location.pathname;
let pathArray = path.substr(1).split("/");
if (pathArray[1] == "speaker" && idNames.includes(pathArray[2])) {
    console.log("hello")
    state.currentDataSet = pathArray[2];
}
else {
    state.currentDataSet = 'nephi1';
}
const filterBaseRange = ['Priority/Rank', 'Frequency']

let filter = {
    rangeFilter: "Priority/Rank", // other option - count // this needs to match the name of the array item set above
    typeFilterBasePOS: ['noun', 'adjective', 'verb', 'adverb', 'preposition', 'conjunction', 'article', 'pronoun', 'auxiliary-verb'], // this is all selected - unchanged
    typeFilterBaseTheme: ['sacred', 'non-sacred', 'function', 'miscellaneous', 'transition'],
    typeFilterCurrent: ['noun', 'adjective', 'verb', 'adverb', 'preposition', 'conjunction', 'article', 'pronoun', 'auxiliary-verb'], // current selected - default all
    uniqueFilter: "All", // other options "Unqiue", "Not Unique"
}

const chartId = '#graph-display';

const legendFieldsPOS = ['noun', 'adjective', 'verb', 'adverb', 'preposition', 'conjunction', 'article', 'pronoun', 'auxiliary-verb']
const legendFieldsFunction = ['adverb', 'preposition', 'conjunction', 'article', 'pronoun', 'auxiliary-verb']
const legendFieldsContent = ['noun', 'verb']
// const legendFieldsThemes = ['war', 'plan-of-salvation', 'locations', 'transition', 'promise', 'scripture', 'teaching', 'prophets', 'history', 'love']
const legendFieldsThemes = ['Sacred', 'Non-Sacred', 'Function', 'Transition', 'Miscellaneous']

const selectPOS = ['All', 'Noun', 'Adjective', 'Verb', 'Adverb', 'Preposition', 'Conjunction', 'Article', 'Pronoun', 'Auxiliary Verb']
const selectContent = ['All', 'Noun', 'Verb']
const selectFunction = ['All', 'Adverb', 'Preposition', 'Conjunction', 'Article', 'Pronoun', 'Auxiliary Verb']
const selectTheme = ['All', 'Sacred', 'Non-Sacred', 'Function', 'Transition', 'Miscellaneous']

function fillDropDown() {
    let dropdown = document.getElementById('dropdown');
    for (id of idNames) {
        let option = document.createElement('option');
        option.setAttribute('value', id);
        option.innerHTML = idNameToDisplayName(id);
        dropdown.appendChild(option);
    }
}
fillDropDown();

// The animation can take a little long sometimes, you can turn it off
function toggleAnimate() {
    const button = document.getElementById('check-animate');
    if (state.animateBubbles) {
        // turn off animation
        button.classList.remove('animate-on')
        button.classList.add('animate-off')
    }
    else {
        // turn on animation
        button.classList.add('animate-on')
        button.classList.remove('animate-off')
    }
    state.animateBubbles = !state.animateBubbles;
}

// changes "My Class" to "my-class"
function getClassName(name) {
    const lowerCaseName = name.toLowerCase();
    let className = "";
    for (let i = 0; i < lowerCaseName.length; ++i) {
        if (lowerCaseName[i] == ' ') {
            className += '-';
            continue;
        }
        className += lowerCaseName[i];
    }
    return className;
}

function clearChart() {
    d3.selectAll(`${chartId} > *`).remove();
    // addAnimateCheck();
    return;
}

// I believe I decided another way to toggle animation
function addAnimateCheck() {
    let display = document.getElementById("graph-display");
    let check = document.createElement('div')
    check.innerHTML = 'Animate';
    check.setAttribute('id', 'animate-check');
    check.setAttribute('class', 'checked')
    display.appendChild(check)
}

function resetUISettings() {
    state = {
        ...state,
        isDrillDown: false,
        currentFilteredData: {},
        isFiltered: false,
    }

    return;
}

// Creates tooltip at mouse
function tooltipEventListener(e) {
    const toolTip = document.querySelector('.tooltip');

    if (toolTip == null) return;

    toolTip.style.left = e.pageX + 'px';
    toolTip.style.top = e.pageY + 'px';

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

function showText(text, fontSize, y = 0, radius) {
    return radius > 30;
}

function mouseOver(event, data) {
    // console.log('over')
    const tooltip = d3.select(".tooltip");

    d3.select(this).select('circle')
                .attr('class', `${getClassName(state.currentChartType == 'theme' ? data.data.theme : data.data.partOfSpeech)} bubble-hover`);

    // Adds tooltip if text will overflow
    // replaced this !state.isDrillDown && !state.showTooltip && !(showText(data.data.name, 16, 10, data.r) && showText(data.data.size, 14, 10, data.r)) with true
    if (true) {	
        tooltip
            .attr('class', 'tooltip tooltip--visible');	
        tooltip
            .html(data.data.name + "<br/>"  + data.data.size);
            state.showTooltip = true;

        createTooltipEventListener();
    }
    return;
}

function mouseOut(event, data) {
    const tooltip = d3.select(".tooltip");
    d3.select(this).select('circle')
        .attr('class', getClassName(state.currentChartType == 'theme' ? data.data.theme : data.data.partOfSpeech));
    // Hides tooltip
    state.showTooltip = false;
    destroyTooltipEventListener();
    tooltip
        .attr('class', 'tooltip');

    return;
}

function onClick(event, data) {

    if (state.showTooltip) {
        state.showTooltip = false;
        destroyTooltipEventListener();
    }

    // clear tooltip in the case that the user is clicking while hovering
    const tooltip = d3.select(".tooltip");
    tooltip
        .attr('class', 'tooltip');

    if (state.isDrillDown) {
        state.isDrillDown = !state.isDrillDown;
        // renderChart(state.isFiltered ? state.currentFilteredData : state.currentChartData);
        goButton(event); // This one keeps the filters on
    } else {
        state.isDrillDown = !state.isDrillDown;
        renderChart({children: [{...data.data}]});
    }
    return;
}

function updateSpeakerData(speaker) {
    // fetch JSON object from folder

    state.currentSpeakerData = getSpeakerDataJSON(speaker);
    // update state data to JSON object
}
updateSpeakerData(state.currentDataSet); // test

function renderChart(data = state.currentChartData) {
    clearChart();

    if (data.children.length == 0) return;
    const MAX_QUANTITY = 1000;

    // Change dataset depending on user parameters
    var dataArrayFinal = [];

    var min = Number(document.getElementById("wordmin").value);
    var max = Number(document.getElementById("wordmax").value);
    // console.log(max,min)
    if (min == undefined || min == null) { min = 0; }
    if (max == undefined || max == null) { max = 100; }

    if (max < min) {
        let temp = max;
        max = min;
        min = temp;
    } // swap to give the right top/bottom

    // check to make sure range is not outside available data set for rank order
    if (filter.rangeFilter == "Priority/Rank") {
        var limit = data.children.length;
        if (limit < max) { max = limit; }
        if (max - min > MAX_QUANTITY) { max = min + MAX_QUANTITY; }
    }

    
    // update data array from user parameters    
    
    if (filter.rangeFilter == "Priority/Rank") {
        if (min > 0) {
            min -= 1;
        }
        for (let i = min; i < max; i++) {
            dataArrayFinal.push(data.children[i]);
        }
    }
    else { // by frequency
        dataArrayFinal = data.children.filter(a => a.size >= min)
        dataArrayFinal = dataArrayFinal.filter(a => a.size <= max)
    }
    
    // returns if filter makes length 0 - doesn't try to iterate through empty array
    if (dataArrayFinal.length == 0) return;

    if (!state.isInitialized) {
        state.isInitialized = true;
        document.getElementById('graph-container').className = "graph graph--initialized";
    }

    const svg = d3.select(chartId).append('svg')
                    .attr("viewBox", '0 0 800 800')
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .attr("class", "svg-graph")
                    .attr('style', state.isDrillDown ? `clip-path: circle(${800/2}px at 50% 50%)` : '')
                    .attr('id', 'svg-graph')

    
    // create tooltip
    if (!state.isDrillDown) {
        d3.select(chartId)
            .append('div')
            .attr('class', 'tooltip');
    }

    // These next few declarations are what generates the bubble sizes and positions from the dataset

    // Creates bubble pack instance
    const bubblePack = d3.pack()
                    .size([800, 800])
                    .padding(0);

    // Constructs hierarchical data 
    const rootNode = d3.hierarchy({children: dataArrayFinal})
                    .sum(d => d.size)
                    .sort(() => null);

    // Creates bubble pack with data
    const nodes = bubblePack(rootNode);

    const graph = svg.selectAll('g')
        .data(nodes.children)
        .enter()
        .append('g')
        .attr('transform', function(d) { return 'translate(' + d.x + ',' + (d.y) + ') scale(.7)'; })
        .attr('width', function(d) { return d.r * 2 })
        .attr('height', function(d) { return d.r * 2 })

        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
        .on('click', onClick)

        .style('opacity', 0)
        // .attr('class', 'bubble')

    graph.transition()
        .style('opacity', 1)
        .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ') scale(1)'; })
        .duration(state.animateBubbles? 700 : 0)
        .delay(function(d, i) { return getBubbleDelay(i, nodes.children.length)})
    // Add individual circles
    // console.log(graph)
    graph
        .append('circle')
        .attr('r', function(d) { return d.r - 3; })
        .attr('class', function(data) { return getClassName(state.currentChartType == 'theme' ? data.data.theme : data.data.partOfSpeech) });
   
    // Add text to each circle
    const textContainer = graph
                            .append('text')
                            .attr('text-anchor', 'middle')
                            .attr('dominant-baseline', 'middle')
                            .attr('class', state.isDrillDown ? 'bubble-text--drilldown' : 'bubble-text');

    
    
    
    // Adds name text
    textContainer
        .append('tspan')
        .attr('y', d => state.isDrillDown ? (d.r / 1.5) * -1 : -2)
        .attr('x', 0)
        .attr('transform', function(d) { return 'translate(' + 0 + ',' + (state.isDrillDown ? (d.r / 1.5) * -1 : -10) + ')'; })
        .text(data => data.data.name)
        .attr('alignment-baseline', data => data.r < 200 ? 'text-top' : 'text-bottom')
        .attr('class', 'bubble-title')
        .attr('font-size', data => data.r / 3 + 5 - data.data.name.length / 1.5 + "px");

    
    // Adds size text
    textContainer
        .append('tspan')
        .attr('y', d => state.isDrillDown ? (d.r / 2) * -1 : (d.r / 4) + 5 ) 
        .attr('x', 0)
        .attr('alignment-baseline', 'text-bottom')
        // .text(data => state.isDrillDown || (showText(data.data.name, 16, 10, data.r) && showText(data.data.size, 14, 10, data.r)) ? data.data.size : '')
        .text(data => state.isDrillDown || showText(data.data.size, 14, 10, data.r) ? data.data.size : '')
        .attr('font-size', data => data.r / 10 + 10 + "px");

    if (state.isDrillDown) { 
        // Adds marquee animation
        // textContainer
        //     .append('tspan')
        //     .attr('y', 30)
        //     .attr('text-anchor', 'center')
        //     .attr('class', 'drilldown-verse')
        //     .attr('textLength', 400)
        //     .text(d => d.data.sourceText)   

        
        let graphDisplay = d3.select("#graph-display");
        graphDisplay.data(nodes.children)
            .append('div')
                .attr('class', 'drilldown-verse')
                .html(d => boldKeyWordInSelection(d.data.name, d.data.sourceText))
                .style('font-size', d => d.data.sourceText.length > 180 ? (18 - (d.data.sourceText.length - 180) / 50) + 'px' : '18px')
                .style('--verse-reference', function(d) {
                    console.log(d);
                    return "'Reference'";
                })


            
        // Adds read more button
        textContainer
            .append('a')
            .on('click', (event) => event.stopPropagation())
            .attr('href', d => `https://${d.data.url}`)
            .attr('target', '_blank')
            .attr('class', 'read-more')
                .append('tspan')
                .attr('y', d => d.r / 2)
                .attr('x', 0)
                .html('Read More &#8250;')

    }

    return;
}

function getBubbleDelay(x, size) {
    if (size == 1 || !state.animateBubbles) return 0;
    // return (( x*x / (size * size) - 1) / (x / size + .25) + 4) * 1000
    // return (Math.pow(7 * (x), 1/2) - Math.pow(3 * (x), 1/2)) * 700
    return Math.atan(x/10) * 2500
}

function boldKeyWordInSelection(keyWord, selection) {
    let newSelection = "";
    let words = selection.split(' ');
    for (let word of words) {
        if (
            word.toLowerCase() == keyWord.toLowerCase() || checkEndPunctuationEquals(word, keyWord) ) {
            word = "<strong>" + word + "</strong>"
        }
        newSelection += word;
        newSelection += " ";
    }
    if (keyWord.split(' ').length > 1) {
        return selection.replace(keyWord, "<strong>" + keyWord + "</strong>")
    }
    return newSelection;
}

function checkEndPunctuationEquals(word, keyWord) {
    // "word." == "word"
    let c = word[word.length - 1];
    if (c == '.' || c ==',' || c ==';' || c =='?' || c =='!' || c ==')' ) {
        if (word.substr(0, word.length - 1).toLowerCase() == keyWord.toLowerCase()) {
            return true;
        }
    }
}

function updateChartTitle() {
    const chartType = state.currentChartType[0].toUpperCase() + state.currentChartType.slice(1);
    document.getElementById('graph-title').innerHTML = `${idNameToDisplayName(state.currentDataSet)} ${chartType} Chart`;
    
    //update Image as well
    // const urlBase = '/PackedBubble/images/'; // Online Server
    const urlBase = '/../images/'; // local Server
    imageString = urlBase + state.currentDataSet + ".jpg"
    document.getElementById('speaker-image').setAttribute('src', imageString)
    
    return;
}

function updateStats() {
    document.getElementById('stat-1').innerHTML = state.currentSpeakerData.totalCount
    document.getElementById('stat-2').innerHTML = (state.currentSpeakerData.totalCount / 273275 * 100).toFixed(1) + "%"
    if (state.currentSpeakerData.totalCount / 273275 < .01) {
        document.getElementById('stat-2').innerHTML = "< 1%"
    }
    document.getElementById('stat-3').innerHTML = state.currentSpeakerData.rank
}

function updateRangeFilter(option) {
    filter.rangeFilter = option;
    updateDefaultRange();
    createRangeGroups();
    updateUnique(1);
    goButton(event);
}

function createRangeGroups() {
    let box = document.getElementById('range-type');
    box.innerHTML = "";

    for (option of filterBaseRange) {
        let optionBox = document.createElement('div');
        optionBox.innerHTML = option;
        optionBox.setAttribute('class', 'range-select-item')
        if (option == filter.rangeFilter) {
            optionBox.setAttribute('class', 'range-select-item range-selected')
            
        }
        if (option != filter.rangeFilter) {
            let functionString = 'updateRangeFilter(\'' + option + '\')'
            optionBox.setAttribute('onclick', functionString);            
        }
        box.appendChild(optionBox)
    }

    // update description
    let description = '';
    if (filter.rangeFilter == 'Priority/Rank') {
        description = "Show words as they compare to one another, such as top 10 most used words (0-10).";
    }
    else {
        // document.getElementById('wordmin').value = 10
        description = "Show words within a range of frequency, such as words used more than 10 times."
    }
    document.getElementById('range-description').innerHTML = description;
}



function updateDefaultRange() {
    // update max hint
    let hint = '';
    if (filter.rangeFilter == 'Priority/Rank') {
        hint = 'Max # of words to display - ';
        if (state.currentChartData.children) { hint += state.currentChartData.children.length; }
        
    }
    else {
        hint = 'Highest possible frequency - ';
        if (state.currentChartData.children) { hint += state.currentChartData.children[0].size; }
       
    }
    document.getElementById('range-max').innerHTML = hint;

    // set default ranges based on data size
    if (filter.rangeFilter == "Priority/Rank") {
        // default range is 1 to 100
        document.getElementById("wordmin").value = 1;
        document.getElementById("wordmax").value = 100;
        
        if (state.currentChartData.children) { document.getElementById("wordmax").max = state.currentChartData.children.length; }
    }
    else {
        // frequency - lower limit calculated by 10% of max frequency
        document.getElementById("wordmax").value = state.currentChartData.children[0].size;
        document.getElementById("wordmin").value = Math.round(state.currentChartData.children[0].size / 10);
        if (state.currentChartData.children) { document.getElementById("wordmax").max = state.currentChartData.children[0].size; }

        if (state.uniqueFilter == "Unique") {
            document.getElementById("wordmax").value = state.currentChartData.children[0].size;
            document.getElementById("wordmin").value = 1;
        }
    }
}

// filter groups are the color of bubbles that are displayed. The user can decide which colors are displayed
function updateFilterGroup(input) {
    input = getClassName(input);
    if (input == 'all' || input == 'All') {
        filter.typeFilterCurrent = [];
        let filterArray = [];
        if (state.currentChartType == 'theme') {
            filterArray = filter.typeFilterBaseTheme
        }
        else {
            filterArray = filter.typeFilterBasePOS
        }
        for (object of filterArray) {
            filter.typeFilterCurrent.push(object);
        }
    }
    else {
        // if item is in list take it out
        if (filter.typeFilterCurrent.includes(input)) {
            filter.typeFilterCurrent.splice(filter.typeFilterCurrent.indexOf(input), 1);
        }
        else {
            filter.typeFilterCurrent.push(input);
        }
    }

    let currentArray = [];
    if (state.CurrentChartType == 'theme') { currentArray = selectTheme; }
    else { currentArray = selectPOS; }
    // console.log(filter.typeFilterCurrent)
    createFilterGroups(currentArray);
    goButton(event);
}

function createFilterGroups() {

    let currentArray = [];
    if (state.currentChartType == 'theme') { currentArray = selectTheme; }
    else if (state.currentChartType == 'function') { currentArray = selectFunction; }
    else { currentArray = selectContent; }

    let box = document.getElementById("group-select-box");
    box.innerHTML = "";

    for (option of currentArray) {
        let optionBox = document.createElement('div');
        let optionString = option;
        if (state.currentChartType != 'theme') { optionString += 's'; }
        if (option == 'All') {
            optionString = "All Words";
            optionBox.setAttribute('id', 'all-filter')
        }
        optionBox.innerHTML = optionString;

        let classString = 'group-select-item'
        classString = classString + ' ' + getClassName(option) + '-filter';

        if (!filter.typeFilterCurrent.includes(getClassName(option))) {
            classString = "group-select-item filter-unselected"
            // optionBox.setAttribute("class", 'group-select-item group-select-item-selected');
        }
        optionBox.setAttribute("class", classString);
        
        
        let functionString = 'updateFilterGroup(\'' + getClassName(option) + '\')';
        optionBox.setAttribute("onclick", functionString);

        box.append(optionBox);
    }
}

function updateUnique(reset) {
    if (reset) {
        filter.uniqueFilter == 'Unique';
        document.getElementById('unique-button').click()
        updateUnique();
        return;
    }
    let button = document.getElementById('unique-button');
    if (filter.uniqueFilter == "All") {
        // turning on unique words
        button.setAttribute('class', 'unique-button unique-on');
        button.innerHTML = "On"
        
        // set range for unique words - otherwise it will display an unhelpful default graph
        if (state.currentSpeakerData.uniqueWords.length > 200) { // only for Mormon
            if (filter.rangeFilter == "Priority/Rank") {
                document.getElementById("wordmin").value = 3;
            }
            else {
                document.getElementById("wordmin").value = 3;
            }
        }
        else {
            if (filter.rangeFilter == "Priority/Rank") {
                document.getElementById("wordmin").value = 1;
                document.getElementById("wordmax").value = 100;
            }
            else {
                document.getElementById("wordmin").value = 1;
                document.getElementById("wordmax").value = state.currentChartData.children[0].size;
            }
        }
    }
    else {
        // turning off uniique words
        button.setAttribute('class', 'unique-button unique-off');
        button.innerHTML = "Off"

        updateDefaultRange();
    }
    // change filter status
    if (filter.uniqueFilter == 'All') { filter.uniqueFilter = 'Unique' }
    else { filter.uniqueFilter = 'All' }

    goButton(event)
}

function createLegend() {
    legend = document.getElementById("graph-legend");
    legend.innerHTML = "";
    var legendArray;

    if (state.currentChartType == 'theme') { legendArray = legendFieldsThemes; }
    else if (state.currentChartType == 'function') { legendArray = legendFieldsFunction; }
    else { legendArray = legendFieldsContent; }

    for (value of legendArray) {

        let keyClass = "legend-color-box " + getClassName(value) + "-legend";
        let keyColorBox = document.createElement('div');
        keyColorBox.setAttribute('class', keyClass);

        let keyName = value;
        let keyNameBox = document.createElement('div');
        keyNameBox.setAttribute('class', 'legend-name');
        keyNameBox.innerHTML = keyName.replace(/-/g, " ");

        
        let newDiv = document.createElement('div')
        newDiv.setAttribute('class', 'legend-item');
        newDiv.appendChild(keyColorBox);
        newDiv.appendChild(keyNameBox);
        legend.append(newDiv);
    }
}

function createChart(dataset = state.currentDataSet) {
    try {
        resetUISettings();
        state.currentDataSet = dataset;
        state.currentChartData = getChartData(dataset, state.currentChartType);
        // Sort the data array by size so that it selects the correct words to render
        state.currentChartData.children.sort((a,b) => b.size - a.size);
        // sorted by size
        updateDefaultRange();
        updateStats();
        renderChart();
        updateChartTitle();
        createLegend();

    } catch(err) {
        console.log(err);
    }
    return;
}


// Function to run when a "name" of a speaker on the right sidebar is clicked.
function loadNewDataset(name) {
    updateSpeakerData(name);
    createChart(name); 
    document.getElementById('all-filter').click()
    return;
}

// User input settings depend on graph type - update input boxes
function updateUserParameters() {
    createRangeGroups();
    createFilterGroups();

}


// Function to run when a new chart type is selected
function loadNewChart(chartType) {
    
    updateDefaultRange();

    state.currentChartType = chartType;
    if (filter.uniqueFilter != 'All') {document.getElementById('unique-button').click()}

    let tempArray = [];
    if (chartType == 'theme') {
        tempArray = filter.typeFilterBaseTheme
        filter.typeFilterCurrent = tempArray;
    }
    else if (chartType == 'content') {
        tempArray = filter.typeFilterBasePOS
        filter.typeFilterCurrent = tempArray;
    }
    else if (chartType == 'function') {
        tempArray = filter.typeFilterBasePOS
        filter.typeFilterCurrent = tempArray;
    }

    // create user parameters based on chart selected
    updateUserParameters();
    createChart();

    document.getElementById('all-filter').click()
    
    // Clicking on a group filter first would overwrite the base filter groups - for a reason currently unknown to me
    // If you start by "clicking" all words, it seems to save/lock the base filter group and prevent it from being overwritten afterwards  
    return;
}
loadNewChart("content");

// Function to run filtering options on the currently displayed chart when the Go button is clicked.
function goButton(event) {
    if (state.isDrillDown) {
        state.isDrillDown = false;
    }
    if (event != undefined) {
        event.preventDefault();  
    }
    
    if (state.currentChartData.children) {        
        let filteredData = [];
        
        for (object of state.currentChartData.children) {
            if (state.currentChartType == 'theme') {
                if (filter.typeFilterCurrent.includes(getClassName(object.theme))) {
                    filteredData.push(object)
                }
            }
            else {
                // console.log(object.partOfSpeech)
                if (filter.typeFilterCurrent.includes(getClassName(object.partOfSpeech))) {
                    filteredData.push(object)
                }
            }
        }

        let filteredData2 = [];
        // if unique words is selected, cross check with unique words list.
        if (filter.uniqueFilter == "Unique") {
            for (object of filteredData) {
                // if word is in list of unique words, add to new set.
                // console.log(state.currentSpeakerData.uniqueWords)
                if (state.currentSpeakerData.uniqueWords.includes(object.name)) {
                    filteredData2.push(object);
                }
            }
            // range will be different for unique words - maybe update range here
        }
        else {
            filteredData2 = filteredData;
        }


        // state.currentFilteredData = { children: filteredData2 };
        renderChart({ children: filteredData2 });
    }

    return;
}

window.addEventListener('load', function(){
    let message = { height: document.body.scrollHeight, width: document.body.scrollWidth };
    window.top.postMessage(message, "*");
});