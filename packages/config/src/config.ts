export interface Configuration {
  ServiceWorkerPath: string;
  Host: string;
  Agent: string;
  Api: string;
}

export const config: Configuration = {
  ServiceWorkerPath: process.env.VITE_APP_SERVICE_WORKER_PATH as string,
  Host: process.env.VITE_APP_HOST as string,
  Agent: process.env.VITE_APP_AGENT as string,
  Api: process.env.VITE_APP_API as string,
};
