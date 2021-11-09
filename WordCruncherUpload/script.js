// Documentation by Adam Ryan - November 2021
// This program takes an exported .txt file from Word Cruncher and creates a "tree" from the possible phrases branching from a word
// There is an instruction page on how to export from Word Cruncher as well as some preset words you can look at
// visiblelanguage.net/wordcruncher is the link to access this program



let intitialized = false;
let inputText = 'unchanged';
let data = []
let rootWords = [];
let postTree = {post_children: [], _root: true}
let preTree = {pre_children: [], _root: true}

let currentPostChain = [];
let currentPreChain = [];
let matchedVerses = [];
let numHits = 0;
let speakerArray = [];
let sidebar_switch = "verse";
let current_drag_width = 400; // this should match the inital width as set in the index.html style attribute
const num_verses_frequency = 50;
const num_verses = 6628;
let verticalOrientation = false;

let circleSize = 40;
const rectHeight = 40;
const rectWidth = 80;
let maxBarSize = 150;
const verticalNodeDistance = 70; //px
const horizontalNodeDistance = 70; //px
const graphicCenterX = 0;
const graphicCenterY = 0;
// const stretchLimit = 400;
const stretchAmount = 8;

const xScaleH = 1.1;
const yScaleH = .6;
const xScaleV = .8;
const yScaleV = 1;


// ------------------------ Upload Data ---------------------- //

// Changing Word Cruncher's syntax for Book names to these shorter names used in this program
function wordCruncherBookToVerseCodeBook(book) {
    if (book[0] == '1') return '1nep'
    if (book[0] == '2') return '2nep'
    if (book == 'Jacob') return 'jacb'
    if (book == 'Enos') return 'enos'
    if (book == 'Jarom') return 'jarm'
    if (book == 'Omni') return 'omni'
    if (book == 'WofM') return 'wofm'
    if (book == 'Mosiah') return 'mosi'
    if (book == 'Alma') return 'alma'
    if (book == 'Hel.') return 'hela'
    if (book[0] == '3') return '3nep'
    if (book[0] == '4') return '4nep'
    if (book == 'Morm.') return 'morm'
    if (book == 'Ether') return 'ethr'
    if (book == 'Moro.') return 'moro'
    if (book == "Title") return 'intr'
    console.log('Bad Input', book)
    return 'Bad Input'
}

function wordCruncherRefToVerseCode(ref) {
    // format  "B of M Moro. 9:22"
    //  or     "B of M 2 Ne. 4:34"
    ref = ref.split(' ')
    ref.shift()
    ref.shift()
    ref.shift()
    let book;    
    let chap;
    let verse;
    if (ref.length > 2) {
        book = ref[0] + ' ' + ref[1]
        ref = ref[2]
    }
    else if (ref.length == 1) {
        book = ref[0];
        chap = 0
        verse = 1
    }
    else {
        book = ref[0]
        ref = ref[1]
    }

    if (!ref.includes(':')) {
        chap = 0
        verse = 1
    }
    else {
        ref = ref.split(':')
        chap = ref[0]
        verse = ref[1]
    }


    if (parseInt(chap) < 10) { chap = '0' + chap}
    if (parseInt(verse) < 10) { verse = '0' + verse}
    return wordCruncherBookToVerseCodeBook(book) + chap + verse;
}

let verseMap = new Map()
for (let verse of verseData) {
    verseMap.set(verse.ref_code, verse)
}

const reader = new FileReader();
reader.addEventListener('load', (event) => {
    // console.log(event.target.result)
    inputText = event.target.result;
    let htmlString = parseText(inputText);
    document.getElementById('input').innerHTML = htmlString;

})

// convert the .txt file output by WordCruncher into the dataset for all instances of the searched word
function parseText(inputText) {
    let htmlString = '';
    try {
        let lines = inputText.split('\n')
        lines.shift(); // removes first line/element
        lines.pop(); // removes last line/element (empty string)
        
        data = []
    
        for (let line of lines) {
            let items = line.split('\t')
            // let pre_phrase = items[2].split('   ')
            // pre_phrase.push(items[3])
            let pre_phrase = []
            for (let word of items[2].split('   ')) {
                pre_phrase.unshift(word)
            }
            pre_phrase.unshift(items[3])
            let post_phrase = items[4].split('   ')
            post_phrase.unshift(items[3])
            let fullPhrase = items[2].split('   ')
            fullPhrase.push(items[3])
            for (let word of items[4].split('   ')) {
                fullPhrase.push(word)
            }
            data.push({
                ref: items[1],
                pre_phrase: pre_phrase,
                hit: items[3],
                post_phrase: post_phrase,
                full_phrase: fullPhrase
            })
    
            // Option to display text import on page
            htmlString += '<div>'
            htmlString += line
            htmlString += '</div>'
        }
    }
    catch {
        alert("Error - there was an issue with your file upload.")
    }
    
    return htmlString;
}

function buttonClick() {
    try {
        importFile();
        // needs a delay to read file?
        setTimeout(() => {
            getRootWords();
            createGraphics();
        }, 200);
    }
    catch {
        alert("Error - there was an issue with your file upload.")
    }
}

function importFile() {
    intitialized = true;
    let f = document.getElementById('myFile').files[0];
    // console.log(f)
    reader.readAsBinaryString(f)
    // console.log(inputText)
}

function importFilePreset(filename) {
    intitialized = true;
    var txtFile = new XMLHttpRequest();  
     txtFile.open("GET", filename, true);  
     txtFile.onreadystatechange = function() {  
          if (txtFile.readyState === 4) {  
               // Makes sure the document is ready to parse.  
               if (txtFile.status === 200) {  
                    // Makes sure it's found the file.  
                    let htmlString = parseText(txtFile.responseText);
                    document.getElementById('input').innerHTML = htmlString;
               }  
          }  
     }  
     txtFile.send(null)  


    // reader.readAsBinaryString(filename);
}

