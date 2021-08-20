import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { TransactionsState, TransactionsStatus, UploadStatus, ActionStatus } from './state';
import { notificationModule } from '@platform8/vue2-notify/src/store';
import { container } from 'inversify-props';
import { getModule } from "vuex-module-decorators";
import { LoadTransactionsCommand, UploadFileCommand } from '@/commands';
import { messages } from "../resources/messages";
import { AlertType } from '@platform8/vue2-notify/src/types';
import { Transaction, TransactionStatus } from '../models';
import { AccountsState } from '@platform8/vue2-accounts/src/store';
import { stateGetter } from './helpers';

@Module({ namespaced: true, name: 'Transactions' })
export class TransactionsModule extends VuexModule implements TransactionsState {

  transactions = [];
  transactionsStatus = TransactionsStatus.None;
  uploadStatus = UploadStatus.None;

  actionStatus = ActionStatus.None;
  actionText = undefined;
  actionComponent = undefined;
  actionFunction = '';

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
  async loadTransactions(params: { status: TransactionStatus }) {

    if (!stateGetter<AccountsState>(this, s => s.Accounts).accounts) {
      throw new Error("Must set accounts first");
    }

    this.context.commit('mutate',
      (state: TransactionsState) => state.transactionsStatus = TransactionsStatus.Loading);

    try {
      const runParams = {
        status: params.status
      };

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
              account: stateGetter<AccountsState>(this, s => s.Accounts).accounts.find(a => a.id == t.accountId)?.name
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

  @Action
  setHasChanges(params: { transactionId: string }) {
    this.context.commit('mutate',
      (state: TransactionsState) => {
        let transaction = state.transactions.find(t => t.id == params.transactionId) as Transaction;
        transaction.hasChanges = true;
      });
  }

  @Action
  performAction(transactionId: string) {
    this.context.commit('mutate',
      (state: TransactionsState) => {
        state.actionStatus = ActionStatus.None;
        state.actionTargetId = transactionId;
      });

    this.context.commit('mutate',
      (state: TransactionsState) => {
        state.actionTargetId = transactionId;
        state.actionStatus = ActionStatus.Active;
      });

    this.context.dispatch(this.actionFunction, transactionId, { root: true });
  }

  @Action
  processed(params: { accountId: string, count: number, saved: number }) {
    notificationModule.dismissAll();

    notificationModule.add({
      header: messages.Transactions.Processed.Success.header,
      message: messages.Transactions.Processed.Success.message({ count: params.count, saved: params.saved }),
      type: AlertType.success
    });

    if (params.saved == 0) {
      this.context.commit('mutate',
        (state: TransactionsState) => {
          state.transactionsStatus = TransactionsStatus.Loaded;
        }
      );
    } else {
      this.context.dispatch('loadTransactions', { status: TransactionStatus.Unreviewed });
    }
  }

  @Mutation
  mutate(mutation: (state: TransactionsState) => void) {
    mutation(this);
  }

}

export const getTransactionsModule = (vue: Vue) => getModule(TransactionsModule, vue.$store);
