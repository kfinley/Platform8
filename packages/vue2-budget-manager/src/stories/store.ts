import Vuex from 'vuex';
import { initializeModules } from '@/store';
import { initializeModules as initializeNotifications } from "@platform8/vue2-notify/src/store";
import NotificationModule from '@platform8/vue2-notify/src/store/notificationModule';
import { BudgetModule } from '@/store/budgetModule';

export const store = new Vuex.Store({
  plugins: [
    initializeModules,
    initializeNotifications,
  ],
  modules: {
    "Notification": NotificationModule,
    "Budget": BudgetModule,
  }
});
