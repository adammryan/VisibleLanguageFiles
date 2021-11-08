function importData() {
    const url = './compiledDataNew.json'; // local Server
    const req = new XMLHttpRequest();
    // console.log(url)
    
    req.open("GET", url, false);
    req.send(null);
    return JSON.parse(req.response);
}

// Program Data - settings will be set in individual js files

const svgns = "http://www.w3.org/2000/svg";
let data = importData();
// console.log(data.speakers.sort((a,b) => a.percentage - b.percentage))

function swapChart(type) {
    if (type == state.chartType) { return }
    // change to 3dChart
    if (type == '3dChart') {
        // console.log('change to 3d')
        state.chartType = '3dChart';
        document.getElementById('3d-button').setAttribute('class', 'chart-button button-selected')
        document.getElementById('arc-button').setAttribute('class', 'chart-button button-unselected')

        document.getElementById('3d-timeline').setAttribute('class', 'chart-selected chart-item')
        document.getElementById('arc-diagram').setAttribute('class', 'chart-unselected chart-item')
        if (!settings3d.spin) document.getElementById('scroll-spin-button').click();
    }
    else if (type == 'arcDiagram') {
        // console.log('change to arc')
        state.chartType = 'arcDiagram'
        document.getElementById('3d-button').setAttribute('class', 'chart-button button-unselected')
        document.getElementById('arc-button').setAttribute('class', 'chart-button button-selected')

        document.getElementById('3d-timeline').setAttribute('class', 'chart-unselected chart-item')
        document.getElementById('arc-diagram').setAttribute('class', 'chart-selected chart-item')

        createConnections();
    }
}

function getImageString(name) {
    // return './images/' + name + '.jpg' // for local
    return './images/' + name + '.jpg' // for server
}

function updateBannerPicture(name) {
    let imageBox = document.getElementById('banner-image');
    imageBox.innerHTML = '';
    let image = document.createElement('img')
    const imageString = getImageString(name)
    image.setAttribute('src', imageString)
    image.setAttribute('alt', getDisplayName(name))
    image.setAttribute('class', 'banner-image')
    imageBox.append(image)
}
function updateBannerStats(obj) {
    let speaker = data.speakers.find(a => a.name == obj.name)

    let lifespan = document.getElementById('banner-lifespan')
    lifespan.innerHTML = speaker.lifespan.start + ' - ' + speaker.lifespan.end

    let relationshipString = ''
    // console.log(speaker)
    let arr = speaker.outgoing.filter(obj => (!obj.type.includes("language") || obj.type.length > 1))
    for (let i = 0; i< arr.length; i++) {
        relationshipString = relationshipString + '<ul>' + getDisplayName(arr[i].name) + " <em>(";
        relationshipString += arr[i].connection;
        relationshipString += ')</em></ul>'
        // if (i < arr.length - 1) {
        //     relationshipString += ', '
        // }
    }
    document.getElementById('banner-relations').innerHTML = relationshipString;
}

function updateSpeakerBanner(obj) {
    let banner = document.getElementById('banner');
    
    let name = document.getElementById('banner-name');
    name.innerHTML = getDisplayName(obj.name);

    banner.style.display = 'default'
    banner.setAttribute('class', 'speaker-banner-container')
    banner.style.animation = 'none';

    updateBannerPicture(obj.name);
    updateBannerStats(obj);

    setTimeout(()=> {
        // banner.setAttribute('class', 'speaker-banner-container banner-animate')
        banner.style.animation = 'ease 1000ms fade-in forwards'
    }, 1)
    

}

