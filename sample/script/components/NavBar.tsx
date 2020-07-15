import * as React from "react";

export const NavBar = () => (
    <nav>
        <ul style={{ listStyle: "none" }}>
            <li style={{ display: "inline-block", padding: "1em" }}>
                <a href="/sample/sample.htm">Basic Sample</a>
            </li>
            <li style={{ display: "inline-block", padding: "1em" }}>
                <a href="/sample/FocusOutShellSample.htm">Focus Out Sample</a>
            </li>
            <li style={{ display: "inline-block", padding: "1em" }}>
                <a href="/sample/ReactSample.htm">React Sample</a>
            </li>
        </ul>
    </nav>
);
