import Vuex from 'vuex';
import { initializeModules } from '@/store';
import { initializeModules as initializeNotifications } from "@platform8/vue2-notify/src/store";
import NotificationModule from '@platform8/vue2-notify/src/store/notificationModule';
import { AccountsModule } from '@platform8/vue2-accounts/src/store/accountsModule';
import { TransactionsModule } from "@/store/transactionsModule";
import { initializeModules as initializeAccounts } from "@platform8/vue2-accounts/src/store";

let store = new Vuex.Store({
  plugins: [
    initializeModules,
    initializeNotifications,
    initializeAccounts,
  ],
  modules: {
    "Transactions": TransactionsModule,
    "Notification": NotificationModule,
    "Accounts": AccountsModule,
  }
});
