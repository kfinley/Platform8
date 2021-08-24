<template>
  <div>
     <div v-if="Category" class="category text-center" @click.prevent="edit">
      {{ Category.name }}
    </div>
    <type-ahead
      v-model="typedCategory"
      v-else
      placeholder="Select a category..."
      :src="typeAheadSrc"
      :getResponse="getResponse"
      queryParamName=":name"
      :highlighting="highlighting"
      :onSelect="onSelect"
      :fetch="fetch"
      @reset="reset"
    />
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

  // _category!: { id: string; name: string };

  get Category() {
    return this.category;
  }

  // set Category(value) {
  //   this._category = value;
  // }

  @VModel({ type: Object })
  category!: { id: string; name: string };

  @Prop({ default: false })
  disabled: boolean;

  typedCategory = this.category ? this.category.name : "";
  _showSelector!: boolean;

  @Inject("ApiClient")
  private apiClient!: ApiClient;

  mounted() {
    this._showSelector = this.category ? false : true;
    // if (this.category) {
    //   console.log(this.category);
    //   // this.Category = this.category;
    //   this.ShowSelector = false;
    // }
    // this.log();
  }

  // log() {
  //   setTimeout(() => {
  //     console.log(this.Category);
  //     this.log();
  //   }, 1000);
  // }

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
    //this.category = item; // Set the prop which will emit the value
    //this.Category = item; // Set the
    this.$emit('input', value); // sets the category prop by emitting to parent
    this._showSelector = false;
  }

  get typeAheadSrc() {
    return `${budgetResources.category}?name=:name`;
  }

  // get shouldShowSelector() {
  //   console.log(this._category);
  //   console.log(this.disabled)
  //   console.log(this.showSelector);
  //   return !this._category || (!this.disabled && this.showSelector);
  // }

  get shouldShowSelector() {
    if (this.category) {
      return !this.disabled;
    }
    console.log('what', this._showSelector);
    if (!this._showSelector) {
      return true;
    }
    return this._showSelector;
  }

  // get ShowSelector() {
  //   return this._showSelector;
  // }

  // set ShowSelector(value) {
  //   this._showSelector = value;
  //   console.log(this._showSelector);
  // }

  edit() {
    if (!this.disabled) {
      this._showSelector = true;
    }
  }

  reset(vue: { query: string }) {
    if (this.category !== undefined) {
      vue.query = this.category.name;
      this.typedCategory = this.category.name;
      this._showSelector = false;
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
