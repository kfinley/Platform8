import { AlertType, Notification } from "../types";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { NotificationState } from "./state";

@Module({ namespaced: true, name: "Notification" })
export default class NotificationModule
  extends VuexModule
  implements NotificationState
{
  notifications: Notification[] = [];

  @Action
  setSuccess(params: { header?: string; message: string }) {
    this.context.commit("add", {
      ...params,
      type: AlertType.success,
    });
  }

  @Action
  setError(params: { header?: string; message: string }) {
    this.context.commit("add", {
      ...params,
      type: AlertType.danger,
    });
  }

  @Mutation
  add(params: { header?: string; message: string; type: AlertType }) {
    this.notifications.push({
      header: params.header,
      message: params.message,
      type: params.type,
    });
  }

  @Mutation
  dismiss(index: number) {
    this.notifications.splice(index, 1);
  }
}
