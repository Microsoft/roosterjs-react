import * as React from "react";
import * as ReactDom from "react-dom";
import { createEditorViewState } from "roosterjs-react";
import { Ribbon, RibbonPlugin } from "roosterjs-react-ribbon";
import { ReactPlugin } from "roosterjs-plugin-react";
import { ExampleInlineReactComponent } from "./components/ExampleInlineReactComponent";
import { NavBar } from "./components/NavBar";

import ReactEditor from "./ReactEditor";
import ribbonButtonRenderer from "./ribbonButtonRenderer";

const container = document.getElementById("container");
const viewState = createEditorViewState("Hello ReactEditor!");
const reactPlugin = new ReactPlugin("example-react-component", ExampleInlineReactComponent);
const ribbonPlugin = new RibbonPlugin();
const ribbonButtons = [
    "bold",
    "italic",
    "underline",
    "font",
    "size",
    "bkcolor",
    "color",
    "bullet",
    "number",
    "indent",
    "outdent",
    "quote",
    "left",
    "center",
    "right",
    "link",
    "unlink",
    "sub",
    "super",
    "strike",
    "alttext",
    "ltr",
    "rtl",
    "undo",
    "redo",
    "unformat"
];
const editor = (
    <>
        <NavBar />
        <section>
            <span>
                Copy <span data-rcp-compid="example-react-component">this block</span> into the Editor to get a component
            </span>
        </section>
        <Ribbon ribbonPlugin={ribbonPlugin} className={"myRibbon"} buttonRenderer={ribbonButtonRenderer} buttonNames={ribbonButtons} />
        <ReactEditor className={"editor"} viewState={viewState} plugins={[ribbonPlugin, reactPlugin]} />
    </>
);
window.addEventListener("resize", () => ribbonPlugin.resize());
ReactDom.render(editor, container, null);
