<template>
  <div class="home">
    <p>This is the secured home.</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Secured extends Vue { }
</script>
