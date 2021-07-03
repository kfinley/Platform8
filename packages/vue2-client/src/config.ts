// HACK: Load config from import.meta (Vite)
// TODO: Fix this...
import { config } from '@platform8/config/src';
config.ClientId = import.meta.env.VITE_APP_CLIENT_ID as string;
config.Api = import.meta.env.VITE_APP_API as string;
config.ServiceWorkerPath = import.meta.env.VITE_APP_SERVICE_WORKER_PATH as string;
config.Host = import.meta.env.VITE_APP_HOST as string;
config.Agent = import.meta.env.VITE_APP_AGENT as string;
