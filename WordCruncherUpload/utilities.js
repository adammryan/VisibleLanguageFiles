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

const splitNames = [
    "Aaron",
    "Abinadi",
    "Abinadom",
    "Akish",
    "Alma 1",
    "Alma 2",
    "Amaleki",
    "Amalickiah",
    "Amaron",
    "Aminadab",
    "Ammaron",
    "Ammon 2",
    "Ammon 1",
    "Ammoron",
    "Amulek",
    "An Amalekite",
    "Angels",
    "Anti-Nephi-Lehi",
    "Antionah",
    "Benjamin",
    "Brother of Jared",
    "Moroni 1",
    "Chemish",
    "Chief Judge",
    "Christ in America",
    "Daughter of Jared",
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
    "Helaman 1",
    "Helaman 2",
    "Isaiah",
    "Jacob",
    "Jacob (Israel)",
    "Jared 1",
    "Jared 2",
    "Jarom",
    "John the Baptist",
    "Joseph",
    "Joshua",
    "Korihor",
    "Laban",
    "Lachoneus",
    "Laman 2",
    "Lamanite King",
    "Lamoni",
    "Lamonis Father",
    "Lamoni's Wife",
    "Lehi",
    "Limhi",
    "Malachi",
    "Micah",
    "Mormon",
    "Moroni 2",
    "Moses",
    "Mosiah",
    "Nephi 2",
    "Nephi 1",
    "Nephihah",
    "Nephis Brethren",
    "Soldier",
    "Noah",
    "Omni",
    "Pahoran",
    "Poor Zoramite",
    "Samuel",
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

function getIdNameFromSplit(name) {
    return idNames[splitNames.indexOf(name)]
}

function getDisplayNameFromSplitName(splitName) {
    return displayNames[splitNames.indexOf(splitName)]
}

function testSplitToIdFunction() {
    for (let name of splitNames) {
        console.log({
            id: getIdNameFromSplit(name),
            split: name
        })
    }
}
// testSplitToIdFunction();

function tooltipEventListener(e) {
    const toolTip = document.querySelector('.tooltip');

    if (toolTip == null) return;

    toolTip.style.left = e.pageX - 50 + 'px';
    toolTip.style.top = e.pageY + 15 + 'px';

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

function tooltipOn(text) {
    let tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = text;
    tooltip.setAttribute('class', 'tooltip tooltip-visible');
    createTooltipEventListener();
}
function tooltipOff() {
    document.getElementById('tooltip').setAttribute('class', 'tooltip tooltip-hidden');
    destroyTooltipEventListener();
}