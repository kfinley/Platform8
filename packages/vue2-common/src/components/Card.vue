<template>
  <div class="d-flex align-items-center justify-content-center">
    <div :class="`container p-${padding}`" :style="style">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10">
        <div class="col">
          <div class="card z-index-0">
            <div class="card-header text-center">
              <button
                type="button"
                class="btn-close mt-2 me-2"
                style="position: absolute; top: 0; right: 0"
                data-bs-dismiss="alert"
                aria-label="Close"
                v-if="showClose"
                @click.prevent="cancel"
              ></button>
              <p class="text-xl m-0">
                {{ headerText }}
              </p>
            </div>
            <div :class="`card-body ${cardBodyClasses}`">
              <slot></slot>
            </div>
            <div  v-if="!!this.$slots.footer" class="card-footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class Card extends Vue {

  @Prop()
  cancel!: () => void;

  @Prop()
  headerText!: string;

  @Prop({ default: true})
  showClose!: boolean;

  @Prop({ default: ''})
  cardBodyClasses!: string;

  @Prop()
  maxWidth!: string;

  @Prop({ default: '1'})
  padding!: string;

  get style() {
    return this.maxWidth ? `max-width: ${this.maxWidth};` : '';
  }
}
</script>
