import { AuthTokens } from '../models';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { WebSocketsState, WebSocketsStatus } from './state';
import { authHelper } from '@platform8/api-client/src/helpers'

@Module({ namespaced: true, name: 'WebSockets'})
export class WebSocketsModule extends VuexModule implements WebSocketsState {
  status: WebSocketsStatus = WebSocketsStatus.None;

  @Action
  connect() {
    console.log(`conncting to socket with: ${authHelper.username()}:${authHelper.authToken()}`);
  }
}
