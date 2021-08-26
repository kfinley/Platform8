<template>
  <div class="row add-expense-panel">
    <div class="col-8 align-self-center">
      <ValidationObserver ref="addExpenseValidationObserver">
        <component
          v-model="backingCategory"
          :is="categoryComponent"
          :disabled="state.addActionStatus == 'Saving'"
          @input="input"
        />
      </ValidationObserver>
    </div>
    <div class="col-4 align-self-center action-controls" align="center">
      <div v-if="state.addActionStatus == 'Loaded'">
        <i
          class="bi bi-x-circle align-self-center clickable"
          @click.prevent="cancel"
          title="Cancel"
        >
        </i>
        <i
          class="bi bi-check-circle align-self-center clickable primary"
          @click.prevent="save"
          title="Save Expense"
        ></i>
      </div>
      <span
        v-else
        class="spinner-border spinner-border-md"
        role="status"
        aria-hidden="true"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop, Watch } from "vue-property-decorator";
import { expensesModule, ExpensesState, ActionStatus } from "../store";
import { State } from "vuex-class";
import { ValidationObserver } from "vee-validate";

@Component({
  components: {
    ValidationObserver,
  },
})
export default class AddExpenseAction extends Vue {
  @Ref() readonly addExpenseValidationObserver!: InstanceType<
    typeof ValidationObserver
  >;

  @State("Expenses") state!: ExpensesState;

  @Prop()
  category!: {
    id: string;
    name: string;
  };

  @Prop()
  categoryComponent: string;

  @Prop()
  transactionId!: string;

  @Prop()
  amount: number;

  @Prop()
  description: string;

  @Prop({ default: true })
  isFullTransaction!: boolean;

  // backing property for category since it's value will change in child component
  backingCategory?: {
    id: string;
    name: string;
  } = null;

  mounted() {
    this.backingCategory = this.category;
    if (!this.category) {
      expensesModule.mutate(
        (state: ExpensesState) => (state.addActionStatus = ActionStatus.Loaded)
      );
    }
  }

  cancel() {
    this.$emit("cancel");
  }

  async save() {
    const isValid = await this.addExpenseValidationObserver.validate();
    if (isValid) {
      expensesModule.addExpense({
        description: this.description,
        amount: this.amount,
        isFullTransaction: this.isFullTransaction,
        transactionId: this.transactionId,
        categorId: this.backingCategory.id,
      });
    }
  }

  @Watch("state.addActionStatus")
  onStatusChanged(value: ActionStatus) {
    if (value == ActionStatus.Saved) {
      this.$emit("saved");
    }
  }

  input(value: { id: string; name: string }) {
    this.backingCategory = value;
    this.$emit("input", value);
  }
}
</script>

<style lang="scss">
.add-expense-panel {
  min-height: 100px;
  margin-right: 0px;
  margin-left: 0px;
}

.action-controls i {
  display: inline-block;
  vertical-align: -0.2em;
  font-size: xx-large;
  margin: 0.1em;
  box-shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  height: 32px;
  &::before {
    vertical-align: 0.12em;
  }
}

.action-controls .primary {
  color: green;
}
</style>
