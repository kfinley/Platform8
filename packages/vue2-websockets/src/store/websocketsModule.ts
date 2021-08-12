import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { WebSocketsState, WebSocketsStatus } from './state';

@Module({ namespaced: true, name: 'WebSockets'})
export class WebSocketsModule extends VuexModule implements WebSocketsState {
  status: WebSocketsStatus = WebSocketsStatus.None;

}
