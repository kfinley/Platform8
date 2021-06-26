// export interface Configuration {
//   ServiceWorkerPath: string;
//   Host: string;
//   Agent: string;
//   Api: string;
// }

// let environmentVars = undefined;
// let varPrefix = 'VUE';

// try {
//   environmentVars = process.env;
// } catch {
//   if (import.meta !== undefined) {
//     environmentVars = import.meta.env;
//   }
//   varPrefix = 'VITE';
// }

// export const config: Configuration = {
//   ServiceWorkerPath: environmentVars[`${varPrefix}_APP_SERVICE_WORKER_PATH`] as string,
//   Host: environmentVars[`${varPrefix}_APP_HOST`] as string,
//   Agent: environmentVars[`${varPrefix}_APP_AGENT`] as string,
//   Api: environmentVars[`${varPrefix}_APP_API`] as string,
// };
