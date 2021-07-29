<template>
  <div class="row add-expense-panel">
    <div class="col-8 align-self-center">
      <component :is="categoryComponent" v-model="category" />
    </div>
    <div class="col-4 align-self-center action-controls" align="center">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { expensesModule, ExpensesState, ActionStatus } from "../store";
import { State } from "vuex-class";

@Component
export default class AddExpenseAction extends Vue {
  @State("Expenses") state!: ExpensesState;

  category: { id: string; name: string } = {
    id: '',
    name: ''
  };

  @Prop()
  categoryComponent: string;

  @Prop()
  transactionId!: string;

  @Prop()
  amount: number;

  @Prop()
  description: string;

  @Prop({ default: true})
  isFullTransaction!: boolean;

  mounted() {
    expensesModule.mutate(
      (state: ExpensesState) => (state.addActionStatus = ActionStatus.Loaded)
    );
  }

  cancel() {
    this.$emit("cancel");
  }

  save() {    
    expensesModule.addExpense({
      description: this.description,
      amount: this.amount,
      isFullTransaction: this.isFullTransaction,
      transactionId: this.transactionId,
      categoryId: this.category.id,
    });
  }

  @Watch("state.addActionStatus")
  onStatusChanged(value: ActionStatus) {    
    if (value == ActionStatus.Saved) {
      this.$emit("saved");
    }
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
