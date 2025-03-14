// This file contains a function availing all
// environment variables in the '.env' file

import { existsSync, readFileSync } from 'fs';

/**
 * Initializes environment variables safely & securely
 */
export default function envLoader() {
  // Find out what npm script is being run
  const stage = process.env.npm_lifecycle_event || 'dev';

  // Ensure the proper '.env' file linked with the stage is used
  const envFile = stage.includes('test') ? '.env.test' : '.env';

  // Load 'env variable' in memory if the '.env' file exists
  if (existsSync(envFile)) {
    // Read the file and store it in a list format
    const fileContent = readFileSync(envFile, 'utf-8').trim().split('\n');

    // Iterate over the file lines
    for (const line of fileContent) {
      const delimPosition = line.indexOf('=');
      const variable = line.substring(0, delimPosition);
      const value = line.substring(delimPosition + 1);

      // Set the 'env variable'
      process.env[variable] = value;
    }
  }
}
