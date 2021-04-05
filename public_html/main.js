var data;

window.onload = function ()  {
    $.ajax({ url: "http://datos.santander.es/api/rest/datasets/sensores_smart_env_monitoring.json" })
        .done(
            function (datajson) {
            console.log("ok");
            data = datajson;
            console.log(data);
            document.getElementById("buttons").style.display = "none";
            move(); //loading bar function
            
            setTimeout(function(){ //timeout function
            document.getElementById("myProgress").style.display = "none";
            document.getElementById("buttons").style.display = "block";
            document.getElementById("myMap").style.display = "none";
            mapData();
            }, 5000);
            }    
        );  

}


//loading
function move() {
  var i = 0;
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("myBar");
    var width = 10;
    var id = setInterval(frame, 47);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
        elem.innerHTML = width  + "%";
      }
    }
  }
}
 

function clearAll() {
    document.getElementById("showData").innerHTML = "";
    document.getElementById("chartDiv").innerHTML = "";
    document.getElementById("myMap").style.display = "none";
}

function CreateTable() {
    clearAll();
    refresh(); //TABLE FUNCTION 
};

function CreateTableFilter(type) {
    clearAll();
    refreshFilter(type); //TABLE FUNCTION 
};

function CreateGraph() {
    clearAll();
    setData(); //CHART DATA
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
};

function CreateMap() {
    clearAll();
    document.getElementById("myMap").style.display = "block";
};

function refresh() { //TABLE ORIGINAL
    // EXTRACT VALUE FOR HTML HEADER. 
    var title = ["Type", "Noise", "Battery", "Latitude", "Temperature", 
        "Last Modified", "Identifier", "Longitude", "Light", "URL"];
    
    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < title.length; i++) {
        if (title[i] !== "Battery" && title[i] !== "Longitude" && title[i] !== "Latitude") {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = title[i];
            tr.appendChild(th);
        }  
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < data.resources.length; i++) {
        tr = table.insertRow(-1);

        for (var j in data.resources[i]) {         
            if (j !== "ayto:battery" && j !== "ayto:latitude" && j !== "ayto:longitude") {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = data.resources[i][j];
            }

        }
        
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
} 
 
function refreshFilter(type) { //TABLE 
    // EXTRACT VALUE FOR HTML HEADER. 
    var title = ["Type", "Noise", "Battery", "Latitude", "Temperature", 
        "Last Modified", "Identifier", "Longitude", "Light", "URL"];
    
    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    if(type == "WeatherObserved") {
        for (var i = 0; i < title.length; i++) {
            if (title[i] !== "Battery" && title[i] !== "Longitude" && title[i] !== "Latitude"
                    && title[i] !== "Noise") {
                var th = document.createElement("th");      // TABLE HEADER.
                th.innerHTML = title[i];
                tr.appendChild(th);
            }  
        }
    } else if (type == "NoiseLevelObserved") {
        for (var i = 0; i < title.length; i++) {
            if (title[i] !== "Battery" && title[i] !== "Longitude" && title[i] !== "Latitude"
                    && title[i] !== "Temperature" && title[i] !== "Light") {
                var th = document.createElement("th");      // TABLE HEADER.
                th.innerHTML = title[i];
                tr.appendChild(th);
            }  
        }
    }
    
    console.log("dr",data.resources);

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < data.resources.length; i++) {
        
        if (data.resources[i]["ayto:type"] == type){
            tr = table.insertRow(-1);

            if (type == 'WeatherObserved') {
                for (var j in data.resources[i]) {         
                    if (j !== "ayto:battery" && j !== "ayto:latitude" && j !== "ayto:longitude"
                            && j !== "ayto:noise") {
                        var tabCell = tr.insertCell(-1);
                        tabCell.innerHTML = data.resources[i][j];
                    }
                }
            }
            else if (type == 'NoiseLevelObserved') {
                for (var j in data.resources[i]) {         
                    if (j !== "ayto:battery" && j !== "ayto:latitude" && j !== "ayto:longitude"
                            && j !== "ayto:temperature" && j !== "ayto:light") {
                        var tabCell = tr.insertCell(-1);
                        tabCell.innerHTML = data.resources[i][j];
                    }
                }
            }
        }

    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}

 

//CHART FUNTIONS
var array = [['Year', 'Temperature', 'Light']]; //CHART ARRAY
function drawChart() {
    var data = google.visualization.arrayToDataTable(array);
     
    var options = {
      title: 'Weather Observed',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('chartDiv'));

    chart.draw(data, options);
}

function setData() {

    var json = {};
    
    for(var i = 0; i <  data.resources.length; i++) {
        if (data.resources[i]["ayto:type"] == "WeatherObserved") {
  
            var date = data.resources[i]["dc:modified"].substring(0,4); //GET THE YEAR ONLY
            
            if (date in json) {
                json[date]["temperature"] += parseFloat(data.resources[i]["ayto:temperature"]); //LIST THE TEMPERATURE
                if (isNaN(parseFloat(data.resources[i]["ayto:light"]))) { //CHECK IF LIGHT IS NULL OR NOT
                    json[date]["light"] += 0;
                }
                else {
                    json[date]["light"] += parseFloat(data.resources[i]["ayto:light"]);
                }
                json[date]["count"]++;
                //console.log(parseFloat(data.resources[i]["ayto:light"]));
            }
            else {
                json[date] = {}; //CREATE ALL IF NOT CREATED
                json[date]["temperature"] = 0;
                json[date]["light"] = 0;
                json[date]["count"] = 0;
                
            } 
        }     
    }    
    
    for(var i in json) { //CALCULATE THE MEDIAN OF EVERYTHING
        array[Object.keys(json).indexOf(i) + 1 ] = [i, parseFloat((json[i].temperature / json[i].count).toFixed(2)),
            parseFloat((json[i].light / json[i].count).toFixed(2))];
    }
}


//MAP FUNCTIONS
function mapData(){
    
    var dades = [];
 
    for (var i = 0; i < data.resources.length; i++) {
        dades[i] = [parseFloat(data.resources[i]["ayto:latitude"]), parseFloat(data.resources[i]["ayto:longitude"])];
    }
    
    //console.log(dades);
    
    // PosiciÃ³ (latitud i longitud) inicial del mapa i nivell de Zoom aplicat.
    const myMap = L.map("myMap").setView([43.4622552,-3.8101901], 14); //43.4622552,-3.8101901

    // Tipus de vista que volem utilitzar i mÃ xim nivell de Zoom permÃ¨s.
    L.tileLayer(`https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png`, {
      maxZoom: 16,
    }).addTo(myMap);

    // Bucle per a recorrer l'array dades.
    dades.forEach((element) => {
        const marker = L.marker([element[0], element[1]]).addTo(myMap);
    })
    
    setInterval(function () {
        myMap.invalidateSize();
    }, 100);

};
