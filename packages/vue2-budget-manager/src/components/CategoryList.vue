<template>
  <card header-text="Categories" :show-close="false" v-if="hasCategories">
    <ul id="category-list" class="container row tiled-list">
      <li
        class="col-lg-4 col-md-6 row-sm"
        v-for="(category, index) in state.budget.categories"
        :key="index"
      >
        <div class="row">
          <div class="col-8 font-weight-bold">
            {{ category.name }}
          </div>
          <div class="col-4">
            <span class="float-end font-italic">
              {{ category.allocation.start }}-{{ category.allocation.end }}%
            </span>
          </div>
        </div>
        <div class="row">
          <ul
            :id="`classification-list-${category.id}`"
            class="container striped-list-no-header p-0"
          >
            <li
              class="row classification-item"
              v-for="(classification, index) in category.classifications"
              :key="index"
            >
              <div class="col">{{ classification.name }}</div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <template v-slot:footer>
      <a
        href="#addCategory"
        class="text-dark font-weight-bold"
        @click.prevent="addCategory"
        >Add category</a
      >
    </template>
  </card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Card } from "@platform8/vue2-common/src/components";
import { State } from "vuex-class";
import { budgetModule, BudgetState, BudgetStatus } from "../store";

@Component({
  components: {
    Card,
  },
})
export default class CategoryList extends Vue {
  @State("Budget") state!: BudgetState;

  addCategory() {
    budgetModule.mutate((state: BudgetState) => {
      state.status = BudgetStatus.AddingCategory;
    });
  }

  get hasCategories() {
    return this.state.budget?.categories?.length > 0;
  }
}
</script>

<style lang="scss">
#category-list > li > div:first-child {
  background: $light;
  border-bottom: 1px solid $header-border !important;
}

.classification-item {
  margin: 0;
}

// Small devices (landscape phones, 576px and up)
@media (max-width: 767.98px) { 
 #category-list > li {
    margin: 0px;
    padding: 10px;
  }
 }

// Medium devices (tablets, 768px and up)
@media (min-width: 768px) { 
  #category-list > li {
    margin-bottom: 5px;
  }

  #category-list > li > div {
    margin: 2px;
  }
 }

// Large devices (desktops, 992px and up)
@media (min-width: 992px) { 
  #category-list > li {
    margin-bottom: 10px;
  }
 }

</style>
