<template>
  <div>
    <notify />
    <accounts />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Accounts, Notify } from "../components/";

@Component({
  components: {
    Notify,
    Accounts,
  }
})
export default class Secured extends Vue { }
</script>
