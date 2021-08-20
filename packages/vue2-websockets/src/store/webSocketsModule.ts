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
  handleSocketMessage(ev: MessageEvent) {

    const { subject, message } = JSON.parse(ev.data);
    const [module, action] = subject.split('-');

    const toCamelCase = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

    this.context.dispatch(`${module}/${toCamelCase(action)}`, message, { root: true });
  };

  @Action
  handleSocketClose(ev: CloseEvent) {
    console.log('handleSocketClose', ev);
  }

  @Action
  connect(url: string) {

    const wsUrl = `ws://${url}`;

    console.log(`conncting to socket: ${wsUrl}`);

    this.context.commit('mutate', (state: WebSocketsState) => {
      state.socket = new Sockette(wsUrl, {
        protocols: authHelper.authToken(),
        onmessage: this.handleSocketMessage,
        // onreconnect?: (this: Sockette, ev: Event | CloseEvent) => any;
        // onmaximum?: (this: Sockette, ev: CloseEvent) => any;
        onclose: this.handleSocketClose,
        //  onerror?: (this: Sockette, ev: Event) => any;
      })
    });
  }

  @Mutation
  mutate(mutation: (state: WebSocketsState) => void) {
    mutation(this);
  }
}
