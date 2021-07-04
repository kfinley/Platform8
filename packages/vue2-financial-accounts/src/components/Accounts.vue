<template>
  <ul id="account-list" class="container" v-if="state.accounts.length > 0">
    <li class="row">
      <div class="col">Account Name</div>
      <div class="col">Balance</div>
    </li>
    <li class="row" v-for="(account, index) in state.accounts" :key="index">
      <div class="col">{{ account.name }}</div>
      <div class="col">{{ account.balance }}</div>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";
import { AccountsState } from "../store";

@Component({})
export default class Accounts extends Vue {
  @State("Accounts") state!: AccountsState;
}
</script>
