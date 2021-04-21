console.log("hello from the client side!");
const tourLocations = JSON.parse(
  document.getElementById("map").dataset.locations
);

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ2F1cmltaGFpc2thciIsImEiOiJja25xZ3EweWowZDZpMnZteTUwbHJ5YTF0In0.dLc4_FiWhvy62qXdnBXFRA";
let map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/gaurimhaiskar/cknqh708m005o17l0duoiodv9",
  scrollZoom: false,
  //   center: [-118.113491, 34.111745],
  //   zoom: 4,
});
const bounds = new mapboxgl.LngLatBounds();

tourLocations.forEach((loc) => {
  const el = document.createElement("div");
  el.className = "marker";
  new mapboxgl.Marker({
    element: el,
    anchor: "bottom",
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);
  bounds.extend(loc.coordinates);
});
map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
