<template>
  <div>
    <div class="text-center" v-if="loading">
      <span
        class="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      ></span> Loading transactions...
    </div>
    <transaction-list
      v-else-if="showList"
      type="Unreviewed"
      :accounts="accountsState.accounts" />
    <upload-transactions
      v-else
      :accounts="accountsState.accounts" />
  </div>
</template>

<script lang="ts">
import { AccountsState } from "@platform8/vue2-accounts/src/store";
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";
import { TransactionsState, TransactionsStatus } from "../store";
import TransactionList from "./TransactionList.vue";
import UploadTransactions from "./UploadTransactions.vue";

@Component({
  components: {
    TransactionList,
    UploadTransactions,
  },
})
export default class Transactions extends Vue {
  @State("Transactions") transactionsState!: TransactionsState;
  @State("Accounts") accountsState!: AccountsState;

  get showList() {
    return (
      this.transactionsState.transactions.length > 0 &&
      this.transactionsState.transactionsStatus === TransactionsStatus.Loaded
    );
  }
  get loading() {
    return this.transactionsState.transactionsStatus === TransactionsStatus.Loading;
  }
}
</script>

