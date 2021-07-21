<template>
  <div>
    <div class="text-center" v-if="loading">
      <span
        class="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      ></span>
      Loading budget...
    </div>
    <div class="text-center" v-else>
      <p>Budget Manager</p>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";
import { BudgetState, BudgetStatus } from "./../store";

@Component({})
export default class Budget extends Vue {
  @State("Budget") state!: BudgetState;

  get loading() {
    return this.state.budgetStatus === BudgetStatus.Loading;
  }
}
</script>