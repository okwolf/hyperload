import { app, h, text } from "hyperapp";
import { withHyperload, Hyperload } from "hyperload";

const Loading = ({ error, otherProps }) =>
  h("span", {}, text(error ? `Error! ${error}` : `loading ${otherProps}...`));

withHyperload(app)({
  init: {
    usedHyperload: false
  },
  view: ({ usedHyperload }) =>
    h("main", {}, [
      usedHyperload
        ? Hyperload({
            // These are the required props
            module: "/my-component",
            loading: Loading,
            otherProps: "will be passed to the loading and imported components"
          })
        : h(
            "button",
            {
              onclick: state => ({
                ...state,
                usedHyperload: true
              })
            },
            text("load")
          )
    ]),
  node: document.getElementById("app")
});
