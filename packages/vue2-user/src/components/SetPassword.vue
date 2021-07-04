<template>
  <div
    class="d-flex align-items-center justify-content-center"
    style="height: 90vh;"
  >
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center pt-4">
              <p>Set Password</p>
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
                      name="password1"
                      rules="required"
                      mode="passive"
                      v-slot="{ errors }"
                    >
                      <input
                        type="password"
                        :class="['form-control', { 'is-invalid': errors[0] }]"
                        placeholder="Password"
                        aria-label="Password"
                        v-model="password1"
                        ref="password1Element"
                        :disabled="processing"
                      />
                      <div v-show="errors[0]" class="invalid-feedback">
                        {{ errors[0] }}
                      </div>
                    </ValidationProvider>
                  </div>
                  <div class="mb-3">
                    <ValidationProvider
                      name="password2"
                      rules="required"
                      mode="passive"
                      v-slot="{ errors }"
                    >
                      <input
                        type="password"
                        :class="['form-control', { 'is-invalid': errors[0] }]"
                        placeholder="Confirm Password"
                        aria-label="Confirm Password"
                        v-model="password2"
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
                      Set Password
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
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { userModule, UserState } from "../store";
import { State } from "vuex-class";
import { AuthStatus } from "../types";
import { messages } from "../resources/messages";

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
})
export default class SetPassword extends Vue {
  @Ref() readonly formObserver!: InstanceType<typeof ValidationObserver>;
  @Ref() readonly password1Element!: HTMLInputElement;

  @Prop()
  regCode!: string;

  username!: string;
  previousPassword!: string;
  password1 = "";
  password2 = "";

  @State("User") state!: UserState;

  mounted() {
    this.password1Element?.focus();
    const [userId, password] = this.regCode.split("|");

    this.username = userId;
    this.previousPassword = password;

    userModule.login({
      email: this.username,
      password: this.previousPassword
    });
  }

  async onSubmit() {
    const isValid = await this.formObserver.validate();
    if (isValid) {
      userModule.changePassword({
        username: this.username,
        previousPassword: this.previousPassword,
        proposedPassword: this.password1
      });
    }
  }

  get processing() {
    return this.state.authStatus === AuthStatus.SettingPassword
  }

  get messages() {
    return messages;
  }
}
</script>

<style lang="scss">
</style>
