import { Story } from '@storybook/vue/types-6-0';
import Card from "@/components/Card.vue";
import { action } from '@storybook/addon-actions';

const cancel = () => action('cancel');

export default {
  title: 'Components/Common/Card',
  component: Card,
};

const DefaultTemplate: Story = (args, { argTypes }) => ({
  components: { Card },
  props: Object.keys(args),
  template: '<card v-bind="$props" ><div class="text-center"><p>This is a test Card</p><p>This card has body content.</p></div></card>'
});

export const Default = DefaultTemplate.bind({});
Default.args = {
  headerText: 'Test Card',
  cancel
};

const WithFooterTemplate: Story = (args, { argTypes }) => ({
  components: { Card },
  props: Object.keys(args),
  template: `<card v-bind="$props" >
    <div class="text-center"><p>This is a test Card</p><p>This card has body content.</p></div>
    <template v-slot:footer>
      <div class="text-center">This is footer content</div>
    </template>
  </card>`
});

export const WithFooter = WithFooterTemplate.bind({});
WithFooter.args = {
  headerText: 'Test Card',
  cancel
};
