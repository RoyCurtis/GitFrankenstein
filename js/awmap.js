var worldMap;

//Marker handling functions
//This places the final marker on the map.
function createMarker(loc, dom)
{
	var marker = new GMarker(loc);
	GEvent.addListener(marker, "click", function()
	{
		marker.openInfoWindow(dom);
	});
	
	return marker;
}

function markPOI(title, description, location, image)
{
	var displayDiv = document.createElement("div");
	displayDiv.style.width = "400px";
	
	var titleDiv = document.createElement("div");
	titleDiv.innerHTML = title;
	titleDiv.style.fontWeight = "bold";
	displayDiv.appendChild(titleDiv);
	
	var contentDiv = document.createElement("div");
	
	if(image != null)
	{
		var imageChild = document.createElement("img");
		imageChild.src = image;
		imageChild.style.cssText = "float: left"; //Since IE is stupid and doesn't support either style.cssFloat or element.setAttribute('style', ...) I had to use this.
		contentDiv.appendChild(imageChild);
	}
	
	contentDiv.appendChild (document.createTextNode(description));
	displayDiv.appendChild(contentDiv);
	

	var hRule = document.createElement("hr");
	hRule.height = "1px";
	hRule.color = "black";
	displayDiv.appendChild(hRule);
	
	var linkDiv = document.createElement("a");
	var linkURL = "http://objects.activeworlds.com/cgi-bin/teleport.cgi?aw_" + parseLatLng(parseLocation(location));	
	linkDiv.href = linkURL;
	linkDiv.innerHTML = "Teleport Here";
	displayDiv.appendChild(linkDiv);
	
	worldMap.addOverlay(createMarker(parseLocation(location), displayDiv));
}

// General event handlers
// Handles the user pressing enter while searching coordinates.
function handleEnter(event)
{
	var keyCode = null;

	if(event.which)
	{
		keyCode = event.which;
	}
	else if(event.keyCode)
	{
		keyCode = event.keyCode;
	}
	
	if(13 == keyCode)
	{
		document.getElementById("gotoBtn").click();
		return false;
	}
	
	return true;
}

// Handles the user clicking the "Link here" link.
function linkHere()
{
	var center = worldMap.getCenter();
	var zoom = worldMap.getZoom();
	var linkURL = window.location.protocol + "//" + window.location.host + window.location.pathname + "?location=" + parseLatLng(center) + "&zoom=" + zoom;
	var linkElement = document.getElementById("linkHere");
	linkElement.innerHTML = linkURL;
	linkElement.href = linkURL;

}

// Handles the user clicking the "Teleport here" link.
function teleportHere()
{
	var center = worldMap.getCenter();
	var linkURL = "http://objects.activeworlds.com/cgi-bin/teleport.cgi?aw_" + parseLatLng(center);
	window.location = linkURL;
}

//Handles the user and client clicking the "goto" button.
function gotoLocation()
{
	worldMap.setCenter(parseLocation(document.getElementById("inputLocation").value));
	worldMap.setZoom(10);
	worldMap.savePosition();
}

//Takes an AW style coordinate and returns the corresponding GLatLng
function parseLocation(inputLocation)
{
	var nsCoord = inputLocation.match("[0-9]*[.]?[0-9]*[NnSs]");
	var ewCoord = inputLocation.match("[0-9]*[.]?[0-9]*[EeWw]");

	var lat,lng;
	if(nsCoord != null && ewCoord != null)
	{
		lat = parseFloat(nsCoord) * (inputLocation.match("[Nn]") != null ? 1 : -1);
		lng = parseFloat(ewCoord) * (inputLocation.match("[Ww]") != null ? 1 : -1);
	}
	else
	{
		lat = 0;
		lng = 0;
	}
	
	return new GLatLng(lat/1024, lng/1024);
}

function parseLatLng(center)
{
	return Math.abs(center.lat()*1024) + (center.lat() >= 0 ? "N" : "S") + "_" + Math.abs(center.lng()*1024) + (center.lng() >= 0 ? "W" : "E")
}

//Control for displaying position and other information on the map.
function InformationControl() {}

InformationControl.prototype = new GControl();

