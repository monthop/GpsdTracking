
/* this javascript is call from list-in-table.html
 * it resquest GpsdTracking GeoJsonRest adapter to get
 * the list of active devices and push on page table.
 */


/* response= {
 *           "type":"FeatureCollection"
 *           ,"features":[
 *             {"type":"Feature"
 *             ,"id":"88880001"
 *             ,"geometry":
 *                {"type":"Point"
 *                ,"coordinates":[-2.9966816666666665,47.467035]}
 *                ,"sog":18.900000000000002
 *                ,"cog":346.8
 *              },"properties": {
 *                ,"name":"Test-Dev-2"
    *             ,"href":"localhost:4001/geojson?&key=123456789&cmd=track&devid=88880001&llist=20&"
 *                "description":"Position (-2.9966816666666665,47.467035)"}
 *             ,{"type":"Feature","id":"99990003" etc.....
 *            
 */

function DevListCB (data) {
// check if response is a valid GeoJson object
    if (data.type !== "FeatureCollection") {
      // do something  
      return;
    }
    
    // get table handle from its ID name
    var tableRef= document.getElementById('DevListTable');
    var tbodyRef= tableRef.getElementsByTagName('tbody')[0];

    // clean old data if any
    while (tableRef.rows.length >1) tableRef.deleteRow(-1);
    
    // add a refresh button
    var newRow   = tbodyRef.insertRow(0);
    newRow.insertCell(0).innerHTML = "<a onclick='GetDevList()' class='button success'>Refresh</a>";
    
    // loop on Json Data and buit table contend
    $.each(data.features, function(key, val ) {
       var newRow   = tbodyRef.insertRow(0);
       newRow.insertCell(0).innerHTML = "</b><img src=" +val.device.img +" width='150'>";
       newRow.insertCell(1).innerHTML = val.properties.id;
       newRow.insertCell(2).innerHTML = val.properties.name;
       newRow.insertCell(3).innerHTML = val.geometry.coordinates[0].toFixed(4);
       newRow.insertCell(4).innerHTML = val.geometry.coordinates[1].toFixed(4);
       newRow.insertCell(5).innerHTML = val.geometry.sog.toFixed(2);
       newRow.insertCell(6).innerHTML = val.geometry.cog.toFixed(2);
       newRow.insertCell(7).innerHTML = val.geometry.age;
       newRow.insertCell(8).innerHTML = "<a href='leaflet-map.html?democmd=track&devid="+ val.properties.id + "' class='tiny success button'>Track</a>";
    });
}

function GetDevList() {
   
  // Select direct Ajax/Json profile if using GpsdTracking/HttpAjax server otherwise use JsonP
  if (HTTP_AJAX_CONFIG.JSONP) var gpsdApi = "http://breizhme.org:4080/geojson.rest?jsoncallback=?";
            else  var gpsdApi = "/ajax/geojson.rest?";
  var gpsdRqt = 
    {key   : HTTP_AJAX_CONFIG.GPSD_API_KEY // user authentication key
    ,cmd   :'list'    // rest command
    ,group :'all'     // group to retreive
    ,round : true     // ask server to round numbers
  };
  $.getJSON(gpsdApi,gpsdRqt, DevListCB);
};


try { // for test & debug  provide a predefined key demo key
    var key=HTTP_AJAX_CONFIG.API_KEY;
} catch (e) {
    HTTP_AJAX_CONFIG={JSONP: true, GPSD_API_KEY: 123456789};
}
