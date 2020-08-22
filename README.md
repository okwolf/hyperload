# Hyperload

[![npm](https://img.shields.io/npm/v/hyperload.svg)](https://www.npmjs.org/package/hyperload)

A higher-order app and component for dynamic import of [Hyperapp v2](https://github.com/jorgebucaran/hyperapp) components. Requires support (or polyfill) for [dynamic imports](https://caniuse.com/#feat=es6-module-dynamic-import).

## Installation

### Node.js

Install with npm / Yarn.

<pre>
npm i <a href=https://www.npmjs.com/package/hyperload>hyperload</a>
</pre>

Then with a module bundler like [rollup](https://github.com/rollup/rollup) or [webpack](https://github.com/webpack/webpack), use as you would anything else.

```js
import { withHyperload, Hyperload } from "hyperload";
```

Or using require.

```js
const { withHyperload, Hyperload } = require("hyperload");
```

### Browser

Download the minified library from the [CDN](https://unpkg.com/hyperload).

```html
<script src="https://unpkg.com/hyperload"></script>
```

You can find the library in `window.hyperload`.

## Example

```js
import { app, h } from "hyperapp";
import { withHyperload, Hyperload } from "hyperload";

const Loading = ({ error, otherProp }) => (
  <span>{error ? `Error! ${error}` : `loading ${otherProps}...`}</span>
);

withHyperload(app)({
  view: () => (
    <main>
      <Hyperload
        // These are the required props
        key="my-component"
        module={() => import("./my-component")}
        loading={Loading}
        otherProps="will be passed to the loading and imported components"
      />
    </main>
  ),
  container: document.body
});
```

Both the `loading` component and the dynamically imported module will receive the props that you pass to the `Hyperload` component. Errors encountered while importing your module will be passed to your `loading` component as the `error` prop.

## License

Hyperload is MIT licensed. See [LICENSE](LICENSE.md).
