import { Client, Account, Databases, ID } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);
const databases = new Databases(client);

// Database and collection IDs
export const DATABASE_ID = 'regret-archive';
export const COLLECTIONS = {
  REGRETS: 'regrets',
  COMMENTS: 'comments',
  REACTIONS: 'reactions'
} as const;

export { client, account, databases, ID };
