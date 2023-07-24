const axios = require('axios');
const fs = require('fs').promises;

const baseURL = 'http://localhost:3000/api/storks/create';

async function sendStorkData(stork) {
    try {
        await axios.post(baseURL, stork);
    } catch (error) {
        console.error(`Failed to send stork data: ${error}`);
    }
}

async function loadDataAndSend() {
    try {
        const data = await fs.readFile('filtered_animals.txt', 'utf-8');
        const animalList = JSON.parse(data);

        for (let animal of animalList) {
            let stork = {
                name: animal.name,
                alive: animal.alive,
                atId: animal.atId,
                atContentURL: animal.atContentURL,
                locations: animal.tracks ? animal.tracks.map(track => track.locations).flat() : [],
                lastLocation: {
                    latitude: animal.lastLocation.latitude,
                    longitude: animal.lastLocation.longitude,
                    timestamp: new Date(animal.lastLocation.timestamp)
                },
            };

            if (animal.tracks && animal.tracks[0]) {
                stork.trackType = animal.tracks[0].trackType;
            }

            await sendStorkData(stork);
        }
    } catch (error) {
        console.error(`Failed to load and send data: ${error}`);
    }
}

loadDataAndSend();