// user can see the .txt file they uploaded if they'd like
function toggleShow() {
    // console.log('click')
    let box = document.getElementById('input')
    if (!box.classList.replace('hidden', 'visible')) {
        box.classList.replace('visible', 'hidden')
        document.getElementById('show-button').innerHTML = "Show file text"
    }
    else {
        document.getElementById('show-button').innerHTML = "Hide file text"
    }
}

function displayHelpBox() {
    let sheet = document.getElementById('helpbox-sheet');
    if (sheet.classList.contains('hidden')) {
        sheet.classList.replace('hidden', 'visible');
        sheet.classList.remove('help-sheet-animate')
        sheet.classList.add('help-sheet-animate')
    }
    else {
        sheet.classList.replace('visible', 'hidden');
    }
}

function loadfile(file) {
    document.getElementById('help-exit').click();
    try {
        importFilePreset(file);
        // needs a delay to read file?
        setTimeout(() => {
            getRootWords();
            createGraphics();
        }, 200);
    }
    catch {
        alert("Error - there was an issue with your file upload.")
    }
}







// ------------------------ Code for Processing Data ------------------------ //

function addPostBranch(node, array_orig) {
    let array = [...array_orig] // need to duplicate array - don't edit the original data structure
    // console.log(array)
    if (node[array[0]]) {
        // chain already exists
    }
    else {
        node[array[0]] = {post_children: [], _root: false}
        if (!node.post_children.includes(array[0])) {
            node.post_children.push(array[0]);

            // keeps options in alphabetical order
            node.post_children.sort();
        }
    }
    if (array.length == 1) return;
    // console.log(array.shift())
    
    addPostBranch(node[array.shift()], array)
}

function addPreBranch(node, array_orig) {
    let array = [...array_orig] // need to duplicate array - don't edit the original data structure
    if (node[array[0]]) {

    }
    else {
        node[array[0]] = {pre_children: []}
        if (!node.pre_children.includes(array[0])) {
            node.pre_children.push(array[0])
            node.pre_children.sort();
            node.pre_children.reverse();
        }
    }
    if (array.length == 1) return;
    // console.log(array.shift())
    
    addPreBranch(node[array.shift()], array)
}

