import * as React from "react";
import { ReactPluginComponentProps } from "roosterjs-plugin-react";

const knownEmoji = ["🤚", "🖐", "✋", "🖖", "👌", "✌", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏"];

const buttonInlineStyle: React.CSSProperties = {
    display: "inline-block",
    border: "1px solid black",
    margin: 2,
    borderRadius: 2,
    userSelect: "none"
};

const getEmojiFromStateString = (stateString: string): string | null => {
    try {
        const foundEmoji = JSON.parse(stateString).emoji;
        if (knownEmoji.indexOf(foundEmoji) === -1) {
            return null;
        }
        return foundEmoji;
    } catch {
        return null;
    }
};

export const ExampleInlineReactComponent = (props: ReactPluginComponentProps) => {
    const [emoji, setEmoji] = React.useState(getEmojiFromStateString(props.initialSerializedSharableState) || knownEmoji[0]);

    const randomizeEmoji = React.useCallback(() => {
        let emojiIndex = knownEmoji.indexOf(emoji);
        while (emojiIndex === knownEmoji.indexOf(emoji)) {
            emojiIndex = Math.min(knownEmoji.length - 1, Math.floor(Math.random() * knownEmoji.length));
        }
        setEmoji(knownEmoji[emojiIndex]);
    }, [setEmoji]);

    React.useEffect(() => {
        props.updateDomInEditor();
    });

    React.useEffect(() => {
        props.updateSerialziedSharableState(
            JSON.stringify({
                emoji
            })
        );
    }, [emoji]);

    React.useEffect(() => {
        const clickTarget = props.inEditorMountRoot.querySelector("button");
        if (clickTarget) {
            clickTarget.addEventListener("click", randomizeEmoji);
            return () => clickTarget.removeEventListener("click", randomizeEmoji);
        }
    });

    return (
        <button style={buttonInlineStyle} title="Click to randomize the emoji">
            {emoji}
        </button>
    );
};
