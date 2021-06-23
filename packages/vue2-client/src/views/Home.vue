<template>
  <div class="home">
    <p>This is home.</p>
    <button class="btn-primary" @click.prevent="addError">Add Error</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { notificationModule } from "../store";

@Component
export default class Home extends Vue {
  addError(): void {
    notificationModule.setError({
      header: "Error!!",
      message: "This is an error...",
    });
  }
}
</script>
