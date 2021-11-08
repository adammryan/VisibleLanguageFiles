/*
* Methods to calculate text dimensions using a test div
*/


function generateTestDiv(fontSize, text) {
    const testDiv = document.createElement('div');
    testDiv.id = "test";
    testDiv.style.fontSize = `${fontSize}px`;
    testDiv.textContent = String(text);

    return testDiv;
}

function getTextWidth(fontSize, text, padding = 20) {
    const testDiv = generateTestDiv(fontSize, text);
    document.querySelector('body').appendChild(testDiv);
    const width = testDiv.clientWidth;
    testDiv.remove();
    return width + padding;
}

function getTextHeight(fontSize, text) {
    const testDiv = generateTestDiv(fontSize, text);
    document.querySelector('body').appendChild(testDiv);
    const height = testDiv.clientHeight;
    testDiv.remove();
    return height;
}


/*
* Retrieves circle width at a specified height
*/
function getInnerCircleDistance(radius, y) {
    if (y >= radius) {
        return 0;
    }
    return Math.sqrt(Math.pow(radius, 2) - Math.pow(y, 2));
}

let buttonHover = false;
let hoverTime = 0;
function addHoverClassesToControlButtons() {
    let buttons = document.getElementsByClassName('control-button');
    for (let button of buttons) {
        button.addEventListener('mouseover', function(e) { return controlButtonHover(true, e, button); })
        button.addEventListener('mouseleave', function(e) { return controlButtonHover(false, e, button); })
    }
}
addHoverClassesToControlButtons();

function controlButtonHover(option, e, self) {
    // console.log(option, e)
    buttonHover = option;
    if (option) {
        hoverTime = e.timeStamp;
        setTimeout(() => {
            if (buttonHover && e.timeStamp + 10 > hoverTime) {
                self.classList.add('control-hover');
            }
        }, 300)
    }
    else {
        self.classList.remove('control-hover');
    }
}
