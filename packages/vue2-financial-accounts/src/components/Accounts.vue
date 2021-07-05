<template>
  <div>
    <account-list v-if="showList" />
    <add-account v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";
import { AccountsState, AccountsStatus } from "../store";

import AccountList from "./AccountList.vue";
import AddAccount from "./AddAccount.vue";

@Component({
  components: {
    AccountList,
    AddAccount,
  },
})
export default class Accounts extends Vue {
  @State("Accounts") state!: AccountsState;

  get showList() {
    return (
      this.state.accounts.length > 0 &&
      this.state.accountsStatus === AccountsStatus.Loaded
    );
  }
}
</script>

