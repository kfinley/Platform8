<template>
  <card header-text="Expenses" :show-close="false">
    <ul id="expense-list" class="container striped-list p-0">
      <li class="row list-header">
        <div class="col">Date</div>
        <div class="col">Description</div>
        <div class="col">Category</div>
        <div class="col">Account</div>
        <div class="col">Amount</div>
      </li>
      <li
        class="row"
        v-for="(expense, index) in expensesState.expenses"
        :key="index"
      >
        <div class="col font-weight-bold">
          {{ new Date(expense.date).toLocaleDateString("en-US") }}
        </div>
        <div class="col">{{ expense.description }}</div>
        <div class="col font-italic">{{ expense.category }}</div>
        <div class="col">{{ expense.transaction.account }}</div>
        <div class="col font-weight-bolder text-lg">
          {{ formatMoney(expense.amount) }}
        </div>
      </li>
    </ul>
  </card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";
import { Card } from "@platform8/vue2-common/src/components";
import { ExpensesState } from "../store";

@Component({
  components: {
    Card,
  },
})
export default class ExpensesList extends Vue {
  @State("Expenses") expensesState!: ExpensesState;

  formatMoney(number: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);
  }
}
</script>
