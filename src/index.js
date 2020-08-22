function assign(source, assignments) {
  var result = {},
    i;
  for (i in source) result[i] = source[i];
  for (i in assignments) result[i] = assignments[i];
  return result;
}

export function Hyperload(props) {
  return {
    hyperload: true,
    props: props,
  };
}

function makeUpdateLoadState(moduleKey, state, dispatch) {
  return function updateLoadState(props) {
    var loadStateProp = {};
    loadStateProp[moduleKey] = assign(state.hyperload[moduleKey], props);
    dispatch(
      assign(state, {
        hyperload: assign(state.hyperload, loadStateProp),
      })
    );
  };
}

function patchVdom(vdom, state, moduleCache, dispatch) {
  if (typeof vdom === "object" && vdom !== null) {
    for (var i in vdom.children) {
      var child = vdom.children[i];
      if (child.hyperload) {
        var moduleKey = child.props.key;
        var moduleImport = child.props.module;
        var loadState = state.hyperload[moduleKey];
        var cachedModule = moduleCache[moduleKey];
        var updateLoadState = makeUpdateLoadState(moduleKey, state, dispatch);
        if (!loadState) {
          loadState = { loading: true };
          updateLoadState(loadState);
          moduleImport()
            .then(function (loaded) {
              moduleCache[moduleKey] = loaded.default || loaded;
              updateLoadState({ loading: false, loaded: true });
            })
            .catch(function (error) {
              updateLoadState({ loading: false, error: error });
            });
        }
        if (loadState.loaded && cachedModule) {
          vdom.children[i] = cachedModule(child.props);
        } else if (loadState.error) {
          vdom.children[i] = child.props.loading(
            assign(child.props, {
              error: loadState.error,
            })
          );
        } else if (loadState.loading) {
          vdom.children[i] = child.props.loading(child.props);
        }
      } else {
        patchVdom(child, state, moduleCache, dispatch);
      }
    }
  }
}

export function withHyperload(nextApp) {
  return function (props) {
    var moduleCache = {};
    var dispatch;
    function enhancedInit(initialState) {
      return [
        initialState,
        [
          function (initDispatch) {
            dispatch = initDispatch;
            dispatch(props.init);
            dispatch(function (state) {
              return assign(state, {
                hyperload: {},
              });
            });
          },
        ],
      ];
    }

    function enhancedView(state) {
      var vdom = props.view(state);
      patchVdom(vdom, state, moduleCache, dispatch);
      return vdom;
    }

    return nextApp(
      assign(props, {
        init: enhancedInit,
        view: enhancedView,
      })
    );
  };
}