function tooltipEventListener(e) {
    const toolTip = document.querySelector('.tooltip');

    if (toolTip == null) return;

    toolTip.style.left = e.pageX + 2 + 'px';
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

function tooltipOn(d) {
    let tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = getDisplayName(d.name)
    tooltip.setAttribute('class', 'tooltip tooltip-visible');
    createTooltipEventListener();
}
function tooltipOff() {
    document.getElementById('tooltip').setAttribute('class', 'tooltip tooltip-hidden');
    destroyTooltipEventListener();
}

// the way to do this might be to have each group have name objects like
// [ {name: 'nephi1', offset: 1}, ... ]

const group_major = [
    "lehi",
    "nephi1",
    "jacob",
    "enos",
    "jarom",
    "zeniff",
    "amaleki",
    "abinadi",
    "benjamin",
    "alma",
    "limhi",
    "mosiah",
    "amulek",
    "alma2",
    "ammon2",
    "korihor",
    "pahoran",
    "moroni1",
    "helaman1",
    "nephi2",
    "samuel-lamanite",
    "mormon",
    "moroni2",
]

const group_secondary = [
    "sariah",
    "nephi-brethren",
    "omni",
    "chemish",
    "noah",
    "lamoni-father",
    "anti-nephi-lehi",
    "lamoni",
    "aaron",
    "zeezrom",
    "helaman2",
    "giddianhi",
]

const group_minimal = [
    "laban", 
    "ishmael-daughter",
    "sherem",
    "amaron",
    "abinadom", 
    "lamanite-king",
    "gideon",
    "giddonah",
    "ammon1",
    "nephihah",
    "amalekite",
    "lamoni-wife",
    "antionah",
    "lamoni-servant", 
    "judge",
    "gid",
    "amalickiah",
    "zerahemnah",
    "ammaron",
    "nephite-soldier",
    "laman-spy",
    "aminadab",
    "lachoneus",
    "gidgiddoni",
    "poor-zoramite",
    "abinadom",
    "zoramite-prayer",
    "ammoron",
    "helaman1", 
]

const group_jaredites = [
    "akish",
    "jared-brother",
    "jared2",
    "jared-daughter",
    "jared1",
    "ether",
]

const group_OT = [
    "joshua",
    "zenock",
    "john",
    "satan",
    "jacob-israel",
    "micah",
    "moses",
    "malachi",
    "joseph",
    "angels",
    "zenos",
    "christ",
    "godhead",
    "isaiah",
]

function getGroupString(id) {
    if (group_major.includes(id)) {
        return "group-major-var" + parseInt(group_major.indexOf(id) % 5)
    }
    if (group_secondary.includes(id)) {
        return "group-secondary-var" + parseInt(group_secondary.indexOf(id) % 5)
    }
    if (group_minimal.includes(id)) {
        return "group-minimal-var" + parseInt(group_minimal.indexOf(id) % 5)
    }
    if (group_jaredites.includes(id)) {
        return "group-jaredites-var" + parseInt(group_jaredites.indexOf(id) % 3)
    }
    if (group_OT.includes(id)) {
        return "group-OT-var" + parseInt(group_OT.indexOf(id) % 3)
    }
}

const idNames = [
    "aaron",
    "abinadi",
    "abinadom",
    "akish",
    "alma",
    "alma2",
    "amaleki",
    "amalickiah",
    "amaron",
    "aminadab",
    "ammaron",
    "ammon2",
    "ammon1",
    "ammoron",
    "amulek",
    "amalekite",
    "angels",
    "anti-nephi-lehi",
    "antionah",
    "benjamin",
    "jared-brother",
    "moroni1",
    "chemish",
    "judge",
    "christ",
    "jared-daughter",
    "omer",
    "ishmael-daughter",
    "enos",
    "ether",
    "gid",
    "giddianhi",
    "giddonah",
    "gideon",
    "gidgiddoni",
    "godhead",
    "helaman1",
    "helaman2",
    "isaiah",
    "jacob-israel",
    "jacob",
    "jared2",
    "jared1",
    "jarom",
    "john",
    "joseph",
    "joshua",
    "korihor",
    "laban",
    "lachoneus",
    "laman-spy",
    "lamanite-king",
    "lamoni",
    "lamoni-father",
    "lamoni-wife",
    "lehi",
    "limhi",
    "malachi",
    "micah",
    "mormon",
    "moroni2",
    "moses",
    "mosiah",
    "nephi2",
    "nephi1",
    "nephihah",
    "nephi-brethren",
    "nephite-soldier",
    "noah",
    "omni",
    "pahoran",
    "poor-zoramite",
    "samuel-lamanite",
    "sariah",
    "satan",
    "helaman-servant",
    "lamoni-servant",
    "sherem",
    "zeezrom",
    "zeniff",
    "zenock",
    "zenos",
    "zerahemnah",
    "zoramite-prayer",
]

const displayNames = [
    "Aaron",
    "Abinadi",
    "Abinadom",
    "Akish",
    "Alma",
    "Alma the Younger",
    "Amaleki",
    "Amalickiah",
    "Amaron",
    "Aminadab",
    "Ammaron",
    "Ammon",
    "Ammon the Mulekite",
    "Ammoron",
    "Amulek",
    "An Amalekite",
    "Angels",
    "Anti-Nephi-Lehi",
    "Antionah",
    "Benjamin",
    "Brother of Jared",
    "Captain Moroni",
    "Chemish",
    "Chief Judge",
    "Christ in America",
    "Daughter of Jared Son of Omer",
    "Omer",
    "Daughters of Ishmael",
    "Enos",
    "Ether",
    "Gid",
    "Giddianhi",
    "Giddonah",
    "Gideon",
    "Gidgiddoni",
    "Godhead",
    "Helaman",
    "Helaman Son of Helaman",
    "Isaiah",
    "Jacob (Israel)",
    "Jacob",
    "Jared Son of Omer",
    "Jared",
    "Jarom",
    "John the Baptist",
    "Joseph",
    "Joshua",
    "Korihor",
    "Laban",
    "Lachoneus",
    "Laman the Nephite Spy",
    "Lamanite King",
    "Lamoni",
    "Lamoni's Father",
    "Lamoni's Wife",
    "Lehi",
    "Limhi",
    "Malachi",
    "Micah",
    "Mormon",
    "Moroni",
    "Moses",
    "Mosiah",
    "Nephi Son of Helaman",
    "Nephi",
    "Nephihah",
    "Nephi's Brethren",
    "Nephite Soldier",
    "Noah",
    "Omni",
    "Pahoran",
    "Poor Zoramite",
    "Samuel the Lamanite",
    "Sariah",
    "Satan",
    "Servant of Helaman",
    "Servant of Lamoni",
    "Sherem",
    "Zeezrom",
    "Zeniff",
    "Zenock",
    "Zenos",
    "Zerahemnah",
    "Zoramite Prayer"
];

function getDisplayName(id) {
    return displayNames[idNames.indexOf(id)]
}
