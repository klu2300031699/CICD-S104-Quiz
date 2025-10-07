import serverless from "serverless-http";
import { createServer } from "../../server";

const app = createServer();

// Vercel-compatible handler
export default async function handler(req: any, res: any) {
  const serverlessHandler = serverless(app);
  return serverlessHandler(req, res);
}

// Netlify-compatible handler
export { handler };
