mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
container: 'map', // container ID
center: list.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
zoom: 6 // starting zoom
});
//Set marker options.
const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(list.geometry.coordinates)
    .setPopup(new mapboxgl.Popup().setHTML(`<h4>${list.title}</h4><p>exact locationg will be provided after booking </p>`))
    .addTo(map);