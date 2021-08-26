<template>
  <div class="input-group" :class="[classes]" v-click-outside="reset">
    <valid-input
      v-bind="$attrs"
      ref="input"
      :type="type"
      css="form-control type-ahead-select taller"
      :placeholder="placeholder"
      :name="name"
      :rules="rules"
      autocomplete="off"
      focus="true"
      v-model="query"
      @down="down"
      @up="up"
      @select="select"
      @reset="reset"
      @input="update($event)"
    />
    <div class="typeahead-dropdown-container" v-if="showResult">
      <ul
        v-show="hasItems"
        class="dropdown-menu-list dropdown-menu"
        role="menu"
        aria-labelledby="dropdownMenu"
      >
        <li
          v-for="(item, index) in items"
          :class="{ active: activeClass(index) }"
          :key="'li' + index"
          @click.prevent="select"
          @mousemove="setActive(index)"
        >
          <a v-html="highlighting(item, vue)"></a>
        </li>
      </ul>
      <ul
        v-if="showSearchingFlag"
        v-show="!hasItems"
        class="dropdown-menu dropdown-menu-list"
        role="menu"
        aria-labelledby="dropdownMenu"
      >
        <li class="active" v-if="!loading">
          <a>
            <span v-html="noResultText"></span>
          </a>
        </li>
        <li class="active" v-else>
          <a>
            <span v-html="searchingText"></span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
// Adapted from: https://github.com/mizuka-wu/vue2-typeahead
import { Component, Vue, Ref, Prop, Watch } from "vue-property-decorator";
import vClickOutside from "v-click-outside";
import ValidInput from "./ValidInput.vue";

function escapeRegExp(str) {
  // eslint-disable-next-line no-useless-escape
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
@Component({
  directives: {
    clickOutside: vClickOutside.directive,
  },
  components: {
    ValidInput,
  },
})
export default class TypeAhead extends Vue {
  items = [];
  query = "";
  current = -1;
  loading = false;
  lastTime = 0;
  data = [];
  showResult = false;

  @Ref() readonly input!: HTMLInputElement;

  @Prop({ default: false })
  selectFirst!: boolean;

  @Prop({ default: ":keyword" })
  queryParamName!: string;

  @Prop({ default: 10 })
  limit!: number;

  @Prop({ default: 3 })
  minChars!: number;

  @Prop()
  src!: string;

  @Prop({ default: 500 })
  delayTime!: number;

  @Prop()
  placeholder!: string;

  @Prop({ default: true })
  showSearchingFlag!: boolean;

  @Prop({ default: "No result" })
  noResultText!: string;

  @Prop({ default: "Searching..." })
  searchingText!: string;

  @Prop()
  classes!: string;

  //TODO: @VModel
  @Prop({ default: "" })
  value!: string;

  @Prop({ default: TypeAhead.onSelectFunc })
  onSelect: Function;

  @Prop({ default: TypeAhead.highlightingFunc })
  highlighting: Function;

  @Prop()
  render!: Function;

  @Prop()
  getResponse!: Function;

  @Prop({ default: TypeAhead.fetchFunc })
  fetch: Function;

  @Prop()
  objectArray!: Array<object>;

  @Prop()
  rules!: string;

  @Prop({ default: "text" })
  type!: string;

  @Prop()
  name: string;

  mounted() {
    this.query = this.value;

    if (this.objectArray) {
      this.objectArray.sort();
    }
  }

  @Watch("value")
  onValueChanged(value) {
    this.query = this.query !== value ? value : this.query;
  }

  @Watch("query")
  onQueryChanged(value) {
    this.$emit("input", value);
  }

  get vue() {
    return this;
  }

  get hasItems() {
    return this.items.length > 0;
  }

  get isEmpty() {
    return this.query === "";
  }

  static fetchFunc(url) {
    console.log(`TypeAhead: Fetch called for ${url}`);
  }

  renderFunc(items) {
    return items;
  }

  static highlightingFunc(item, instance) {
    var re = new RegExp(escapeRegExp(instance.query), "ig");
    var matches = item.match(re);

    matches &&
      matches.forEach((match) => {
        item = item.replace(match, `<b>${match}</b>`);
      });

    return item;
  }

  static onSelectFunc(item, vue) {
    vue.query = item;
  }

  select() {
    if (this.current !== -1) {
      const item = this.items[this.current];
      this.onSelect(item, this);
    }
    this.reset(false);
  }

  objectUpdate() {
    var filtered = this.objectArray.filter((entity) =>
      (entity as any).toLowerCase().includes(this.query.toLowerCase())
    );
    this.data = this.limit ? filtered.slice(0, this.limit) : filtered;
    this.items = this.render(
      this.limit ? this.data.slice(0, this.limit) : this.data,
      this
    );

    this.current = -1;

    if (this.selectFirst) {
      this.down();
    }
  }

  update(event) {
    const eventTimeStamp = event.timeStamp ?? Date.now();
    this.lastTime = eventTimeStamp;
    if (!this.query) {
      return this.reset();
    }

    if (this.minChars && this.query.length < this.minChars) {
      return;
    }

    setTimeout(() => {
      if (this.lastTime - eventTimeStamp === 0) {
        if (this.objectArray) {
          return this.objectUpdate();
        }

        this.loading = true;
        this.showResult = true;

        const re = new RegExp(this.queryParamName, "g");

        this.fetch(this.src.replace(re, encodeURIComponent(this.query))).then(
          (response) => {
            if (this.query) {
              let data = this.getResponse(response);
              this.data = this.limit ? data.slice(0, this.limit) : data;
              const render = this.render ? this.render : this.renderFunc;
              this.items = render(
                this.limit ? data.slice(0, this.limit) : data,
                this
              );

              this.current = -1;
              this.loading = false;

              if (this.selectFirst) {
                this.down();
              }
            }
          }
        );
      }
    }, this.delayTime);
  }

  setActive(index) {
    this.current = index;
  }

  activeClass(index) {
    return this.current === index;
  }

  up() {
    if (this.current > 0) {
      this.current--;
    } else if (this.current === -1) {
      this.current = this.items.length - 1;
    } else {
      this.current = -1;
    }
    if (!this.selectFirst && this.current !== -1) {
      this.setActive(this.current);
    }
  }

  down() {
    if (this.current < this.items.length - 1) {
      this.current++;
    } else {
      this.current = -1;
    }
    if (!this.selectFirst && this.current !== -1) {
      this.setActive(this.current);
    }
  }

  reset(emit: boolean = true) {
    this.items = [];
    this.loading = false;
    this.showResult = false;
    if (emit) {
      this.$emit("reset", this);
    }
  }
}
</script>

<style scoped>
.dropdown-menu-list {
  display: list-item;
  width: 100%;
}

.typeahead-dropdown-container {
  position: relative;
  width: 100%;
}

div.input-group input.form-control.type-ahead-select {
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}

ul li {
  padding: 5px 0.5rem;
  margin: 0px 0.25rem;
  cursor: pointer;
  border-radius: 4px;
  cursor: pointer;
}

ul li.active {
  background-color: #f1f2f3;
}
</style>
