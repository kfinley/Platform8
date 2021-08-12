import { Store } from "vuex";
import { WebSocketsModule }  from "./websocketsModule";
import { getModule } from "vuex-module-decorators";

let webSocketsModule: WebSocketsModule;

export function initializeModules(store: Store<any>): void {
  webSocketsModule = getModule(WebSocketsModule, store);
}

export { webSocketsModule };
