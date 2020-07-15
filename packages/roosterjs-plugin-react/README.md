# roosterjs-react-plugin

Mounts a react component inside the editor.

## usage

For copy/paste to work with this component, you need to whitelist the data fields it uses when initializing your Paste plugin

e.g.

```ts
import { REACT_COMPONENT_SHARABLE_STATE, REACT_COMPONENT_INSTANCE_ID, REACT_COMPONENT_DATA_KEY } from "roosterjs-plugin-react";

// ...

const paste = new Paste(true /*useDirectPaste*/, {
    [REACT_COMPONENT_SHARABLE_STATE]: value => value,
    [REACT_COMPONENT_INSTANCE_ID]: value => value,
    [REACT_COMPONENT_DATA_KEY]: value => value
});

// ...

const editor = new Editor({
    plugins: [paste ...],
    ...
})
```

## running tests

-   `yarn run karma start` - run tests oneshot
-   `yarn run karma start --single-run=false` - run tests to debug (click on Debug in the launched chrome window)
