function CreateTable() {
    $.ajax({ url: "http://datos.santander.es/api/rest/datasets/sensores_smart_env_monitoring.json" })
        .done(function (data) {
            console.log("ok");
            console.log(data);
            refresh(data); //TABLE FUNCTION 
            
    });  
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
        if (title[i] != "Battery" && title[i] !== "Longitude" && title[i] !== "Latitude") {
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