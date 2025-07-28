import * as fs from 'fs/promises';

interface ApiConfig {
    ServiceEndpoint: string;
    EventsTableName: string;
}

const configFileName = 'sls-output.json';

export const setup = async () => {
    try {
        const config = await fs.readFile(configFileName, 'utf-8');
        const apiConfig: ApiConfig = JSON.parse(config);

        process.env.API_BASE_URL = apiConfig.ServiceEndpoint;
        process.env.EVENTS_TABLE_NAME = apiConfig.EventsTableName;
        console.log(`Successfully loaded config from ${configFileName} file!`);
    } catch (err) {
        throw new Error(`Failed to read or parse config file ${configFileName}`, err);
    }
};

// these will be set in a different global scope during setup function above, that's why we don't use local variables
export const API_BASE_URL = process.env.API_BASE_URL as string;
export const EVENTS_TABLE_NAME = process.env.EVENTS_TABLE_NAME as string;