//Initializer function.
InformationControl.prototype.initialize = function(map)
{
	var container = document.createElement("div");

	var displayDiv = document.createElement("div");

	displayDiv.style.color = "#000000";
	displayDiv.style.backgroundColor = "white";
	displayDiv.style.font = "small Arial";
	displayDiv.style.border = "1px solid black";
	displayDiv.style.padding = "2px";
	displayDiv.style.marginBottom = "3px";
	displayDiv.style.textAlign = "center";
	displayDiv.style.width = "250px";

	
	
	var currentLocation = document.createElement("span");
	var mouseLocation = document.createElement("span");
	currentLocation.innerHTML = "<span style='position: absolute; left: 10px'>Current Location:</span>";
	mouseLocation.innerHTML = "<span style='position: absolute; left: 10px'>Mouse Location:</span>";
	
	var showPOISpan = document.createElement("span");
	var showPOI = document.createElement("input");
	showPOI.type = "checkbox";
	
	showPOISpan.appendChild(showPOI);
	showPOISpan.appendChild(document.createTextNode("Show Points of Interest"));
	showPOISpan.style.cssText = "position: absolute; left: 10px";
	
	GEvent.addDomListener(showPOI, "click", function()
	{
		alert("Hello!");
	});
	
	displayDiv.appendChild(currentLocation);
	displayDiv.appendChild(document.createElement("br"));
	displayDiv.appendChild(mouseLocation);
	displayDiv.appendChild(document.createElement("br"));
	/*
	displayDiv.appendChild(document.createElement("br"));
	displayDiv.appendChild(document.createTextNode("Map Options"));
	displayDiv.appendChild(document.createElement("br"));
	displayDiv.appendChild(showPOISpan);
	
	displayDiv.appendChild(document.createElement("br"));*/
	
	GEvent.addListener(map, "moveend", function()
	{
		var center = map.getCenter();
		currentLocation.innerHTML = "<span style='position: absolute; left: 10px'>Current Location:</span><span style='position: absolute; right: 10px'>" + Math.abs(center.lat()*1024) + (center.lat() >= 0 ? "N" : "S") + " " + Math.abs(center.lng()*1024) + (center.lng() >= 0 ? "W" : "E") + "</span>";

		var linkElement = document.getElementById("linkHere");
		linkElement.innerHTML = "";
		linkElement.href = "";
	
	});
	
	GEvent.addListener(map, "mousemove", function(center)
	{
		mouseLocation.innerHTML = "<span style='position: absolute; left: 10px'>Mouse Location:</span><span style='position: absolute; right: 10px'>" + Math.abs(center.lat()*1024) + (center.lat() >= 0 ? "N" : "S") + " " + Math.abs(center.lng()*1024) + (center.lng() >= 0 ? "W" : "E") + "</span>";
	});

	container.appendChild(displayDiv);
	map.getContainer().appendChild(container);
	return container;
}

//Default position function.
InformationControl.prototype.getDefaultPosition = function()
{
	return new GControlPosition(G_ANCHOR_TOP_RIGHT, new GSize(5, 5));
}

//Handles the page being loaded.
function load()
{
	if (GBrowserIsCompatible())
	{
		var tilelayers = [];
		
		tilelayers[1] = new GTileLayer(new GCopyrightCollection("AlphaWorld"),0,12);
		
		tilelayers[1].getCopyright = function(a,b)
		{
			return {prefix:"(C) 2009 ", copyrightTexts:["<a href='http://www.imabot.com/'>ImaBot</a>"]};
		}

		// ===== Instead of calling a script to load the tile =====			
		tilelayers[1].getTileUrl = function (point, zoom)
		{
			if (zoom < 6)
			{
				return "http://maptiles.imabot.com/alphaworld/upper/" + (zoom) + "_" + (point.x) + "_" + (point.y) + ".png";
			}
			else
			{
	  			var workx = Math.floor((point.x)/Math.pow(2,zoom-6))
	  			var worky = Math.floor((point.y)/Math.pow(2,zoom-6))
		 		return "http://maptiles.imabot.com/alphaworld/" + workx + "_" + worky + "/" + (zoom) + "_" + (point.x) + "_" + (point.y) + ((zoom > 11) ? ".jpg" : ".png");
			}
		}

		
		tilelayers[0] = new GTileLayer(new GCopyrightCollection("AlphaWorld"),0,12);
		tilelayers[0].getTileUrl = function(point, zoom)
		{
			if(zoom <= 10)
			{
				return "http://maptiles.imabot.com/alphaworld/blank.png";
			}
			else
			{
				return "http://maptiles.imabot.com/alphaworld/nodata.png";
			}
		}
		
		// ====== Create the MapType ==============
		var custommap = new GMapType(tilelayers, new AWProjection(16, 320), "AW", {errorMessage:"No images are available for this area at this zoom level.", tileSize:320});

		// === create the map ===
		worldMap = new GMap2(document.getElementById("map"));

		// === add the new maptype to it ===
		worldMap.addMapType(custommap);
		
		// === set some properties ===
		worldMap.enableContinuousZoom();
		worldMap.enableScrollWheelZoom();
		worldMap.disableDoubleClickZoom();
			
		worldMap.addControl(new GLargeMapControl());
		worldMap.addControl(new InformationControl());
		
		//Parses the query string as needed.
		var qsParm = new Array();
		function qs()
		{
			var query = window.location.search.substring(1);
			var parms = query.split('&');
			for (var i=0; i<parms.length; i++)
			{
				var pos = parms[i].indexOf('=');
				if (pos > 0)
				{
					var key = parms[i].substring(0,pos);
					var val = parms[i].substring(pos+1);
					qsParm[key] = val;
				}
			}
		}
		
		qsParm['location'] = "";
		qsParm['zoom'] = 6;
		qs();

		worldMap.setCenter(parseLocation(qsParm['location']), parseInt(qsParm['zoom']), custommap);
		worldMap.savePosition();
		
		document.getElementById("map").style.height = document.body.offsetHeight-51 + "px";
		worldMap.checkResize();

		
		GEvent.addDomListener(window, "resize", function()
		{
			document.getElementById("map").style.height = document.body.offsetHeight-51 + "px";
			worldMap.checkResize();
		});
		
		//markPOI("Random Location", "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.", "500n 500w", "http://www.theenginerd.com/images/tat-small.png");
	}
}
