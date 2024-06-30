mapboxgl.accessToken = 'pk.eyJ1IjoicXVhbmdjb2kiLCJhIjoiY2x4N2o4bWJjMjRjbjJycTE0YXVycTEzZSJ9.W4CFtKBJpqxdPtBl0hWpIg';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/quangcoi/clx7jj7ik01p901qsgnk177it',
    center: [106.5881782, 10.8847495], // Tọa độ ban đầu [lng, lat]
    zoom: 9 // Mức độ zoom ban đầu
});

const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    profile: 'mapbox/driving',
    alternatives: false,
    interactive: true,
    controls: {
        instructions: true
    }
});

map.addControl(directions, 'top-left');

document.getElementById('findRoute').addEventListener('click', () => {
    const startPlace = document.getElementById('start').value;
    const endPlace = document.getElementById('end').value;

    if (!startPlace || !endPlace) {
        alert('Please enter both start and end place names.');
        return;
    }

    // Geocode start and end places
    Promise.all([
        geocodePlace(startPlace),
        geocodePlace(endPlace)
    ]).then(results => {
        const startCoords = results[0];
        const endCoords = results[1];

        // Set start and end coordinates for directions
        directions.setOrigin([startCoords.lng, startCoords.lat]);
        directions.setDestination([endCoords.lng, endCoords.lat]);
    }).catch(error => {
        console.error('Error geocoding places:', error);
        alert('Error geocoding places. Please try again.');
    });
});

function geocodePlace(placeName) {
    return new Promise((resolve, reject) => {
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(placeName)}.json?access_token=${mapboxgl.accessToken}`)
            .then(response => response.json())
            .then(data => {
                if (data.features.length === 0) {
                    reject(new Error('Place not found'));
                } else {
                    const coordinates = data.features[0].center;
                    resolve({ lng: coordinates[0], lat: coordinates[1] });
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}
