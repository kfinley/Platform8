import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { TransactionsState, UploadStatus } from './state';
import { notificationModule } from '@platform8/vue2-notify/src/store';
import { container } from 'inversify-props';
import { getModule } from "vuex-module-decorators";
import { UploadFileCommand } from '@/commands';
import { messages } from "../resources/messages";
import { AlertType } from '@platform8/vue2-notify/src/types';
@Module({ namespaced: true, name: 'Transactions' })
export class TransactionsModule extends VuexModule implements TransactionsState {
  transactions = [];
  uploadStatus = UploadStatus.None;

  @Action
  async uploadTransactions(params: { file: File }) {
    
    notificationModule.dismissAll();

    this.context.commit('mutate',
      (state: TransactionsState) => state.uploadStatus = UploadStatus.Uploading);

    try {
      const runParams = {
        file: params.file,
        bucket: 'uploads-transactions'
      };
      
      const cmd = container.get<UploadFileCommand>("UploadFileCommand");
      const response = await cmd.runAsync(runParams);

      if (!response.success) {
        throw new Error(response.error);
      }

      this.context.commit('mutate', 
        (state: TransactionsState) => {
          state.uploadStatus = UploadStatus.Success
        }
      );
      notificationModule.add({
        header: messages.Transactions.Upload.Success.header,
        message: messages.Transactions.Upload.Success.message,
        type: AlertType.success
      });

    } catch (error) {
      this.context.commit('mutate',
        (state: TransactionsState) => state.uploadStatus = UploadStatus.Fialed);

      notificationModule.handleError({ error, rethrow: false });
    }
  }

  @Mutation
  mutate(mutation: (state: TransactionsState) => void) {
    mutation(this);
  }
}

export const getTransactionsModule = (vue: Vue) => getModule(TransactionsModule, vue.$store);
