<template>
  <div class='transaction-action-container'>
    <button class="primary-gradient" @click.prevent="action()">{{ state.actionText }}</button>
  </div>

</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { State } from "vuex-class";
import { transactionsModule, TransactionsState } from "../store";

@Component
export default class Action extends Vue {
  @State("Transactions") state!: TransactionsState;

  @Prop()
  transactionId!: string;

  action() {
    transactionsModule.performAction(this.transactionId);
  }
}

</script>
