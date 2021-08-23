<template>
  <div>
    <type-ahead
      v-model="typedCategory"
      v-if="shouldShowSelector"
      placeholder="Select a category..."
      :src="typeAheadSrc"
      :getResponse="getResponse"
      queryParamName=":name"
      :highlighting="highlighting"
      :onSelect="onSelect"
      :fetch="fetch"
      @reset="reset"
    />
    <div v-else class="category text-center" @click.prevent="edit">
      {{ _category.name }}
    </div>
  </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Component, Vue, Prop, VModel } from "vue-property-decorator";
import { Inject } from "inversify-props";
import { TypeAhead } from "@platform8/vue2-common/src/components";
import { ApiClient } from "@platform8/api-client/src";
import budgetResources from "../resources/budget";
import { Category } from "../models";

@Component({
  components: {
    TypeAhead,
  },
})
export default class CategoryComponent extends Vue {
  name = "Category";

  _category!: { id: string; name: string};

  @VModel({ type: Object })
  category!: { id: string; name: string };

  @Prop()
  disabled: boolean = false;

  typedCategory = this.category ? this.category.name : "";
  showSelector = true;

  @Inject("ApiClient")
  private apiClient!: ApiClient;

  mounted() {
    if (this.category) {
      this.showSelector = false;
      this._category = this.category;
    }
  }

  async fetch(url) {
    return await this.apiClient.getAsync<Category>(url);
  }

  getResponse(response) {
    return response.data.categories;
  }

  highlighting(item, vue) {
    return item.name.replace(vue.query, `<b>${vue.query}</b>`);
  }

  onSelect(item, vue) {
    vue.query = item.name;
    this.typedCategory = item.name;
    this._category = item;
    this.category = item;
    this.showSelector = false;
  }

  get typeAheadSrc() {
    return `${budgetResources.category}?name=:name`;
  }

  get shouldShowSelector() {

    return !this.disabled && this.showSelector;
  }

  edit() {
    this.showSelector = true;
  }

  reset(vue: { query: string; }) {
    if (this.category !== undefined) {
      vue.query = this.category.name;
      this.typedCategory = this.category.name;
      this.showSelector = false;
    }
  }
}
</script>

<style>
.category {
  border-bottom: 1px;
  border-bottom-style: solid;
  min-width: 90%;
}
</style>
