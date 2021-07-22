<template>
  <card header-text="Budget Manager" card-body-classes="px-0" :show-close="false">
    <div class="text-center" v-if="loading">
      <span
        class="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      ></span>
      Loading budget...
    </div>
    <category-list v-if="loaded" />
    <add-category v-if="addingCategory" />
  </card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Card } from "@platform8/vue2-common/src/components";
import CategoryList from "./CategoryList.vue";
import AddCategory from "./AddCategory.vue";
import { State } from "vuex-class";
import { BudgetState, BudgetStatus } from "./../store";

@Component({
  components: {
    Card,
    CategoryList,
    AddCategory,
  },
})
export default class Budget extends Vue {
  @State("Budget") state!: BudgetState;

  get loading() {
    return this.state.status === BudgetStatus.Loading;
  }

  get loaded() {
    return this.state.status === BudgetStatus.Loaded;
  }

  get addingCategory() {
    return this.state.status === BudgetStatus.AddingCategory;
  }
}
</script>
