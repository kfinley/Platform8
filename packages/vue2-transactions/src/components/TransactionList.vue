<template>
  <card :header-text="headerText()" :show-close="false">
    <ul id="transaction-list" class="container striped-list p-0">
      <li class="row list-header">
        <div class="col">Date</div>
        <div class="col">Account</div>
        <div class="col text-end px-4">Amount</div>
      </li>
      <li
        class="row"
        v-for="(transaction, index) in transactionsState.transactions"
        :key="index"
      >
        <div class="row p-1">
          <div class="col font-weight-bold">
            {{ new Date(transaction.date).toLocaleDateString("en-US") }}
          </div>
          <div class="col font-italic">{{ transaction.account }}</div>
          <div class="col font-weight-bolder text-lg text-end px-2">
            {{ formatMoney(transaction.amount) }}
          </div>
        </div>
        <div class="row">
          <div class="col-10 px-3 py-2">{{ transaction.description }}</div>
          <div
            class="col-2"
            v-if="
              transactionsState.actionText !== undefined &&
              transaction.hasChanges !== true
            "
          >
            <action :transaction-id="transaction.id" />
          </div>
        </div>
        <div
          v-if="
            actionIsActive &&
            transactionsState.actionTargetId == transaction.id &&
            transaction.extendedDetails &&
            transaction.description !== transaction.extendedDetails
          "
          v-html="display(transaction.extendedDetails)"
        ></div>
        <div
          v-if="
            actionIsActive &&
            transactionsState.actionTargetId == transaction.id &&
            transaction.category
          "
        ><i>Suggested Category</i>: {{ transaction.category }}</div>
        <component
          v-if="
            actionIsActive && transactionsState.actionTargetId == transaction.id
          "
          @cancel="closeActionComponent"
          :is="transactionsState.actionComponent"
          category-component="category"
          :transaction-id="transaction.id"
          :amount="transaction.amount"
          :description="transaction.description"
          :category="transaction.category ? { id: '', name: transaction.category } : undefined"
          @saved="actionComponentSaved(transaction.id)"
        />
      </li>
    </ul>
    <template v-slot:footer>
      <a
        href="#addTransactions"
        class="text-dark font-weight-bold"
        @click.prevent="addTransactions"
        >Add transactions</a
      >
    </template>
  </card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Card } from "@platform8/vue2-common/src/components";
import Action from "./Action.vue";
import { State } from "vuex-class";
import {
  transactionsModule,
  TransactionsState,
  TransactionsStatus,
  ActionStatus,
} from "../store";

@Component({
  components: {
    Card,
    Action,
  },
})
export default class TransactionList extends Vue {
  @State("Transactions") transactionsState!: TransactionsState;

  @Prop()
  type: string;

  addTransactions() {
    transactionsModule.mutate((state: TransactionsState) => {
      state.transactionsStatus = TransactionsStatus.Uploading;
    });
  }

  formatMoney(number: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);
  }

  display(str: string) {
    return str.replace('\n', '<br/>');
  }

  get actionIsActive() {
    return this.transactionsState.actionStatus === ActionStatus.Active;
  }

  closeActionComponent() {
    transactionsModule.mutate((state: TransactionsState) => {
      state.actionStatus = ActionStatus.None;
      state.actionTargetId = undefined;
    });
  }

  actionComponentSaved(transactionId: string) {
    transactionsModule.setHasChanges({
      transactionId,
    });

    this.closeActionComponent();
  }

  headerText() {
    if (this.type) {
      return `${this.type} Transactions`;
    } else {
      return 'Transactions';
    }
  }
}
</script>
