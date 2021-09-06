<template>
  <card header-text="Accounts" :show-close="false" v-if="state.accounts.length > 0">
    <ul id="account-list" class="container striped-list p-0">
      <li class="row list-header">
        <div class="col">Name</div>
        <div class="col text-end px-4">Balance</div>
      </li>
      <li
        class="row"
        v-for="(account, index) in state.accounts"
        :key="index"
      >
        <div class="col">{{ account.name }}</div>
        <div class="col text-end px-4">
          {{ formatMoney(account.balance) }}
        </div>
      </li>
    </ul>
    <template v-slot:footer>
      <a
      href="#addAccount"
        class="text-dark font-weight-bold"
        @click.prevent="addAccount"
        >Add account</a
      >
    </template>
  </card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Card } from "@platform8/vue2-common/src/components";
import { State } from "vuex-class";
import { accountsModule, AccountsState, AccountsStatus } from "../store";


@Component({
  components: {
    Card,
  }
})
export default class AccountList extends Vue {
  @State("Accounts") state!: AccountsState;

  addAccount() {
    accountsModule.mutate((state: AccountsState) => {
      state.accountsStatus = AccountsStatus.Adding;
    });
  }
  formatMoney(number: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);
  }
}
</script>
