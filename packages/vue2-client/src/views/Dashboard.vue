<template>
  <div class="dashboard">
    <notify />
    <transactions />
    <accounts />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Accounts, Transactions, Notify } from "../components/";

@Component({
  components: {
    Notify,
    Accounts,
    Transactions
  }
})
export default class Secured extends Vue { }
</script>

<style>
.dashboard > * {
  padding: 5px;
}
</style>