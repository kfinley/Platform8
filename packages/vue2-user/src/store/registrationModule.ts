import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { container } from 'inversify-props';
import { RegistrationState, RegistrationStatus } from './state';
import {RegisterRequest } from './../types';
import { RegisterCommand } from '../commands';
import { notificationModule } from '@platform8/vue2-notify/src/store';
import { AlertType } from "@platform8/vue2-notify/src/types";
import { messages } from "../resources/messages";

@Module({ namespaced: true, name: 'Registration' })
export class RegistrationModule extends VuexModule implements RegistrationState {
  status = RegistrationStatus.Unknown;
  email: string | undefined;
  error: string | undefined;

  @Action
  async register(params: RegisterRequest) {
    notificationModule.dismissAll();

    this.context.commit('request', { email: params.email });

    try {
      const cmd = container.get<RegisterCommand>("RegisterCommand");
      const response = await cmd.runAsync(params);

      if (!response.success) {
        this.context.commit('fail', response.error);
      }

      this.context.commit('registered');
      notificationModule.add({
        header: messages.Registration.Registered.header,
        message: messages.Registration.Registered.message,
        type: AlertType.success
      });

    } catch (error) {
      this.context.commit('fail', error);
      notificationModule.handleError({ error, rethrow: false });
    }
  }

  @Mutation
  request(params: { email: string }) {
    this.error = undefined;
    this.email = params.email;
    this.status = RegistrationStatus.Registering;
  }

  @Mutation
  reset() {
    this.error = undefined;
    this.email = undefined;
    this.status = RegistrationStatus.Unknown;
    notificationModule.dismissAll();
  }

  @Mutation
  fail(error: any) {
    this.error = error;
    this.status = RegistrationStatus.Failed;
  }

  @Mutation
  success() {
    this.error = undefined;
    this.email = undefined;
    this.status = RegistrationStatus.Success;
  }

  @Mutation
  registered() {
    this.error = undefined;
    this.email = undefined;
    this.status = RegistrationStatus.Registered;
  }

  @Mutation
  mutate(mutation: (state: RegistrationState) => void) {
    mutation(this);
  }
}
