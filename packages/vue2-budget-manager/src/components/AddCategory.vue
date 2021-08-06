<template>
  <card header-text="Add Category" :cancel="cancelAdd">
    <ValidationObserver ref="formObserver">
      <form @submit.prevent="onSubmit" autocomplete="off" role="form text-left">
        <div class="mb-3">
          <ValidationProvider
            name="name"
            rules="required"
            mode="passive"
            v-slot="{ errors }"
          >
            <input
              type="text"
              :class="['form-control', { 'is-invalid': errors[0] }]"
              placeholder="Name"
              aria-label="Name"
              ref="NameElement"
              v-model="name"
              :disabled="processing"
            />
            <div v-show="errors[0]" class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </div>
        <div class="mb-3">
          <ValidationProvider
            name="allocationStart"
            rules="required|positive"
            mode="passive"
            v-slot="{ errors }"
          >
            <input
              type="text"
              :class="['form-control', { 'is-invalid': errors[0] }]"
              placeholder="Allocation Start %"
              aria-label="Allocation Start %"
              v-model="allocationStart"
              :disabled="processing"
            />
            <div v-show="errors[0]" class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </div>
        <div class="mb-3">
          <ValidationProvider
            name="allocationEnd"
            type="text"
            rules="required|positive|gt:@allocationStart"
            mode="passive"
            v-slot="{ errors }"
          >
            <input
              type="text"
              :class="['form-control', { 'is-invalid': errors[0] }]"
              placeholder="Allocation End %"
              aria-label="Allocation End %"
              v-model="allocationEnd"
              :disabled="processing"
            />
            <div v-show="errors[0]" class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </div>
        <div class="text-center">
          <button
            type="submit"
            class="btn primary-gradient w-100 my-4 mb-2"
            :disabled="processing"
          >
            <span
              v-if="processing"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Add Category
          </button>
        </div>
      </form>
    </ValidationObserver>
  </card>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { Card } from "@platform8/vue2-common/src/components";
import { State } from "vuex-class";
import { budgetModule, BudgetState, BudgetStatus } from "../store";

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    Card,
  },
})
export default class AddCategory extends Vue {
  @Ref() readonly formObserver!: InstanceType<typeof ValidationObserver>;
  @Ref() readonly NameElement!: HTMLInputElement;

  @State("Budget") state!: BudgetState;

  name = "";
  allocationStart = "";
  allocationEnd = "";

  mounted() {
    this.NameElement?.focus();
  }

  async onSubmit() {

    const isValid = await this.formObserver.validate();
    if (isValid) {
      budgetModule.addCategory({
        name: this.name,
        allocation: {
          start: +this.allocationStart,
          end: +this.allocationEnd
        },
      });
    }
  }

  get processing() {
    return this.state.status === BudgetStatus.Saving;
  }

  cancelAdd() {
    budgetModule.mutate((state: BudgetState) => {
      state.status = BudgetStatus.Loaded;
    });
  }
}
</script>
