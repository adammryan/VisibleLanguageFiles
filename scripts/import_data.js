function getChartData(dataset, chartType) {
    // const urlBase = 'PackedBubble/graphs/json/json'; // Online Server
    const urlBase = '../graphs/json/json'; // local Server
    const url = `${location.origin}/${urlBase}/${dataset}/${chartType}.json`; 
    // const url = `${location.origin}/${urlBase}/Nephi/${chartType}.json`; 
    
    const req = new XMLHttpRequest();

    // console.log(url)

    req.open("GET", url, false);
    req.send(null);
    return JSON.parse(req.response);
}

function getSpeakerDataJSON(dataset) {
    // dataset is speaker
    const urlBase = '../graphs/speakerData';
    // const urlBase = 'PackedBubble/graphs/speakerData';
    const url = `${location.origin}/${urlBase}/${dataset}.json`; 
    const req = new XMLHttpRequest();

    req.open("GET", url, false);
    req.send(null);
    return JSON.parse(req.response);
}
