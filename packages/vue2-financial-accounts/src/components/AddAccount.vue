<template>
  <div
    class="d-flex align-items-center justify-content-center"
  >
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
              v-if="state.accounts.length > 0"
              @click.prevent="cancelAdd"
            ></button>
            <p class="text-xl m-0">New Account</p>
            </div>
            <div class="card-body">
               <ValidationObserver ref="formObserver">
                <form
                  @submit.prevent="onSubmit"
                  autocomplete="off"
                  role="form text-left"
                >
                  <div class="mb-3">
                    <ValidationProvider
                      name="name"
                      rules="required"
                      mode="passive"
                      v-slot="{ errors }"
                    >
                      <input
                        type="text"
                        :class="['form-control', { 'is-invalid': errors[0] }]"
                        placeholder="Name"
                        aria-label="Name"
                        ref="NameElement"
                        v-model="name"
                        :disabled="processing"
                      />
                      <div v-show="errors[0]" class="invalid-feedback">
                        {{ errors[0] }}
                      </div>
                    </ValidationProvider>
                  </div>
                  <div class="mb-3">
                    <ValidationProvider
                      name="financialInstitution"
                      rules="required"
                      mode="passive"
                      v-slot="{ errors }"
                    >
                      <input
                        type="text"
                        :class="['form-control', { 'is-invalid': errors[0] }]"
                        placeholder="Financial Institution"
                        aria-label="Finanical Institution"
                        v-model="financialInstitution"
                        :disabled="processing"
                      />
                      <div v-show="errors[0]" class="invalid-feedback">
                        {{ errors[0] }}
                      </div>
                    </ValidationProvider>
                  </div>
                  <div class="mb-3">
                    <ValidationProvider
                      name="accountType"
                      type="text"
                      rules="required"
                      mode="passive"
                      v-slot="{ errors }"
                    >
                      <input
                        type="text"
                        :class="['form-control', { 'is-invalid': errors[0] }]"
                        placeholder="Account Type"
                        aria-label="Account Type"
                        v-model="accountType"
                        :disabled="processing"
                      />
                      <div v-show="errors[0]" class="invalid-feedback">
                        {{ errors[0] }}
                      </div>
                    </ValidationProvider>
                  </div>
                  <div class="mb-3">
                    <ValidationProvider
                      name="startingBalance"
                      type="number"
                      rules="required"
                      mode="passive"
                      v-slot="{ errors }"
                    >
                      <input
                        type="number"
                        step=".01"
                        :class="['form-control', { 'is-invalid': errors[0] }]"
                        placeholder="Starting Balance"
                        aria-label="Starting Balance"
                        v-model="startingBalance"
                        :disabled="processing"
                      />
                      <div v-show="errors[0]" class="invalid-feedback">
                        {{ errors[0] }}
                      </div>
                    </ValidationProvider>
                  </div>
                  <div class="text-center">
                    <button
                      type="submit"
                      class="btn primary-gradient w-100 my-4 mb-2"
                      :disabled="processing"
                    >
                      <span
                        v-if="processing"
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Add Account
                    </button>
                  </div>
                </form>
              </ValidationObserver>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { State } from "vuex-class";
import { accountsModule, AccountsState, AccountsStatus } from "../store";

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
  }
})
export default class AddAccount extends Vue {
  @Ref() readonly formObserver!: InstanceType<typeof ValidationObserver>;
  @Ref() readonly NameElement!: HTMLInputElement;

  @State("Accounts") state!: AccountsState;

  name = "";
  financialInstitution = "";
  accountType = "";
  startingBalance = "";

  mounted() {
    this.NameElement?.focus();
  }

  async onSubmit() {

    const isValid = await this.formObserver.validate();
    if (isValid) {
      accountsModule.addAccount({
        name: this.name,
        financialInstitution: this.financialInstitution,
        accountType: this.accountType,
        startingBalance: +this.startingBalance
      });
    }
  }

  get processing() {
    return this.state.accountsStatus === AccountsStatus.Saving;
  }

  cancelAdd() {
    accountsModule.mutate((state: AccountsState) => {
      state.accountsStatus = AccountsStatus.Loaded
    })
  }

}
</script>