function arrayStartsWithArray(a, b) {
    // a is large array - b is small array
    // a = [1, 2, 3, 4, 5] and b = [1, 2, 3] returns true
    if (a.length < b.length) return false;
    for (let i = 0; i < b.length; i++) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

function checkViable(obj) {
    // not every phrase from the original export will fit with the current phrase.
    // if the current selected phrase is "trust not in man" then the phrase "trust god forever" should not be considered
    if (!arrayStartsWithArray(obj.post_phrase, currentPostChain)) return false;
    if (!arrayStartsWithArray(obj.pre_phrase, currentPreChain)) return false;
    return true;
}

function getPhraseFromArray(arr) {
    let string = ""
    for (let word of arr) {
        string += word
        string += " "
    }
    return string
}

function getRootWords() {
    // this is to keep track of different variations of a word produced by word cruncher - "trust, trusted, trusting"
    rootWords = [];
    for (obj of data) {
        if (!rootWords.includes(obj.hit)) {
            rootWords.push(obj.hit)
        }
    }
    currentPostChain = [];
    currentPostChain.push(rootWords[0])
    currentPreChain = [];
    currentPreChain.push(rootWords[0])
}

// change orientation between horizontal and vertical - data stays exactly the same
function verticalSwap() {
    if (verticalOrientation) document.getElementById('vertical-swap').innerHTML = "Horizontal"
    else document.getElementById('vertical-swap').innerHTML = "Vertical"
    verticalOrientation = !verticalOrientation;
    if (intitialized) {
        createGraphics();
    }
}

// This function resets the recursive data structure and repopulates it with the new phrase
function updateNodes() {
    postTree = {post_children: [], _root: true}
    preTree = {pre_children: [], _root: true}

    matchedVerses = [];
    speakerArray = [];

    if (data.length == 0) return;
    for (obj of data) {
        // if it's not a viable phrase chain for the selected chain then it shouldn't be included
        if (checkViable(obj)) {
            addPostBranch(postTree, obj.post_phrase)
            addPreBranch(preTree, obj.pre_phrase)

            // combine data from large verseData file and orig WC export already processed
            let verseImport = verseMap.get(wordCruncherRefToVerseCode(obj.ref));
            
            incrementSpeakersFromVerse(verseImport.speakers)
            matchedVerses.push(verseImport)
        }
    }
    numHits = matchedVerses.length;
    matchedVerses = matchedVerses.filter(function(item, pos) {
        return matchedVerses.indexOf(item) == pos;
    })
    matchedVerses.sort((a,b) => {
        return parseInt(a.v_num) - parseInt(b.v_num)
    })
    speakerArray.sort((a,b) => {
        return parseInt(b.count) - parseInt(a.count)
    })
}

function incrementSpeakersFromVerse(array) {
    for (let speaker of array) {
        speakerObj = speakerArray.find(obj => obj.name == speaker)
        if (speakerObj) {
            speakerObj.count++;
        }
        else {
            speakerArray.push({
                name: speaker,
                count: 1
            })
        }
    }
}







// -------------------------- Code for responsive toggle ------------------------- //

function toggleContent(option) {
    if (option == "graphic") {
        document.getElementById('graphic-tools').classList.replace('graphic-tools-display-hidden', 'graphic-tools-display-visible');
        document.getElementById('verse-info').classList.replace('verse-info-display-visible', 'verse-info-display-hidden');
    }
    else if (option == "info") {
        document.getElementById('graphic-tools').classList.replace('graphic-tools-display-visible', 'graphic-tools-display-hidden');
        document.getElementById('verse-info').classList.replace('verse-info-display-hidden', 'verse-info-display-visible');
    }
}




// ------------------------ Code For Sidebar --------------------- //

// Change visibility of different sidebar visuals so only one is visible
function toggleVerseSpeakerSwitch(option) {
    let verseSwitch = document.getElementById('verse-box-title')
    let speakerSwitch = document.getElementById('speaker-box-title')
    let frequencySwitch = document.getElementById('frequency-box-title')

    let verseBox = document.getElementById('verse-container')
    let speakerBox = document.getElementById('speaker-container')
    let frequencyBox = document.getElementById('frequency-container')

    if (option == 'speaker') {
        // change to speaker
        verseSwitch.classList.replace('switch-selected', 'switch-unselected')
        speakerSwitch.classList.replace('switch-unselected', 'switch-selected')
        frequencySwitch.classList.replace('switch-selected', 'switch-unselected')

        verseBox.classList.replace('visible', 'hidden')
        speakerBox.classList.replace('hidden', 'visible')
        frequencyBox.classList.replace('visible', 'hidden')
    }
    else if (option == 'verse') {
        // change to verse
        speakerSwitch.classList.replace('switch-selected', 'switch-unselected')
        verseSwitch.classList.replace('switch-unselected', 'switch-selected')
        frequencySwitch.classList.replace('switch-selected', 'switch-unselected')

        speakerBox.classList.replace('visible', 'hidden')
        verseBox.classList.replace('hidden', 'visible')
        frequencyBox.classList.replace('visible', 'hidden')
    }
    else if (option == 'frequency') {
        // change to frequency
        speakerSwitch.classList.replace('switch-selected', 'switch-unselected')
        frequencySwitch.classList.replace('switch-unselected', 'switch-selected')
        verseSwitch.classList.replace('switch-selected', 'switch-unselected')

        speakerBox.classList.replace('visible', 'hidden')
        frequencyBox.classList.replace('hidden', 'visible')
        verseBox.classList.replace('visible', 'hidden')
    }
}

// Verse Info

function updateVerses() {
    document.getElementById('sidebar-container').classList.replace('hidden', 'visible')

    let box = document.getElementById('verse-container');
    box.innerHTML = "";

    document.getElementById('hit-count-large').innerHTML = numHits

    let countDiv = document.getElementById('hit-count')
    countDiv.innerHTML = "Number of hits for selected phrase: " + numHits
    let verseTitle = document.getElementById('verse-box-title')
    verseTitle.innerHTML = "Verses (" + matchedVerses.length + ")"

    for (let verse of matchedVerses) {
        let newDiv = document.createElement('div')
        populateIndividualVerse(newDiv, verse)
        newDiv.setAttribute('class', 'verse')
        box.appendChild(newDiv)
    }
}

function populateIndividualVerse(div, verse) {
    // Create Verse Title
    let verseTitle = document.createElement('div')
    verseTitle.setAttribute('class', 'verse-title')

    let verseReference = document.createElement('div')
    verseReference.setAttribute('class', 'verse-reference')
    verseReference.innerHTML = verse.reference

    let imagesContainer = document.createElement('div')
    imagesContainer.setAttribute('class', 'image-icon-container')
    for (let name of verse.speakers) {
        let imageBox = document.createElement('div')
        imageBox.setAttribute('class', 'image-icon-wrapper-small')
        let image = document.createElement('img')
        image.setAttribute('class', 'image-icon-small')
        image.setAttribute('src', './images/' + getIdNameFromSplit(name) + '.jpg')

        imageBox.appendChild(image)
        imagesContainer.appendChild(imageBox)
    }

    verseTitle.appendChild(verseReference)
    verseTitle.appendChild(imagesContainer)

    // Create A Text List of Speakers for Verse
    let speakerListText = document.createElement('div')
    speakerListText.innerHTML = getSpeakerListText(verse.speakers)
    speakerListText.setAttribute('class', 'verse-speaker-text')

    // Create Verse Text
    let verseText = document.createElement('div')
    verseText.setAttribute('class', 'verse-text verse-text-collapsed')
    verseText.setAttribute('id', verse.v_num)
    verseText.setAttribute('onclick', 'expandVerse(' + verse.v_num + ')')
    verseText.innerHTML = fixSpacingInVerse(verse.textArray)

    // Add everything to verse div
    div.appendChild(verseTitle)
    div.appendChild(speakerListText)
    div.appendChild(verseText)
}

function getSpeakerListText(array) {
    let text = "Speaker"
    if (array.length > 1) text += 's for this verse'
    text += ": "
    for (let i = 0; i < array.length; i++) {
        text += getDisplayNameFromSplitName(array[i])
        if (i < array.length - 1) text += ", "
    }
    return text
}

function fixSpacingInVerse(textArray) {
    let text = "";
    for (let word of textArray) {
        let punctuation = (word == ',' || word == '.' || word == ';' || word == ':' || word == '?' || word == '!' || word == ')' || word == '(')
        if (!punctuation) {
            text += " "
        }
        if (word.toLowerCase() == currentPostChain[0]) {
            text += "<strong>"
            text += word
            text += "</strong>"
        }
        else {
            text += word;
        }
    }
    return text
}

function expandVerse(id) {
    let verseBox = document.getElementById(id);
    if (verseBox.classList.contains('verse-text-collapsed')) {
        // needs to expand
        verseBox.classList.replace('verse-text-collapsed', 'verse-text-expanded')
    }
    else {
        verseBox.classList.replace('verse-text-expanded', 'verse-text-collapsed')
    }
}


// Speaker Info

function updateSpeakerInfo() {
    let speakerBox = document.getElementById('speaker-container-flex')
    speakerBox.innerHTML = "";

    if (!speakerArray[0]) return
    let max = speakerArray[0].count;
    document.getElementById('speaker-box-title').innerHTML = 'Speakers (' + speakerArray.length + ')'

    for (let speaker of speakerArray) {
        let speakerItem = document.createElement('div')
        populateIndividualSpeakerItem(speakerItem, speaker, max)
        speakerItem.setAttribute('class', 'speaker-item')
        speakerBox.appendChild(speakerItem)
    }
}

function populateIndividualSpeakerItem(speakerItem, speaker, max) {
    // Create Name
    let nameDiv = document.createElement('div')
    nameDiv.setAttribute('class', 'speaker-name')
    nameDiv.innerHTML = getDisplayNameFromSplitName(speaker.name)

    // Create Image
    let imageBox = document.createElement('div')
    imageBox.setAttribute('class', 'image-icon-wrapper-medium')
    let image = document.createElement('img')
    image.setAttribute('class', 'image-icon-medium')
    image.setAttribute('src', './images/' + getIdNameFromSplit(speaker.name) + '.jpg')
    imageBox.appendChild(image)

    let bar = document.createElement('div')
    bar.setAttribute('class', 'speaker-size-bar')
    let barSize = speaker.count / max * 50
    bar.setAttribute('style', '--bar-width:' + barSize + '%')

    let number = document.createElement('div')
    number.setAttribute('class', 'speaker-size-num')
    number.innerHTML = speaker.count

    speakerItem.appendChild(nameDiv)
    speakerItem.appendChild(imageBox)
    speakerItem.appendChild(bar)
    speakerItem.appendChild(number)
}


// Frequency Chart Info

let frequencyBars = []

function populateFrequencyChart() {
    document.getElementById('frequency-graph-description').innerHTML = "Frequency Chart - Each bar represents " + num_verses_frequency + " verses. The height is how many times the selected word or phrase is used in each section of verses."
    document.getElementById('frequency-graph').innerHTML = "";
    let barHeights = []
    barHeights.length = getBucketIndex(num_verses);
    frequencyBars = [];


    for (verse of matchedVerses) {
        if (barHeights[getBucketIndex(verse.v_num)]) {
            barHeights[getBucketIndex(verse.v_num)]++;
        }
        else {
            barHeights[getBucketIndex(verse.v_num)] = 1;
        }
    }

    let max = barHeights.reduce((a,b) => Math.max(a,b))

    for (verse of matchedVerses) {
        // both of these will be css percentages
        let barWidth = num_verses_frequency / num_verses * 100;
        let barPosition = getBucketIndex(verse.v_num);
        let repeatedVerse = frequencyBars.find(obj => obj.position == barPosition)
        if (repeatedVerse) {
            // repeatedVerse.verses.push(verse)
        }
        else {
            frequencyBars.push({
                width: barWidth,
                position: barPosition,
                height: barHeights[getBucketIndex(verse.v_num)] / max * 100,
                value: barHeights[getBucketIndex(verse.v_num)],
            })
        }
    }

    let box = d3.select('#frequency-graph');
    box.selectAll('frequency-bar').remove()
    let bars = box.selectAll('frequency-bar')
        .data(frequencyBars)
        .enter()
        .append('div')
            .attr('class', 'frequency-bar')
            .attr('style', function(d) { return '--bar_width:' + getBarWidth(d.width) + '%; --bar_position:' + d.position / barHeights.length * 100 + '%; --bar_height:' + Math.round(d.height) + '%' })
            .on('mouseover', function(e, d) { return tooltipOn(getReferenceRangeAndValue(d.position, d.value))})
            .on('mouseout', function() { return tooltipOff()})

}

function getBarWidth(width) {
    let newWidth = width / 3;
    if (newWidth < 1) return 1;
    else return newWidth
}

function getReferenceRangeAndValue(pos, val) {
    let begin, end;
    if ((pos + 1) * num_verses_frequency > num_verses) {
        end = "End"
    }
    else {
        end = verseData[(pos + 1) * num_verses_frequency - 1].reference;
    }
    begin = verseData[pos * num_verses_frequency].reference
    let refString = begin + " - " + end;
    let valString = val;
    if (val == 1) valString += " time"
    else valString += " times"
    return "<div>" + refString + "</div>" +"<div>" + valString + "</div>"
}

function getBucketIndex(v_num) {
    let index = 0;
    let value = v_num;
    while (value >= num_verses_frequency) {
        value -= num_verses_frequency;
        index++;
    }
    return index;
}










// ------------------------ Code for SVG ------------------------ //

function createGraphics() {
    let verseBox = document.getElementById('verse-info')
    if (verseBox.classList.contains('hidden')) {
        verseBox.classList.replace('hidden', 'visible')
    }


    destroyTooltipEventListener();
    document.getElementById('tooltip').classList.replace('tooltip-visible', 'tooltip-hidden')
    updateNodes();

    // reset set of data for all the individual nodes in the tree
    graphicNodes = []
    // from the recursive datasets, populate all the individual nodes in the tree
    createGraphicNodeRecursive(postTree, array = currentPostChain, 0, currentPostChain.length > 0, [], true)
    createGraphicNodeRecursive(preTree, array = currentPreChain, 0, currentPreChain.length > 0, [], false)
    createLines();

    populateRootWords();
    populateLines();
    populateGraphicNodes();
    addCollapsers();

    updateVerses();
    updateSpeakerInfo();
    populateFrequencyChart();
}

// needs to happen after updateNodes() or getRootWords()
function populateRootWords() {    
    let rootWordsDiv = document.getElementById('root-words-container');
    rootWordsDiv.innerHTML = '';
    for (let word of rootWords) {
        let rootWord = document.createElement('div');
        rootWord.setAttribute('class', 'root-word');
        rootWord.innerHTML = word;
        rootWord.setAttribute('onclick', "resetRoot('" + word + "')")
        rootWordsDiv.appendChild(rootWord);
    }
}

// "trust, trusted, trusting..."
// reset graphic for each option on click to just the root word
function resetRoot(word) {
    currentPostChain = [word];
    currentPreChain = [word];
    createGraphics();
}

// ------------------------ Code for SVG Nodes / Groups / or Rounded Rectangles ------------------------ //

let graphicNodes = []

function createGraphicNodeRecursive(node, array_orig, level, fade, chain_orig, post) {
    // array is from the current chain of words selected

    // pre_post_multiplier determines if it will go left/right or up/down from the root
    let pre_post_multiplier = 1;
    let pre_post_array = node.post_children
    if (!post) {
        pre_post_multiplier = -1;
        pre_post_array = node.pre_children
    }
    let array = [...array_orig]

    if (!node) return;

    // position each node depending on its alphabetical position
    let hitIndex = pre_post_array.indexOf(array[0])
    let start_height = ((pre_post_array.length - 1) * verticalNodeDistance / (-2) + hitIndex * verticalNodeDistance);
    if (hitIndex == -1) start_height = 0;
    let hitBool = false;

    for (let i = 0; i < pre_post_array.length; i++) {
        let chain = [...chain_orig]
        chain.push(pre_post_array[i])
        let x_coor = level * horizontalNodeDistance * pre_post_multiplier
        // if (verticalOrientation) x_coor = level * horizontalNodeDistanceV * pre_post_multiplier
        let y_offset = ((pre_post_array.length - 1) * verticalNodeDistance / 2) * -1 + i * verticalNodeDistance;
        // if (verticalOrientation) y_offset = ((pre_post_array.length - 1) * verticalNodeDistanceV / (-2) + i * verticalNodeDistanceV)
        let y_center = 0 - start_height

        // console.log(x_coor, y_offset, pre_post_multiplier)
        let arrLength = pre_post_array.length
        let start_point = ((pre_post_array.length - 1) * verticalNodeDistance / (2)) * -1;
        let newCoors = updateXYCoordinates(x_coor, y_offset, pre_post_multiplier, arrLength)
        x_coor = newCoors[0];
        y_offset = newCoors[1];
        let cloudShift = newCoors[2];
        
        if (array[0] == pre_post_array[i] && !hitBool) {
            if (!post && level == 0) {
                // avoid duplicating center node
            }
            else {
                graphicNodes.unshift({
                    word: pre_post_array[i],
                    active: true,
                    x_coor: x_coor,
                    y_offset: 0,
                    y_center: graphicCenterY,
                    main: node._root,
                    fade: false,
                    chain: chain,
                    parentArray: pre_post_array,
                    pre_post_multiplier: pre_post_multiplier,
                    cloudShift: 0
                })
            }
            hitBool = true;
            createGraphicNodeRecursive(node[array.shift()], array, level + 1, (array.length > 0), chain, post)
        }
        else {
            if (!post && level == 0) {
                // avoid duplicating center node
            }
            else {
                graphicNodes.unshift({
                    word: pre_post_array[i],
                    active: false,
                    x_coor: x_coor,
                    y_offset: y_offset,
                    y_center: y_center,
                    main: false,
                    fade: true,
                    chain: chain,
                    parentArray: pre_post_array,
                    pre_post_multiplier: pre_post_multiplier,
                    cloudShift: cloudShift
                })
            }
        }
    }
}

// This function is for positioning all the children in rows and columns instead of one long row/column
function updateXYCoordinates(x, y, direction, arrLength) {
    let start = ((arrLength - 1) * verticalNodeDistance / (2)) * -1;
    let stretchLimit = verticalNodeDistance * stretchAmount;
    let cloudShift = 1;

    let numBuckets = Math.floor(arrLength / stretchAmount) + 1;
    let lastBucketSize = arrLength % stretchAmount;
    y -= start;

    while (Math.abs(y) >= stretchLimit) {
        y -= stretchLimit;
        x += horizontalNodeDistance * direction;
        cloudShift += 1;
    }
    y -= stretchLimit / 2;
    y += verticalNodeDistance / 2;

    if (numBuckets == cloudShift) {
        y += (stretchAmount - lastBucketSize) / 2 * verticalNodeDistance
    }

    if (verticalOrientation) {
        y = y * yScaleV;
        x = x * xScaleV;
    }
    else {
        y = y * yScaleH;
        x = x * xScaleH;
    }
    
    y *= direction;
    return [x, y, cloudShift]
}

function populateGraphicNodes() {
    let svg = d3.select('#svg-box')
    svg.selectAll('.svg-group').remove()
    let groups = svg.selectAll('.svg-group')
        .data(graphicNodes)
        .enter()
        .append('g')
            .style('transform', function(d) {
                if (d.pre_post_multiplier == 1) { // post fixed
                    if (d.chain.length <= currentPostChain.length) return getTransformStringXY(graphicCenterX + d.x_coor, graphicCenterY + d.y_center + d.y_offset) //fixed
                }
                else { // pre fixed
                    if (d.chain.length <= currentPreChain.length) return getTransformStringXY(graphicCenterX + d.x_coor, graphicCenterY + d.y_center + d.y_offset) //fixed
                }
                return getTransformStringXY(graphicCenterX + d.x_coor - (horizontalNodeDistance * d.cloudShift * d.pre_post_multiplier * (verticalOrientation ? xScaleV : xScaleH)), graphicCenterY + d.y_center)
                // If I wanted to, I could make them circular by subtracting the distance from center?
            })
            .style('opacity', function(d) {
                if (d.pre_post_multiplier == 1) { // post fixed
                    if (d.chain.length <= currentPostChain.length) return 1 //fixed
                }
                else { // pre fixed
                    if (d.chain.length <= currentPreChain.length) return 1 //fixed
                }
                return 0
                // fixed means it is not the last node on the chain or part of the actual selected phrase
            })
            .attr('class', 'svg-group')
            .on('mouseover', function(e, d) { return tooltipOn(d.word)})
            .on('mouseout', function() { return tooltipOff()})

            
    groups.append('rect')
        .style('transform', function(d) { return getSizeTransform(d.active) + " " + getTranslateTransform()})
        // .attr('r', circleSize)
        .attr('height', rectHeight)
        .attr('width', rectWidth)
        .attr('rx', '10')
        .attr('class', function(d) { return getNodeClass(d.fade, d.main)})
    
    groups.append('text')
        .text(function(d) {return d.word})
        .attr('class', function(d) { return getNodeTextClass(d.fade)})
        .attr('text-anchor', 'middle')
        .style('transform', function(d) { return getSizeTransformText(d.active, d.word) + ' translateY(5px)'})

    groups.on('click', function(e,d) {selectNewNodePost(d.chain, d.pre_post_multiplier)})

    groups.transition()
        .style('transform', function(d) { return getTransformStringXY(graphicCenterX + d.x_coor, graphicCenterY + d.y_center + d.y_offset)})
        .style('opacity', 1)
        .duration(500)
        .delay(0)

}

// collapse just one side of the phrase - if you want to keep the words preceding but reset the words following
function collapse(option) {
    // console.log(option)
    if (option == 'left') {
        currentPreChain = [currentPreChain[0]]
    }
    if (option == 'right') {
        currentPostChain = [currentPostChain[0]]
    }

    createGraphics();
}

function addCollapsers() {
    let svg = document.getElementById('svg-box')
    if (document.getElementById('collapse-left') != undefined && document.getElementById('collapse-right') != undefined) {
        document.getElementById('collapse-left').remove()
        document.getElementById('collapse-right').remove()
    } // replace them so they are on top
    
    let collapseLeft = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    collapseLeft.setAttribute('id', 'collapse-left')
    collapseLeft.setAttribute('r', circleSize / 5)

    if (verticalOrientation) { collapseLeft.setAttribute('cx', 0) }
    else collapseLeft.setAttribute('cx', horizontalNodeDistance / -1.6)
    if (verticalOrientation) { collapseLeft.setAttribute('cy', horizontalNodeDistance / -2.5) }
    else collapseLeft.setAttribute('cy', 0)

    collapseLeft.addEventListener('click', function() {collapse('left')})
    collapseLeft.setAttribute('class', 'collapser')

    let collapseRight = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    collapseRight.setAttribute('id', 'collapse-right')
    collapseRight.setAttribute('r', circleSize / 5)
    if (verticalOrientation) { collapseRight.setAttribute('cx', 0) }
    else collapseRight.setAttribute('cx', horizontalNodeDistance / 1.6)
    if (verticalOrientation) { collapseRight.setAttribute('cy', horizontalNodeDistance / 2.5) }
    else collapseRight.setAttribute('cy', 0)
    collapseRight.addEventListener('click', function() {collapse('right')})
    collapseRight.setAttribute('class', 'collapser')

    svg.append(collapseLeft)
    svg.append(collapseRight)
}

function getTransformStringXY(x, y) {
    if (verticalOrientation) return 'translateX(' + y + 'px) translateY(' + x + 'px)'
    return 'translateX(' + x + 'px) translateY(' + y + 'px)'
}
function getSizeTransform(active) {
    // active nodes are bigger than non-active nodes
    if (active) return 'scale(' + .9 + ')'
    else return 'scale(' + .7 + ')'
}
function getSizeTransformText(active, word) {
    let scale = 1;
    if (word.length > 6) {
        scale = 1 - word.length / 30;
    }

    // active nodes are bigger than non-active nodes
    if (active) return 'scale(' + scale * 1.2 + ')'
    else return 'scale(' + scale * .9 + ')'
}
function getTranslateTransform() {
    return "translate(-" + rectWidth / 2 + "px, -" + rectHeight / 2 + "px)"
}
function getNodeClass(fade, main) {
    if (main) return "svg-item no-fade item-main"
    if (fade) return "svg-item fade"
    else return "svg-item no-fade"
}
function getNodeTextClass(fade) {
    if (fade) return "fade-text"
    else return "no-fade-text"
}
function selectNewNodePost(chain, pre_post) {
    if (chain.length == 1) {
        currentPostChain = chain;
        currentPreChain = chain
    }
    if (pre_post == 1) {
        // post node
        currentPostChain = chain;
    }
    else {
        // pre node
        currentPreChain = chain
    }
    createGraphics();   
}











// ------------------------ Code for SVG Lines ------------------------ //


let lines_data = [];

function createGraphicLines() {
    console.log('lines')
    
}

function getDistanceFromTwoPoints(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function createLines() {
    // needs circles info to be correct - call only after graphic nodes function
    lines_data = [];
    let startX;
    let startY;
    let stopX;
    let stopY;

    // populate Post Chain Lines FIXED
    for (let i = 0; i < currentPostChain.length - 1; i++) {
        startX = horizontalNodeDistance * i * (verticalOrientation ? xScaleV : xScaleH);
        startY = graphicCenterY;
        stopX = horizontalNodeDistance * (i + 1) * (verticalOrientation ? xScaleV : xScaleH);
        stopY = graphicCenterY;
        if (verticalOrientation) {
            lines_data.push({
                startX: startY,
                startY: startX,
                stopX: stopY,
                stopY: stopX,
                length: getDistanceFromTwoPoints(startX, startY, stopX, stopY),
                animate: false
            })
        }
        else {
            lines_data.push({
                startX: startX,
                startY: startY,
                stopX: stopX,
                stopY: stopY,
                length: getDistanceFromTwoPoints(startX, startY, stopX, stopY),
                animate: false
            })
        }
    }
    // populate Pre Chain Lines FIXED
    for (let i = 0; i < currentPreChain.length - 1; i++) {
        startX = horizontalNodeDistance * i * -1  * (verticalOrientation ? xScaleV : xScaleH);
        startY = graphicCenterY;
        stopX = horizontalNodeDistance * (i + 1) * -1 * (verticalOrientation ? xScaleV : xScaleH);
        stopY = graphicCenterY;
        if (verticalOrientation) {
            lines_data.push({
                startX: startY,
                startY: startX,
                stopX: stopY,
                stopY: stopX,
                length: getDistanceFromTwoPoints(startX, startY, stopX, stopY),
                animate: false
            })
        }
        else {
            lines_data.push({
                startX: startX,
                startY: startY,
                stopX: stopX,
                stopY: stopY,
                length: getDistanceFromTwoPoints(startX, startY, stopX, stopY),
                animate: false
            })
        }
    }
    // non selected nodes
    for (let node of graphicNodes) {
        if (!node.fade) continue;
        startX = node.x_coor - horizontalNodeDistance * node.pre_post_multiplier * node.cloudShift * (verticalOrientation ? xScaleV : xScaleH);
        startY = graphicCenterY;
        stopX = node.x_coor;
        stopY = node.y_center + node.y_offset;
        if (verticalOrientation) {
            lines_data.push({
                startX: startY,
                startY: startX,
                stopX: stopY,
                stopY: stopX,
                length: getDistanceFromTwoPoints(startX, startY, stopX, stopY),
                animate: true
            })
        }
        else {
            lines_data.push({
                startX: startX,
                startY: startY,
                stopX: stopX,
                stopY: stopY,
                length: getDistanceFromTwoPoints(startX, startY, stopX, stopY),
                animate: true
            })
        }
    }
}

function populateLines() {
    let svg = d3.select('#svg-box')
    svg.selectAll('.svg-line').remove()
    let lines = svg.selectAll('.svg-line')
        .data(lines_data)
        .enter()
        .append('path')
            .attr('d', function(d) { return getLinePath(d) })
            .attr('class', function(d) { return d.animate ? "svg-line svg-line-animate" : "svg-line" } )
            .attr("stroke-dasharray", function(d) {return d.length})
            .attr("stroke-dashoffset", function(d) {return d.animate ? d.length : 0 })

    lines.transition()
        // .delay(400)
}

function getLinePath(obj) {
    let path = "M";
    path += obj.startX;
    path += " ";
    path += obj.startY;
    path += " L";
    path += obj.stopX;
    path += " ";
    path += obj.stopY;

    return path;
}















// ------------------------ Code for the Zoom and Panning Features ------------------------ //

let zoomToolsVisible = true;
function showZoom() {
    if (zoomToolsVisible) {
        document.getElementById('zoom-show').innerHTML = "Show";
        document.getElementById('zoom-helpers').classList.remove('visible')
        document.getElementById('zoom-helpers').classList.add('hidden')
    }
    else {
        document.getElementById('zoom-show').innerHTML = "Hide";
        document.getElementById('zoom-helpers').classList.remove('hidden')
        document.getElementById('zoom-helpers').classList.add('visible')
    }
    zoomToolsVisible = !zoomToolsVisible;
}






let viewBox = [-800, -100, 1600, 800] // Does this match what's on the html file?
let page_scale = 1;
function setViewBox() {
    // top left width height
    let viewBoxString = parseFloat(viewBox[0]) + ' ' + parseFloat(viewBox[1]) + ' ' + parseFloat(viewBox[2]) + ' ' + parseFloat(viewBox[3])
    document.getElementById('svg-box').setAttribute('viewBox', viewBoxString)
}
function panX(slide) {
    viewBox[0] += slide;
    setViewBox();
}
function panY(slide) {
    viewBox[1] += slide;
    setViewBox();
}
function slideLeft() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            panX(4)
        }, (i * i * 1))
    }
}
function slideRight() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            panX(-4)
        }, (i * i * 1))
    }
}
function slideUp() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            panY(4)
        }, (i * i * 1))
    }
}
function slideDown() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            panY(-4)
        }, (i * i * 1))
    }
}
function zoomIn() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            zoom(1/1.03)
        }, (i * i * 1))
    }
}
function zoomOut() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            zoom(1.03)
        }, (i * i * 1))
    }
}
function zoomInSmall() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            zoom(1/1.01)
        }, (i * i * 1))
    }
}
function zoomOutSmall() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            zoom(1.01)
        }, (i * i * 1))
    }
}
function zoom(scale) {
    // panX(scale * viewBox[0])
    // panY(scale * viewBox[1])
    viewBox[0] *= scale;
    viewBox[1] *= scale;
    viewBox[2] *= scale;
    viewBox[3] *= scale;
    page_scale *= scale;
    setViewBox();
}

