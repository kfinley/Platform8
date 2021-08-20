import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { WebSocketsState, WebSocketsStatus } from './state';
import { authHelper } from '@platform8/api-client/src/helpers'
import Sockette from 'sockette';
import { Socket } from '../models';

@Module({ namespaced: true, name: 'WebSockets' })
export class WebSocketsModule extends VuexModule implements WebSocketsState {
  status: WebSocketsStatus = WebSocketsStatus.None;

  socket!: Socket;

  @Action
  connect(url: string) {

    const wsUrl = `ws://${url}`;

    console.log(`conncting to socket: ${wsUrl}`);

    this.context.commit('mutate', (state: WebSocketsState) => {
      state.socket = new Sockette(wsUrl, {
        protocols: authHelper.authToken()
      })
    });
  }

  @Mutation
  mutate(mutation: (state: WebSocketsState) => void) {
    mutation(this);
  }
}
