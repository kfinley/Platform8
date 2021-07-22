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
      <card header-text="Budget Manager" :show-close="false">
        <category-list />
      </card>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Card } from "@platform8/vue2-common/src/components";
import CategoryList from "./CategoryList.vue";
import { State } from "vuex-class";
import { BudgetState, BudgetStatus } from "./../store";

@Component({
  components: {
    Card,
    CategoryList,
  }
})
export default class Budget extends Vue {
  @State("Budget") state!: BudgetState;

  get loading() {
    return this.state.status === BudgetStatus.Loading;
  }
}
</script>
