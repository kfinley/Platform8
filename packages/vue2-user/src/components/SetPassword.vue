<template>
  <card header-text="Set Password" :show-close="false" style="height: 90vh" max-width="600px" padding="2">
    <ValidationObserver ref="formObserver">
      <form @submit.prevent="onSubmit" autocomplete="off" role="form text-left">
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
  </card>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { userModule, UserState, AuthStatus } from "../store";
import { Card } from "@platform8/vue2-common/src/components";
import { State } from "vuex-class";
import { messages } from "../resources/messages";

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    Card,
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
      password: this.previousPassword,
    });
  }

  async onSubmit() {
    const isValid = await this.formObserver.validate();
    if (isValid) {
      userModule.changePassword({
        username: this.username,
        previousPassword: this.previousPassword,
        proposedPassword: this.password1,
      });
    }
  }

  get processing() {
    return this.state.authStatus === AuthStatus.SettingPassword;
  }

  get messages() {
    return messages;
  }
}
</script>

<style lang="scss">
</style>
