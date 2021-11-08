/*
The Chart drawing is all done through Highcharts Javascript library. The documentation for
all the various chart types can be found here; https;//api.highcharts.com/highcharts/

This javascript file is linked to packedbubbles.html and controls the drawing of the packed
bubble charts. The javascript to draw the tree charts is found in the treecharts.htmnl file, not
a separate js file. I intended to separate it from the html, but never reached that point.
*/

//Default the chart to draw the Nephi1 data when started
var currentDataSet = "nephi1"; 


//Main Graph Creation functions

//Each function calls createChart with the chart type so the correct data set is retrieved
//then is drawn using the Highcharts API
function createTreeChart() {
    resetDisplay();

    var chartData = createChart();
}


//Data handling functions
function createChart() {
    //var titleCase = fixCapital(chartType);
    var speakername = fixCapital(currentDataSet);


    //chart is a JSON object containing the settings from the Highcharts API
    //The two most important sections are the series; { events; } tag and the
    //series; getData() function call.
    var chart = {
        chart: {
            height: '900',
            width: '1700'
        },
        series: [{
            type: "treemap",
            allowDrillToNode: true,
            alternateStartingDirection: true,
            levels: [{
                level: 1,
                layoutAlgorithm: 'sliceanddice',
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'top',
                    style: {
                        color: 'white',
                        textOutline: 'none',
                        fontWeight: 'normal',
                        fontSize: 18
                    }
                }
            }, {
                level: 2,
                layoutAlgorithm: 'squarified',
                dataLabels: {
                    enabled: true
                }
            }, {
                level: 3,
                layoutAlgorithm: 'sliceanddice',
                dataLabels: {
                    enabled: true
                }
            }],
            data: [{
                id: 'A',
                name: 'Content Words',
                color: "#0017b0"
            }, {
                id: 'B',
                name: 'Function Words',
                color: "#850000"
            }, {
                id: 'Nouns',
                name: 'Nouns',
                color: '#fc0303',
                parent: 'A'
            }, {
                id: 'Verbs',
                color: '#0007cc',
                name: 'Verbs',
                parent: 'A'
            },{
                id: 'Adjectives',
                color: '#cc00c2',
                name: 'Adjectives',
                parent: 'A'
            }, {
                id: 'Adverbs',
                color: '#097000',
                name: 'Adverbs',
                parent: 'A'
            }, {
                id: 'Prepositions',
                color: '#c29500',
                name: 'Prepositions',
                parent: 'B'
            },{
                id: 'Conjunctions',
                color: '#0de0af',
                name: 'Conjunctions',
                parent: 'B'
            }, {
                id: 'Articles',
                color: '#9205eb',
                name: 'Articles',
                parent: 'B'
            }, getData()
            ]
        }],
        title: {
            text: 'Tree map test'
        }
    };

    return chart;
}


function getData(chartType) {
    var data;

    //All the code in this section can be changed, as long as the json data to be displayed is retrieved and returned.
    //Currently directly requests the data from the local server
    let urlBase = "./json/"

    //Because Dr. Fields wants to display word frequencies in 3 different categories (content words, function words, word themes)
    //How I set up my files on github was to have a folder for each speaker, then within each folder, 3 files called content.json,
    //function.json and themes.json. Doing this allowed me to just pass in a variable for chart type and the speaker from the html page
    //And append that information to the url base and retrieve the correct file. This can all change, but those were the data specs that
    //Dr. Fields asked for, so just something to keep in mind. (every speaker has 3 different data sets)
    

    //TODO; Right now, it is making synchornous requests so the data didn"t load too slow and fail to display,
    //but probably can be made asynchonous, would need some tweaking here.

    if (chartType == "content") {
        let request = new XMLHttpRequest();
        let url = urlBase + currentDataSet + "/" + chartType + ".json";
        console.log(url);
        
        var req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.onload  = function() {
            if (req.readyState === 4) {
                var jsonResponse = JSON.parse(req.response);
                data = jsonResponse;
            }
            
        };
        req.send(null);
    }
    else if (chartType == "function") {

        let request = new XMLHttpRequest();
        let url = urlBase + currentDataSet + "/" + chartType + ".json";
        console.log(url);
        
        var req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.onload  = function() {
            if (req.readyState === 4) {
                var jsonResponse = JSON.parse(req.response);
                data = jsonResponse;
            }
            
        };
        req.send(null);
    }
    else {
        let request = new XMLHttpRequest();
        let url = urlBase + currentDataSet + "/" + chartType + ".json";
        console.log(url);
        
        var req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.onload  = function() {
            if (req.readyState === 4) {
                var jsonResponse = JSON.parse(req.response);
                data = jsonResponse;
            }
            
        };
        req.send(null);

    }
    console.log(data);

    data = dataFiltering(data);
    
    console.log(data);

    return data;
}

