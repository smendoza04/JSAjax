function CreateTable() {
    $.ajax({ url: "http://datos.santander.es/api/rest/datasets/sensores_smart_env_monitoring.json" })
        .done(
            function (data) {
            console.log("ok");
            console.log(data);
            
            refresh(data); //TABLE FUNCTION 
            setData(data); //CHART DATA
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart);
            mapData(data);
            }
        );  
}
 
function refresh(data) { //TABLE
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

function drawChart() {
    var data = google.visualization.arrayToDataTable(array);
     
//        console.log([
//          ['Year', 'Sales', 'Expenses'],
//          ['2004',  -1000,      400],
//          ['2005',  1170.2,      460],
//          ['2006',  -660.0,       1120],
//          ['2007',  1030,      540]
//        ]);

    var options = {
      title: 'Sensores Ambientales',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

    chart.draw(data, options);
}

var array = [['Year', 'Temperature', 'Light']]; //CHART ARRAY

function setData(data) {

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

function mapData(data){
    
    var dades = [];
 
    for (var i = 0; i < data.resources.length; i++) {
        dades[i] = [parseFloat(data.resources[i]["ayto:latitude"]), parseFloat(data.resources[i]["ayto:longitude"])];
    }
    
    //console.log(dades);
    
    // PosiciÃ³ (latitud i longitud) inicial del mapa i nivell de Zoom aplicat.
    const myMap = L.map("myMap").setView([43.46293, -3.80901], 14); //43.46293,-3.80901

    // Tipus de vista que volem utilitzar i mÃ xim nivell de Zoom permÃ¨s.
    L.tileLayer(`https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png`, {
      maxZoom: 18,
    }).addTo(myMap);

    // Bucle per a recorrer l'array dades.
    dades.forEach((element) => {
        const marker = L.marker([element[0], element[1]]).addTo(myMap);
    })

};