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
                  Uploaded...
                </p>
              </div>
              <input
                type="file"
                v-else
                @change.prevent="uploadTransactions($event.target.files)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import { State } from "vuex-class";
import { transactionsModule, TransactionsState, UploadStatus } from "../store";

@Component({})
export default class UploadTransactions extends Vue {
  @State("Transactions") state!: TransactionsState;
  
  cancel() {
    transactionsModule.mutate(
      (state) => (state.uploadStatus = UploadStatus.None)
    );
  }

  uploadTransactions(files: FileList) {
    transactionsModule.uploadTransactions({
      file: files[0],
    });
  }

  get success() {
    return this.state.uploadStatus === UploadStatus.Success;
  }

  get uploading() {
    return this.state.uploadStatus === UploadStatus.Uploading;
  }
}
</script>
