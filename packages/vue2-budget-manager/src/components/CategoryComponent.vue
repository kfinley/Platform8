<template>
  <div>
    <type-ahead
      v-model="typedCategory"
      v-if="showSelector"
      name="category"
      placeholder="Select a category..."
      rules="required"
      :src="typeAheadSrc"
      :getResponse="getResponse"
      queryParamName=":name"
      :highlighting="highlighting"
      :onSelect="onSelect"
      :fetch="fetch"
      @reset="reset"
    />
    <div v-else class="category text-center" @click.prevent="edit">
      {{ categoryLabel }}
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

  _category!: { id: string; name: string };
  previousValue!: { id: string; name: string };

  showSelector = true;

  @VModel({ type: Object })
  category!: { id: string; name: string };

  @Prop({ default: false })
  disabled: boolean;

  typedCategory = this.category ? this.category.name : "";

  @Inject("ApiClient")
  private apiClient!: ApiClient;

  mounted() {
    this.showSelector = this.category ? false : this.disabled ? false : true;
    this._category = this.category;
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

  onSelect(value, vue) {
    vue.query = value.name;
    this.typedCategory = value.name;
    this._category = value; // Set the backing prop
    this.category = value; // Set the prop which will emit the value
    this.showSelector = false;
  }

  get typeAheadSrc() {
    return `${budgetResources.category}?name=:name`;
  }

  get categoryLabel() {
    if (this.category) {
      return this.category.name;
    }

    return "";
  }

  edit() {
    if (!this.disabled) {
      this.previousValue = this.category;
      this.category = undefined;
      this.showSelector = true;
    }
  }

  reset(vue: { query: string }) {
    if (this.previousValue && vue.query !== "") {
      this.typedCategory = this.previousValue.name;
      this.category = this._category;
      this.showSelector = false;
      this.previousValue = undefined;
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
