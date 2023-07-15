import type { Preview } from "@storybook/react";
import '../src/css/normalize.css';
import '../src/css/base.css';
import '../src/css/planner.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
