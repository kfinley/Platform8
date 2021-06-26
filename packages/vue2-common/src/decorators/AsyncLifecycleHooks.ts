//Source: https://github.com/vuejs/vue/issues/7209#issuecomment-824615940
import Vue, { ComponentOptions } from "vue";
// import { Vue } from "vue-property-decorator";

export const AsyncLifecycleHooks = () => (target: any): any => {
    const oldCreated = target.prototype.created || function () {};
    target.prototype.created = function () {
        oldCreated.call(this).then(() => {
            (this as any).createdResolver();
        });
    };

    const oldBeforeMount = target.prototype.beforeMount || function () {};
    target.prototype.beforeMount = function () {
        ((this as any).createdPromise as Promise<void>).then(() => {
            oldBeforeMount.call(this).then(() => {
                (this as any).beforeMountResolver();
            });
        });
    };

    const oldMounted = target.prototype.mounted || function () {};
    target.prototype.mounted = function () {
        ((this as any).beforeMountPromise as Promise<void>).then(() => {
            oldMounted.call(this);
        });
    };

    const newTarget = class extends target {
        private createdPromise: Promise<void>;
        private createdResolver: any;

        private beforeMountPromise: Promise<void>;
        private beforeMountResolver: any;

        constructor(...args: any[]) {
            super(args);

            this.createdPromise = new Promise((resolve) => {
                this.createdResolver = resolve;
            });
            this.beforeMountPromise = new Promise((resolve) => {
                this.beforeMountResolver = resolve;
            });
        }
    };

    //-- new target must inherit prototype from old target, otherwise there will be no hooks in new target
    newTarget.prototype = target.prototype;

    return newTarget;
};
