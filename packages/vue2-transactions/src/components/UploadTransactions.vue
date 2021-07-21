<template>
  <card
    header-text="Upload Transactions"
    :cancel="cancel"
    :show-close="showClose"
  >
    <div class="text-center" v-if="uploading">
      <p>
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        Uploading...
      </p>
    </div>
    <div v-else>
      <p>
        <select class="dropdown" v-model="selectedAccount">
          <option selected :value="null">Select an account...</option>
          <option
            v-for="account in accounts"
            :key="account.id"
            :value="account.id"
          >
            {{ account.name }}
          </option>
        </select>
      </p>
      <input
        type="file"
        class="btn primary-gradien"
        @change.prevent="uploadTransactions($event.target.files)"
      />
    </div>
  </card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Card } from "@platform8/vue2-common/src/components";
import { State } from "vuex-class";
import {
  transactionsModule,
  TransactionsState,
  TransactionsStatus,
  UploadStatus,
} from "../store";
import { Account } from "@platform8/vue2-financial-accounts/src/models";

@Component({
  components: {
    Card,
  },
})
export default class UploadTransactions extends Vue {
  @State("Transactions") state!: TransactionsState;

  @Prop()
  accounts!: Account[];

  selectedAccount = "";

  cancel() {
    transactionsModule.mutate((state) => {
      state.uploadStatus = UploadStatus.None;
      if (this.accounts.length > 0) {
        state.transactionsStatus = TransactionsStatus.Loaded;
      }
    });
  }

  uploadTransactions(files: any) {
    transactionsModule.uploadTransactions({
      accountId: this.selectedAccount,
      file: files[0],
    });
  }

  get success() {
    return this.state.uploadStatus === UploadStatus.Success;
  }

  get uploading() {
    return this.state.uploadStatus === UploadStatus.Uploading;
  }

  get showClose() {
    return this.success || this.accounts?.length > 0;
  }
}
</script>
