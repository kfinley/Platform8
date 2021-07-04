import { AlertType, Notification, HandleErrorParams } from "../types";
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
  handleError (params: HandleErrorParams) {
    console.log(params.error);

    this.notifications.push({
      header: "Error",
      message: params.error.message !== undefined ? params.error.message : params.error,
      type: AlertType.danger,
    });

    if (params.rethrow) {
      throw params.error;
    }
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

  @Mutation
  dismissAll() {
    this.notifications = [];
  }
}
