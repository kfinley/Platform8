<template>
  <div class="notify-overlay">
    <div classs="container p-5">
      <div class="row no-gutters">
        <div class="col-lg-6 col-md-12 m-auto">
          <div
            v-for="(notification, index) in state.notifications"
            role="alert"
            :key="index"
            :class="[
              'alert',
              alertType(notification),
              'alert-dismissible',
              'fade',
              'show',
            ]"
          >
            <h4
              class="alert-heading"
              v-if="notification.header"
              v-html="notification.header"
            ></h4>
            <p v-html="notification.message"></p>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              @click.prevent="dismiss(index)"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";
import { Notification } from "../types";
import { notificationModule, NotificationState } from "../store";

@Component
export default class Notify extends Vue {
  @State("Notification") state!: NotificationState;

  alertType(notification: Notification): string {
    return `alert-${notification.type}`;
  }

  dismiss = (index: number): void => notificationModule.dismiss(index);
}
</script>

<style scoped>
.notify-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 1em;
}
</style>
