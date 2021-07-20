<template>
  <div class="container">
    <div class="row mt-lg-n10 mt-md-n11 mt-n10">
      <div class="col mx-auto">
        <div class="card z-index-0">
          <div class="card-header text-center">
            <p class="text-xl m-0">Transactions</p>
          </div>
          <div class="card-body p-0">
            <ul id="transaction-list" class="container striped-list">
              <li class="row list-header">
                <div class="col">Date</div>
                <div class="col">Account</div>
                <div class="col">Description</div>
                <div class="col text-center">Amount</div>
              </li>
              <li
                class="row"
                v-for="(transaction, index) in transactionsState.transactions"
                :key="index"
              >
                <div class="col">{{ transaction.date.toLocaleDateString('en-US') }}</div>
                <div class="col">{{ transaction.account }}</div>
                <div class="col">{{ transaction.description }}</div>
                <div class="col text-end px-5">
                  {{ formatMoney(transaction.amount) }}
                </div>
              </li>
            </ul>
          </div>
          <div class="card-footer">
            <a
              href="#addTransactions"
              class="text-dark font-weight-bold"
              @click.prevent="addTransactions"
              >Add transactions</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { State } from "vuex-class";
import { transactionsModule, TransactionsState, TransactionsStatus } from "../store";
import { Account } from '@platform8/vue2-financial-accounts/src/models';

@Component({})
export default class TransactionList extends Vue {
  @State("Transactions") transactionsState!: TransactionsState;

  @Prop()
  accounts!: Account[];
  
  mounted() {
    transactionsModule.loadTransactions({
      accounts: this.accounts
    });
  }

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
}
</script>