let mouseDown = false;
let touchDown = false;
let pinch = true;
let pinchDist = 0;
let startX = 0;
let startY = 0;
// let scrollTimeout = true;




// mouse zoom svg box

let svg = document.getElementById('svg-box');
svg.addEventListener('mousedown', function(e) {onMouseDown(e)})
svg.addEventListener('mousemove', function(e) {onMouseMove(e)})
svg.addEventListener('mouseleave', function(e) {onMouseLeave(e)})
svg.addEventListener('mouseup', function(e) {onMouseUp(e)})
svg.addEventListener('wheel', (e) => {
    e.preventDefault();
    // console.log(e)
    if (e.deltaY > 5) zoom(1.015)
    else if (e.deltaY < -5) zoom(.985)
})
function onMouseDown(e) {
    mouseDown = true;
    startX = e.pageX;
    startY = e.pageY;
}
function onMouseUp(e) {
    mouseDown = false;
    startX = e.pageX
    startY = e.pageY;
}
function onMouseLeave(e) {
    mouseDown = false;
}
function onMouseMove(e) {
    if (!mouseDown) return;
    e.preventDefault();
    let x = e.pageX;
    let slideX = (x - startX) / -1 * page_scale;
    panX(slideX)
    let y = e.pageY;
    let slideY = (y - startY) / -1 * page_scale;
    panY(slideY)
    startX = e.pageX;
    startY = e.pageY;
}



