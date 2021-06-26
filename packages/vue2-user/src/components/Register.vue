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
              <p>Register</p>
            </div>
            <div class="card-body text-center" v-if="registered">
              <p>{{ messages.Registration.ThankYouText }}</p>
            </div>
            <div class="card-body" v-if="notRegistered">
              <ValidationObserver ref="loginFormObserver">
                <form
                  @submit.prevent="onSubmit"
                  autocomplete="off"
                  role="form text-left"
                >
                  <div class="mb-3">
                    <ValidationProvider
                      name="firstName"
                      rules="required"
                      mode="passive"
                      v-slot="{ errors }"
                    >
                      <input
                        type="text"
                        :class="['form-control', { 'is-invalid': errors[0] }]"
                        placeholder="First Name"
                        aria-label="First Name"
                        ref="firstNameElement"
                        v-model="firstName"
                        :disabled="registering"
                      />
                      <div v-show="errors[0]" class="invalid-feedback">
                        {{ errors[0] }}
                      </div>
                    </ValidationProvider>
                  </div>
                  <div class="mb-3">
                    <ValidationProvider
                      name="lastName"
                      rules="required"
                      mode="passive"
                      v-slot="{ errors }"
                    >
                      <input
                        type="text"
                        :class="['form-control', { 'is-invalid': errors[0] }]"
                        placeholder="Last Name"
                        aria-label="Last Name"
                        v-model="lastName"
                        :disabled="registering"
                      />
                      <div v-show="errors[0]" class="invalid-feedback">
                        {{ errors[0] }}
                      </div>
                    </ValidationProvider>
                  </div>
                  <div class="mb-3">
                    <ValidationProvider
                      name="email"
                      type="email"
                      rules="required|email"
                      mode="passive"
                      v-slot="{ errors }"
                    >
                      <input
                        type="email"
                        :class="['form-control', { 'is-invalid': errors[0] }]"
                        placeholder="Email"
                        aria-label="Email"
                        v-model="email"
                        :disabled="registering"
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
                      :disabled="registering"
                    >
                      <span
                        v-if="registering"
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sign up
                    </button>
                  </div>
                </form>
              </ValidationObserver>
              <p class="text-sm mt-3 mb-0">
                Already have an account?
                <a href="javascript:;" class="text-dark font-weight-bolder"
                  >Sign in</a
                >
              </p>
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
import { registrationModule, RegistrationState } from "../store";
import { State } from "vuex-class";
import { RegistrationStatus } from "../store/types";
import { messages } from "../resources/messages";

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
})
export default class Register extends Vue {
  @Ref() readonly loginFormObserver!: InstanceType<typeof ValidationObserver>;
  @Ref() readonly firstNameElement!: HTMLInputElement;

  firstName = "";
  lastName = "";
  email = "";

  @State("Registration") state!: RegistrationState;

  mounted() {
    this.firstNameElement?.focus();
  }

  async onSubmit() {

    const isValid = await this.loginFormObserver.validate();
    if (isValid) {
      registrationModule.register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
      });
    }
  }

  get registering() {
    return this.state.status === RegistrationStatus.Registering;
  }

  get registered() {
    return this.state.status === RegistrationStatus.Registered;
  }

  get notRegistered() {
    return this.state.status !== RegistrationStatus.Registered;
  }

  get messages() {
    return messages;
  }
}
</script>

<style lang="scss">
</style>
