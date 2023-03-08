
function setMapCenter(lat,lng){
  let position=new google.maps.LatLng(parseFloat(lat),parseFloat(lng));  
  GV.map.setCenter(position);
  new google.maps.Marker({
      position,
      map:GV.map,
      title: "Hello World!",
      icon: "./img/pin.png" 
    });
    
}

//////////////////////////////////////////////////////////////////////////////
/////////////////////// Get location from adress ////////////////////////////
///////////////////////////////////////////////////////////////////////////////
let marker;
function GetLocation(selected,lat, lng) {
const map = new google.maps.Map(document.getElementById(selected), {
  zoom: 13,
  center: { lat, lng},
});
const geocoder = new google.maps.Geocoder();
document.getElementById("submit").addEventListener("click", () => {
  geocodeAddress(geocoder, map);
});
}
function geocodeAddress(geocoder, resultsMap) {
const address = document.getElementById("address").value;
geocoder
  .geocode({ address: address })
  .then(({ results }) => {
    console.log(results)
    resultsMap.setZoom(18)
    resultsMap.setCenter(results[0].geometry.location);   
      marker = new google.maps.Marker({
        draggable: true,
        map: resultsMap,
        position:  results[0].geometry.location,
      });
  
    google.maps.event.addListener(marker, "position_changed", update_map);
    update_map();
    
    $('#submit').css('display','none')
    $('.danger').css('display','none')
    $('.sentence').css('display','block')

  })
  .catch(() =>
  $('.danger').css('display','block')
  );
}
function update_map() {
const lat = [marker.getPosition().lat()]  ;
const lng = [marker.getPosition().lng()]  ;
document.getElementById("latitude").value = String(lat[0]);
document.getElementById("longitude").value = String(lng[0]);
}



//////////////////////////////////////////////////////////////////////////////
/////////////////// dispaly marker on the map  ////////////////////////////////
///////////////////////////////////////////////////////////////////////////////



function display_map_markers( lat, long, map){ 
let position=new google.maps.LatLng(parseFloat(lat),parseFloat(long));
marker= new google.maps.Marker({
  position,
  map:map,
  title: "",
});
}

//////////////////////////////////////////////////////////////////////////////
////////////////////////// update location  //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////



let marker1;
function UpdateMarker(selected, lat , lng, zoom ) {
const map = new google.maps.Map(document.getElementById(selected), {
  zoom: zoom,
  center: { lat, lng },
});
marker1 = new google.maps.Marker({
  map,
  draggable: true,
  position: { lat, lng},
});
google.maps.event.addListener(marker1, "position_changed", moveMarker);

moveMarker();
}

function moveMarker() {
const lat = [marker1.getPosition().lat()];
const lng = [marker1.getPosition().lng()];
document.getElementById("newlat").value = String(lat[0])
document.getElementById("newlng").value = String(lng[0])
}