// touch screen SVG pan 

svg.addEventListener('touchstart', function(e) {onTouchDownSVG(e)})
svg.addEventListener('touchmove', function(e) {onTouchMoveSVG(e)})
svg.addEventListener('touchend', function(e) {onTouchEndSVG(e)})

function onTouchDownSVG(e) {
    if (e.touches.length == 1) {
        touchDown = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        pinch = false;
    }
    else if (e.touches.length == 2) {
        // pinch zoom
        touchDown = false;
        pinch = true;
        pinchDist = Math.hypot((e.touches[0].clientX - e.touches[1].clientX), (e.touches[0].clientY - e.touches[1].clientY));
    }
    else {
        touchDown = false;
        pinch = false;
    }
}

function onTouchMoveSVG(e) {
    e.preventDefault();
    if (touchDown) {
        let x = e.touches[0].clientX;
        let slideX =  (x - startX);
        viewBox[0] -= slideX;

        let y = e.touches[0].clientY;
        let slideY = 2 * (y - startY) * page_scale;
        viewBox[1] -= slideY;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        setViewBox();
    }
    else if (pinch) {
        let newPinchDist = Math.hypot((e.touches[0].clientX - e.touches[1].clientX), (e.touches[0].clientY - e.touches[1].clientY));
        // console.log(newPinchDist, pinchDist);
        zoom(pinchDist / newPinchDist);
        pinchDist = newPinchDist;
    }
}


