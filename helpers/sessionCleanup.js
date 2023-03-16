import { Session } from "../models/session.js";

// Schedule a task to run every day at 3am to remove expired sessions
export default async function SessionCleanup() {
  try {
    const result = await Session.deleteMany({
      $and: [
        { "accessToken.expires": { $lt: new Date() } },
        { "refreshToken.expires": { $lt: new Date() } },
      ],
    });
    console.log(`${result.deletedCount} expired sessions removed`);
  } catch (error) {
    console.error(`Error removing expired sessions: ${error}`);
  }
}
