const axios = require('axios');
const fs = require('fs').promises;
const moment = require('moment-timezone');

const base = "https://animal" + "tracker.app/api"

async function getAnimalsData() {
    const url = `${base}/v1/animals`;

    try {
        const response = await axios.get(url);
        return response.data.data;
    } catch (error) {
        console.log(`Error occurred: ${error}`);
        return null;
    }
}

function convertToEST(timestampStr) {
    const timestamp = moment(timestampStr);
    const timestampEst = timestamp.tz("US/Eastern");
    return timestampEst.format("YYYY-MM-DD HH:mm:ss z");
}

async function getTracksForAnimal(animalId) {
    const url = `${base}/v2/animals/${animalId}/tracks`;

    try {
        const response = await axios.get(url);
        return response.data.data.map(track => ({
            trackType: track.attributes.track_type,
            locations: track.attributes.locations.map(location => ({
                latitude: location.latitude,
                longitude: location.longitude,
                timestamp: convertToEST(location.timestamp)
            }))
        }));
    } catch (error) {
        console.log(`Error occurred while fetching tracks for animal ${animalId}: ${error}`);
        return null;
    }
}

async function filterAndCreateAnimalList(animalsData, targetSpecieId) {
    let animalList = [];
    let count = 0;

    for (let animal of animalsData) {
        const specieDataId = animal.relationships.specie.data.id;
        const attributes = animal.attributes;
        const lastLocation = attributes.last_location;

        if (
            lastLocation.longitude !== null &&
            lastLocation.latitude !== null &&
            specieDataId === targetSpecieId
        ) {
            count++;
            const tracks = await getTracksForAnimal(animal.id);

            let animalObj = {
                atId: animal.id,
                name: attributes.name,
                alive: attributes.alive,
                lastLocation: {
                    latitude: lastLocation.latitude,
                    longitude: lastLocation.longitude,
                    timestamp: convertToEST(lastLocation.timestamp),
                },
                tracks: tracks,
                atContentURL: attributes.content_url,
            };

            animalList.push(animalObj);
        }
    }

    console.log(`Total number of animals meeting the criteria: ${count}`);
    return animalList;
}

async function writeToFile(animalList, filePath) {
    const fileContent = JSON.stringify(animalList, null, 2);
    await fs.writeFile(filePath, fileContent);
}

(async function() {
    const targetSpecieId = "b3eeb878-4aa2-4a2e-aaa7-c4929a6d9266";
    const filePath = "filtered_animals.txt";
    const animalsData = await getAnimalsData();

    if (animalsData) {
        const animalList = await filterAndCreateAnimalList(animalsData, targetSpecieId);
        await writeToFile(animalList, filePath);
        console.log(`Filtered animal data with raw tracks written to ${filePath}`);
    } else {
        console.log("Failed to retrieve animal data.");
    }
})();