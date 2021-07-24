import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { TransactionsState, TransactionsStatus, UploadStatus } from './state';
import { notificationModule } from '@platform8/vue2-notify/src/store';
import { container } from 'inversify-props';
import { getModule } from "vuex-module-decorators";
import { LoadTransactionsCommand, UploadFileCommand } from '@/commands';
import { messages } from "../resources/messages";
import { AlertType } from '@platform8/vue2-notify/src/types';
import { Account } from '@platform8/vue2-accounts/src/models';

@Module({ namespaced: true, name: 'Transactions' })
export class TransactionsModule extends VuexModule implements TransactionsState {
  transactions = [];
  transactionsStatus = TransactionsStatus.None;
  uploadStatus = UploadStatus.None;

  @Action
  async uploadTransactions(params: { file: File, accountId: string }) {

    notificationModule.dismissAll();

    this.context.commit('mutate',
      (state: TransactionsState) => state.uploadStatus = UploadStatus.Uploading);

    try {
      const runParams = {
        accountId: params.accountId,
        file: params.file,
        bucket: 'Transactions-uploads' //TODO: config this...
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
        (state: TransactionsState) => state.uploadStatus = UploadStatus.Failed);

      notificationModule.handleError({ error, rethrow: false });
    }
  }

  @Action
  async loadTransactions(params: { accounts: Account[] }) {
    this.context.commit('mutate',
      (state: TransactionsState) => state.transactionsStatus = TransactionsStatus.Loading);

    try {
      const runParams = {};

      const cmd = container.get<LoadTransactionsCommand>("LoadTransactionsCommand");
      const response = await cmd.runAsync(runParams);

      if (!response.transactions) {
        throw new Error(response.error);
      }
      this.context.commit('mutate',
        (state: TransactionsState) => {
          state.transactions = response.transactions.map(t => {
            return {
              ...t,
              account: params.accounts.find(a => a.id == t.accountId)?.name
            }
          });
          state.transactionsStatus = TransactionsStatus.Loaded;
        }
      );

    } catch (error) {
      this.context.commit('mutate',
        (state: TransactionsState) => state.transactionsStatus = TransactionsStatus.Failed);

      notificationModule.handleError({ error, rethrow: false });
    }
  }

  @Mutation
  mutate(mutation: (state: TransactionsState) => void) {
    mutation(this);
  }
}

export const getTransactionsModule = (vue: Vue) => getModule(TransactionsModule, vue.$store);