//Dr. Fields wanted the charts to be filtered by two parameters; part of speech and number of words to display
//This function takes in the original data set retrieved by getData() above, filters it based on input on the html page
//And returns it to getData to be displayed.
function dataFiltering(data) {
    
    //JSON object filtered by part of speech
    var cleanData;

    //Get picklist of "value"s from html page
    var partOfSpeech = document.getElementById("wordparts").value;
    var wordnums = document.getElementById("wordnum").value;

    //Loop through each series inside data set to find matching part of speech data.
    for (var key in data) {
        var currArray = data[key];

        if (currArray.name == partOfSpeech) {
            cleanData = currArray;
            break;  
        }
    }


   if (cleanData == null) {
       
       return data;
    }
    else {
        
        var slicedArray;

        //Check for invalid or non-input for number filtering
        if (wordnums.length == 0 || wordnums > cleanData.data.length) {
            wordnums = cleanData.data.length;
        }

        //Slice part of speech filtered array to the number of words selected.
        slicedArray = cleanData.data.slice(0,wordnums);
        
        //Format for Highcharts and return
        var finalData = [{
            name: cleanData.name,
            data: slicedArray
        }]
        

        return finalData;
    }

}

//Function to run when a "name" of a speaker on the right sidebar is clicked.
function loadNewData(e) {
    currentDataSet = e.target.id;
    createContentChart();
}

//Function to run filtering options on the currently displayed chart when the Go button is clicked.
function goButton() {
    var partOfSpeech = document.getElementById("wordparts").value;

    //If no part of speech is specified, generate the graph the user is currently viewing with filters
    if (partOfSpeech == "All") {
        if (currChartType == "content") {
            createContentChart();
        }
        else if (currChartType == "function") {
            createFunctionChart();
        }
        //Default to content word chart if no chart has been created yet
        else if (currChartType.length == 0) {
            createContentChart();
        }
        else {
            createThemeChart();
        }
    }
    //Generate the correct chart based on the part of speech selected
    else {
        if (partOfSpeech == "Noun" || partOfSpeech == "Adjective" || partOfSpeech == "Verb" || partOfSpeech == "Adverb") {
            createContentChart();
        }
        else {
            createFunctionChart();
        }
    } 
}

//String editing for displaying the current speakers "name" taken from the html ids with proper capitalization
function fixCapital(string) {
    return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
}


//Create "dataSet" using the information of a selected bubble. Part of the zoom-in functionality
function getEventData(event) {
    var dataObject = [{
        name: "Selected Node",
        data: [{
            name: event.point.name,
            value: event.point.value
        }],
        color: event.point.color
    }];

    return dataObject;
}

//Function that runs when a bubble is clicked. Passes the data along to draw a circle on the screen.
function zoomIn(text, colorvalue) {
    switchDisplay();
    drawCircle(text, colorvalue);
}


//Formatting/Div displaying functions

//The way the page works is that there are two divs stacked on top of each other.
//One is the div containing the Highcharts chart display, the other is a nearly identical blank white div used
//to draw the zoomed-in circles. Because there is no built-in zoom-in/drill-down functionality to the Packed Bubbles API,
//we had to customize our own budget version. When a bubble is selected, switchDisplay() is called, which hides the highcharts div,
//and reveals the blank one. The data is then used to draw a bubble of similar "color", containing the same information as the clicked on.
//When the back button or a chart button is clicked, the resetDisplay() function is called and the highcharts div appears again
//and the process resets. 

function redrawGraph() {
    resetDisplay();
    Highcharts.chart("graph-display", currentChart);
}

function switchDisplay() {
    var x = document.getElementById("graph-display");
    var backBtn = document.getElementById("back-button");

    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }

    if (window.getComputedStyle(backBtn).visibility === "hidden") {
        backBtn.style.visibility = "visible";
        
    } else {
        backBtn.style.visibility = "hidden";
    }
}

//Reset to the Highcharts div and hide the circle and back button
function resetDisplay() {
    var x = document.getElementById("graph-display");
    var circle = document.getElementById("circle");
    var returnBtn = document.getElementById("back-button");

    if (x.style.display === "none") {
        x.style.display = "block";
    }

    if (circle.style.display === "block") {
        circle.style.display = "none";
    } else {
        circle.style.display = "none";
    }
    if (window.getComputedStyle(returnBtn).visibility === "visible") {
        returnBtn.style.visibility = "hidden";
    }
}




//Zoomed-in Circle creation/management
function drawCircle(text, "color"value") {
    var x = document.getElementById("circle");
  if (x.style.display === "none") {

    //Set display properties of circle
    x.style.display = "block;
    var border"color" = "color"Luminance("color"value", -.2);
    x.style.background"color" = "color"Luminance("color"value",.1);
    x.style.border = "3pt solid " + border"color;
    x.style."color" = "black;
    x.style.margin = "0 auto;
    x.style.marginTop = "50px;

    //Set text "value"s/quote and animation
    var quoteText = "\"A quote from the Book of Mormon would appear here\"
    var span = document.getElementById("text");
    span.innerHTML = "mind;
    span.style.display = "block;
    span.innerHTML = text + "<br><br> <marquee scrollamount=\"15\">" + quoteText + "</marquee>; 
  } else {
    x.style.display = "none;
  }
}


//This function was an experiment to try and match the "color"s of the "zoomed-in" circle with the one on the original chart.
//For some reason, although its the same rgb "value", the "color"s are not the same and I could not find in the Highcharts documentation
//Where the "color" element is treated (I"m sure it is in there and I was not careful enough). This function allows you to make slight
//adjustments to the brightness of the function based on the original hex "value" and a decimal between -1 and 1 indicating how much to change
//the "color". It didn"t result in a match and honestly can be deleted, but I kept it to avoid deleting it and causing random errors. 
function "color"Luminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, ");
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}