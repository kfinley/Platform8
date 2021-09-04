<template>
  <card header-text="Expenses" card-body-classes="px-0" :cancel="cancel">
    <div class="text-center" v-if="loading">
      <span
        class="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      ></span>
      Loading expenses...
    </div>
    <expense-list v-if="loaded" />
    <!-- <add-category v-if="addingCategory" /> -->
  </card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Card } from "@platform8/vue2-common/src/components";
import ExpensesList from "./ExpensesList.vue";
import { State } from "vuex-class";
import { expensesModule, ExpensesState, ExpensesStatus } from "./../store";

@Component({
  components: {
    Card,
    ExpensesList
  },
})
export default class Budget extends Vue {
  @State("Expenses") state!: ExpensesState;

  get loading() {
    return this.state.status === ExpensesStatus.Loading;
  }

  get loaded() {
    return this.state.status === ExpensesStatus.Loaded || this.state.status === ExpensesStatus.None;
  }

  cancel() {
    expensesModule.close(this.$router);
  }
}
</script>
