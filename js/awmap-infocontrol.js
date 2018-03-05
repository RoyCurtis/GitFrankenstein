//Control for displaying position and other information on the map.
function InformationControl(map)
{
    var container  = document.createElement("div");
    var displayDiv = document.createElement("div");

    // TODO: Move this to CSS
    displayDiv.style.color           = "#000000";
    displayDiv.style.backgroundColor = "white";
    displayDiv.style.font            = "small Arial";
    displayDiv.style.border          = "1px solid black";
    displayDiv.style.padding         = "2px";
    displayDiv.style.marginBottom    = "3px";
    displayDiv.style.textAlign       = "center";
    displayDiv.style.width           = "250px";

    var currentLocation = document.createElement("span");
    var mouseLocation   = document.createElement("span");
    currentLocation.innerHTML = "<span style='position: absolute; left: 10px'>Current Location:</span>";
    mouseLocation.innerHTML   = "<span style='position: absolute; left: 10px'>Mouse Location:</span>";

    var showPOISpan = document.createElement("span");
    var showPOI     = document.createElement("input");
    showPOI.type = "checkbox";

    showPOISpan.appendChild(showPOI);
    showPOISpan.appendChild(document.createTextNode("Show Points of Interest"));
    showPOISpan.style.cssText = "position: absolute; left: 10px";

    google.maps.event.addDomListener(showPOI, "click", function()
    {
        alert("Hello!");
    });

    displayDiv.appendChild(currentLocation);
    displayDiv.appendChild(document.createElement("br"));
    displayDiv.appendChild(mouseLocation);
    displayDiv.appendChild(document.createElement("br"));

    google.maps.event.addListener(map, "dragend", function()
    {
        var center = map.getCenter();
        var lat    = Math.floor( Math.abs(center.lat() * 1024) ) + (center.lat() >= 0 ? "N" : "S");
        var lng    = Math.floor( Math.abs(center.lng() * 1024) ) + (center.lng() >= 0 ? "W" : "E");

        currentLocation.innerHTML = "<span style='position: absolute; left: 10px'>Current Location:</span>" +
            "<span style='position: absolute; right: 10px'>" + lat + " " + lng + "</span>";

        var linkElement = document.getElementById("linkHere");
        linkElement.innerHTML = "";
        linkElement.href = "";
    });

    google.maps.event.addListener(map, "mousemove", function(evt)
    {
        var center = evt.latLng;
        var lat    = Math.floor( Math.abs(center.lat() * 1024) ) + (center.lat() >= 0 ? "N" : "S");
        var lng    = Math.floor( Math.abs(center.lng() * 1024) ) + (center.lng() >= 0 ? "W" : "E");

        mouseLocation.innerHTML = "<span style='position: absolute; left: 10px'>Mouse Location:</span>" +
            "<span style='position: absolute; right: 10px'>" + lat + " " + lng + "</span>";
    });

    container.appendChild(displayDiv);
    this.div = container;
}