function CreateTableFromJSON() {
    $.ajax({ url: "http://datos.santander.es/api/rest/datasets/sensores_smart_env_monitoring.json" })
        .done(function (data) {
            console.log("ok");
            console.log(data);
    })    
 }
 
 function refresh(data) {
     // EXTRACT VALUE FOR HTML HEADER. 
        // ('Book ID', 'Book Name', 'Category' and 'Price')
    var col = [];
        for (var i = 0; i < data.resources.length; i++) {
            for (var key in data.resources[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }    
    
    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < myBooks.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = myBooks[i][col[j]];
        }
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
 }
 
 
 

    
    