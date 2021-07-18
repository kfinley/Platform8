export interface Configuration {
  ClientId: string;
  PoolId: string;
  ServiceWorkerPath: string;
  Host: string;
  Agent: string;
  Api: string;
  ApiPorts: string | undefined;
}

export const config: Configuration = {
  ClientId: process.env.VITE_APP_CLIENT_ID as string,
  PoolId: process.env.VITE_APP_POOL_ID as string,
  ServiceWorkerPath: process.env.VITE_APP_SERVICE_WORKER_PATH as string,
  Host: process.env.VITE_APP_HOST as string,
  Agent: process.env.VITE_APP_AGENT as string,
  Api: process.env.VITE_APP_API as string,
  ApiPorts: process.env.VITE_APP_API_PORTS
};
