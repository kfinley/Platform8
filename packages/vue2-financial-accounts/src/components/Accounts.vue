<template>
  <div
    class="d-flex align-items-center justify-content-center awesome-style"
    v-if="state.accounts.length > 0"
  >
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10">
        <div class="col mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center">
              <p class="text-xl m-0">Accounts</p>
            </div>
            <div class="card-body p-0">
              <ul
                id="account-list"
                class="container striped-list"
              >
                <li class="row list-header">
                  <div class="col">Name</div>
                  <div class="col text-center">Balance</div>
                </li>
                <li
                  class="row"
                  v-for="(account, index) in state.accounts"
                  :key="index"
                >
                  <div class="col">{{ account.name }}</div>
                  <div class="col text-end px-5">${{ account.balance }}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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

