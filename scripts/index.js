function resetText() {
    var list = document.getElementById("parent-list");
    var list_items = list.getElementsByTagName("li");
    for (var i = 0; i < list_items.length; ++i) {
        var current_item = list_items[i];
        var text = current_item.innerText;

        current_item.innerHTML = text;
    }
}

function loadNewGraph(e) {
    loadNewDataset(e);
    var id = e.target.id;

    if (id == "nephi1") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (id == "lehi") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "zeniff") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "jacob") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "enos") {
        resetText();
        console.log("found it!");

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "jarom") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "landl") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "benjamin") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "limhi") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "amaleki") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "anti") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "mosiah") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "abinadi") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "lamonidad") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "alma1") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "alma2") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "amulek") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "ammon2") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "lamoni") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "korihor") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "giddanhi") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "pahoran") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "helaman") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "nephi2") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "samuel") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "mormon") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "moroni1") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "moroni2") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }


}

function highlightSide(e) {

    var id = e.target.id;

    if (id == "nephi1") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (id == "lehi") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "zeniff") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "jacob") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "enos") {
        resetText();
        console.log("found it!");

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "jarom") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "landl") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "benjamin") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "limhi") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "amaleki") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "anti") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "mosiah") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "abinadi") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "lamonidad") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "alma1") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "alma2") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "amulek") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "ammon2") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "lamoni") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "korihor") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "giddanhi") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "pahoran") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "helaman") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "nephi2") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "samuel") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "mormon") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "moroni1") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }
    else if (e.target.id == "moroni2") {
        resetText();

        var item = document.getElementById(id);
        var text = e.target.innerText;

        e.target.innerHTML = "<b>" + text + "</b>";
    }


}