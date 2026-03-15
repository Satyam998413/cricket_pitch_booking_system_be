import session from 'express-session';
import { promises as fs } from 'fs';
import path from 'path';

// Path to the JSON file where session data will be stored
const sessionFilePath = path.join(process.cwd(), 'sessions.json');
// Function to read session data asynchronously from the JSON file
const readSessionData = async () => {
  try {
    let data = await fs.readFile(sessionFilePath);
    return JSON.parse(data.toString()===""?'{}':data);
  } catch (err) {
    return {};
  }
};

// Function to write session data asynchronously to the JSON file
const writeSessionData = async (data) => {
  await fs.writeFile(sessionFilePath, JSON.stringify(data, null, 2));
};

// Custom session store using async/await
class FileStore extends session.Store {
  constructor() {
    super();
    this.sessions = {};
    this.loadSessions();
  }

  // Load sessions from the JSON file when the store is initialized
  async loadSessions() {
    this.sessions = await readSessionData();
  }

  // Get session data using async/await
  async get(sid) {
    // delete this.sessions[sid];
    await this.loadSessions(); // Ensure latest data is loaded
    return this.sessions[sid] || null;
  }

  async getAll() {
    await this.loadSessions(); // Ensure latest data is loaded
    return this.sessions||null;
  }

  // Set session data using async/await
  async set(sid, sessionData) {
    this.sessions[sid] = sessionData;
    await writeSessionData(this.sessions);
  }

  // Destroy session data using async/await
  async destroy(sid) {
    console.log("fgdgrdg",sid);
    delete this.sessions[sid];
    await writeSessionData(this.sessions);
  }
}

export const refreshTokenStore = new FileStore();
