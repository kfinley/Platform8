<template>
  <div class="home">
    <p>This is home.</p>
    <button @click.prevent="addError" class="primary-gradient">Add Error!!</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { notificationModule } from "@platform8/vue2-notify/src/store";
@Component
export default class Home extends Vue {
  addError() {
    notificationModule.setError({
      header: "Error!",
      message: "This is an error!"
    });
  }
}
</script>