function onTouchEndSVG(e) {
    if (e.touches.length == 0) {
        touchDown = false;
        pinch = false;
    }
    else if(e.touches.length == 1) {
        // cannot go to panning after zooming - this stops the graphic from jumping
        touchDown = false;
        pinch = false;
    }
    else if (e.touches.length == 2) {
        touchDown = false;
        pinch = true;
    }
    else {
        touchDown = false;
        pinch = false;
    }
}




// mouse drag sidebar

let drag = document.getElementById('drag-bar');
drag.addEventListener('mousedown', function(e) {onDragDown(e)})
drag.addEventListener('mousemove', function(e) {onDragMove(e)})
drag.addEventListener('mouseleave', function(e) {onDragLeave(e)})
drag.addEventListener('mouseup', function(e) {onDragUp(e)})

function onDragDown(e) {
    onMouseDown(e);
    document.getElementById('drag-bar').classList.add('drag-bar-wide')
}
function onDragUp(e) {
    onMouseUp(e);
    document.getElementById('drag-bar').classList.remove('drag-bar-wide')
}
function onDragLeave(e) {
    onMouseLeave(e);
    document.getElementById('drag-bar').classList.remove('drag-bar-wide')
}

function onDragMove(e) {
    if (!mouseDown) return;
    e.preventDefault();
    let x = e.pageX;
    let slideX = (x - startX);
    current_drag_width -= slideX;
    document.getElementById('verse-info').setAttribute('style', "--verse_info_width:" + parseFloat(current_drag_width) + "px")
    document.getElementById('svg-box').setAttribute('style', "--verse_info_width:" + parseFloat(current_drag_width) + "px")
    document.getElementById('zoom-helpers').setAttribute('style', "--verse_info_width:" + parseFloat(current_drag_width) + "px")
    document.getElementById('zoom-show').setAttribute('style', "--verse_info_width:" + parseFloat(current_drag_width) + "px")

    startX = e.pageX;
}













// touch screen drag sidebar

drag.addEventListener('touchstart', function(e) {onTouchDownDrag(e)})
drag.addEventListener('touchmove', function(e) {onTouchMoveDrag(e)})
drag.addEventListener('touchend', function(e) {onTouchEndDrag(e)})

function onTouchDownDrag(e) {
    touchDown = true;
    startX = e.touches[0].clientX;
    let touch = e.touches[0];
}
function onTouchMoveDrag(e) {
    // console.log('touch move', e);
    e.preventDefault();
    if (touchDown) {
        let x = e.touches[0].clientX;
        let slideX = (x - startX);
        current_drag_width -= slideX;
        document.getElementById('verse-info').setAttribute('style', "--verse_info_width:" + parseFloat(current_drag_width) + "px")
        document.getElementById('svg-box').setAttribute('style', "--verse_info_width:" + parseFloat(current_drag_width) + "px")
        document.getElementById('zoom-helpers').setAttribute('style', "--verse_info_width:" + parseFloat(current_drag_width) + "px")
        document.getElementById('zoom-show').setAttribute('style', "--verse_info_width:" + parseFloat(current_drag_width) + "px")

        startX = e.touches[0].clientX;
    }
}

function onTouchEndDrag(e) {
    touchDown = false;
}