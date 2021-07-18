<template>
  <div class="d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10">
        <div class="col mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center">
              <button
                type="button"
                class="btn-close float-end"
                data-bs-dismiss="alert"
                aria-label="Close"
                v-if="success"
                @click.prevent="cancel"
              ></button>
              <p class="text-xl m-0">Upload Transactions</p>
            </div>
            <div class="card-body">
              <div
                class="text-center"
                v-if="uploading"
              >
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
                  <option v-for="account in accounts" :key="account.id" :value="account.id">
                    {{account.name}}
                  </option>
                </select>
                </p>
                <input
                  type="file"
                  @change.prevent="uploadTransactions($event.target.files)"
                />
              </div>
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
import { transactionsModule, TransactionsState, UploadStatus } from "../store";
import { AccountsState } from "@platform8/vue2-financial-accounts/src/store";

@Component({})
export default class UploadTransactions extends Vue {
  @State("Transactions") transactionsState!: TransactionsState;
  @State("Accounts") accountsState!: AccountsState;

  selectedAccount = "";

  cancel() {
    transactionsModule.mutate(
      (state) => (state.uploadStatus = UploadStatus.None)
    );
  }

  uploadTransactions(files: any) {

    transactionsModule.uploadTransactions({
      accountId: this.selectedAccount,
      file: files[0],
    });
  }
  get accounts() {
    return this.accountsState.accounts;
  }

  get success() {
    return this.transactionsState.uploadStatus === UploadStatus.Success;
  }

  get uploading() {
    return this.transactionsState.uploadStatus === UploadStatus.Uploading;
  }
}
</script>
