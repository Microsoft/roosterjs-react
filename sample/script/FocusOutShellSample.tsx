import { DirectionalHint } from "office-ui-fabric-react/lib/Callout";
import * as React from "react";
import * as ReactDom from "react-dom";
import { PluginEvent, PluginEventType } from "roosterjs-editor-types";
import {
    ContentChangedPlugin,
    createEditorViewState,
    DoubleClickImagePlugin,
    EmojiPaneProps,
    EmojiPlugin,
    EmojiPluginOptions,
    FocusEventHandler,
    FocusOutShell,
    ImageManager,
    ImageManagerOptions,
    ImageResize,
    InsertLinkStringKeys,
    LeanRooster,
    LeanRoosterModes,
    PasteImagePlugin,
    RoosterCommandBar,
    RoosterCommandBarPlugin,
    RoosterCommmandBarButtonKeys as ButtonKeys,
    RoosterShortcutCommands,
    TableResize,
    UndoWithImagePlugin
} from "roosterjs-react";
import { EmojiDescriptionStrings, EmojiFamilyStrings, EmojiKeywordStrings } from "roosterjs-react-emoji-resources";
import { NavBar } from "./components/NavBar";

import { initializeIcons } from "../fabric/src";

initializeIcons();

class ContentChangedLoggerPlugin extends ContentChangedPlugin {
    constructor() {
        super(_ => console.log("Content changed"));
    }

    public onPluginEvent(event: PluginEvent): void {
        if (event && event.eventType === PluginEventType.ContentChanged) {
            console.log(`Content changed from ${(event as any).source}`);
        }
    }
}

const placeholderImageClassName = "dblclick-bypass";
const excludePlaceholderSelector = `:not(.${placeholderImageClassName})`;
const emojiPaneProps: EmojiPaneProps = {
    navBarProps: {
        className: "nabvar-class-name",
        buttonClassName: "nabvar-button-class-name",
        selectedButtonClassName: "selected-button-class-name",
        iconClassName: "navbar-icon-class-name"
    },
    statusBarProps: { className: "status-bar-class-name" },
    emojiIconProps: { className: "emoji-icon-class-name", selectedClassName: "selected-emoji-icon-class-name" },
    searchPlaceholder: "Search...",
    searchInputAriaLabel: "Search field"
};

function createEditor(name: string, loadEmojiStrings: boolean = false): JSX.Element {
    let leanRoosterContentDiv: HTMLDivElement;
    const leanRoosterContentDivOnRef = (ref: HTMLDivElement) => (leanRoosterContentDiv = ref);

    let leanRooster: LeanRooster;
    const leanRoosterOnRef = (ref: LeanRooster) => (leanRooster = ref);

    let commandBar: RoosterCommandBar;
    const commandBarOnRef = (ref: RoosterCommandBar) => (commandBar = ref);

    const imageManager = new ImageManager({
        uploadImage: (image: File) =>
            new Promise<string>((resolve, reject) => {
                const timeoutMs = Math.random() * 5000;
                console.log(`Imitating uploading... (${timeoutMs}ms)`);

                // fake upload failure if type isn't image
                if (image.type.indexOf("image/") !== 0) {
                    window.setTimeout(() => {
                        reject();
                        console.log(`Upload failed`);
                    }, timeoutMs);

                    return;
                }

                const reader = new FileReader();
                reader.onload = (event: ProgressEvent) => {
                    const dataURL: string = (event.target as FileReader).result as string;
                    window.setTimeout(() => resolve(dataURL), timeoutMs);
                };
                reader.readAsDataURL(image);
            }),
        placeholderImageClassName
    } as ImageManagerOptions);
    const leanRoosterViewState = createEditorViewState(`Hello LeanRooster! (${name})`);
    const imagePlugin = new PasteImagePlugin(imageManager);
    const imageResizePlugin = new ImageResize(undefined, undefined, undefined, undefined, excludePlaceholderSelector);

    const focusOutShellAllowMouseDown = (element: HTMLElement): boolean => leanRoosterContentDiv && leanRoosterContentDiv.contains(element);
    const focusOutShellOnFocus = (ev: React.FocusEvent<HTMLElement>) => {
        console.log(`FocusOutShell (${name}) gained focus (hasPlaceholder: ${leanRooster.hasPlaceholder()})`);
        commandBarPlugin.registerRoosterCommandBar(commandBar); // re-register command b/c we're changing mode on blur
        leanRooster.mode = LeanRoosterModes.Edit;
    };

    let suppressBlur = false;
    const focusOutShellOnBlur = (ev: React.FocusEvent<HTMLElement>) => {
        console.log(`FocusOutShell (${name}) lost focus (hasPlaceholder: ${leanRooster.hasPlaceholder()})`);
        leanRooster.mode = LeanRoosterModes.View;
        imageResizePlugin.hideResizeHandle();
    };
    const shouldCallBlur = (nextTarget: HTMLElement, shouldCallBlurDefault: (nextTarget: HTMLElement) => boolean): boolean => {
        if (suppressBlur) {
            suppressBlur = false;
            return false;
        }

        return shouldCallBlurDefault(nextTarget);
    };
    const onEmojiKeyboardTriggered = () => {
        if (loadEmojiStrings) {
            emojiPlugin.setStrings({ ...EmojiDescriptionStrings, ...EmojiKeywordStrings, ...EmojiFamilyStrings });
        }
        console.log("Emoji started from keyboard");
    };
    let commandBarPlugin: RoosterCommandBarPlugin = null;
    let emojiPlugin: EmojiPlugin = null;

    return (
        <FocusOutShell allowMouseDown={focusOutShellAllowMouseDown} onBlur={focusOutShellOnBlur} onFocus={focusOutShellOnFocus} shouldCallBlur={shouldCallBlur}>
            {(calloutClassName: string, calloutOnDismiss: FocusEventHandler) => {
                emojiPlugin =
                    emojiPlugin ||
                    new EmojiPlugin({
                        calloutClassName,
                        calloutOnDismiss,
                        onKeyboardTriggered: onEmojiKeyboardTriggered,
                        emojiPaneProps
                    } as EmojiPluginOptions);
                commandBarPlugin =
                    commandBarPlugin ||
                    new RoosterCommandBarPlugin({
                        onShortcutTriggered: (command: RoosterShortcutCommands) => console.log(command),
                        disableListWorkaround: true,
                        calloutClassName,
                        calloutOnDismiss,
                        strings: {
                            [InsertLinkStringKeys.InsertButton]: "Insert Link",
                            [InsertLinkStringKeys.CancelButton]: "Close",
                            [InsertLinkStringKeys.Title]: "Insert link",
                            [InsertLinkStringKeys.LinkFieldLabel]: "Url"
                        },
                        linkDialogClassName: "link-diag"
                    });

                return [
                    <LeanRooster
                        key="rooster"
                        viewState={leanRoosterViewState}
                        placeholder={`${name} placeholder`}
                        plugins={[
                            commandBarPlugin,
                            imagePlugin,
                            emojiPlugin,
                            imageResizePlugin,
                            new TableResize(),
                            new ContentChangedLoggerPlugin(),
                            new DoubleClickImagePlugin(excludePlaceholderSelector)
                        ]}
                        undo={new UndoWithImagePlugin(imageManager)}
                        ref={leanRoosterOnRef}
                        contentDivRef={leanRoosterContentDivOnRef}
                        hyperlinkToolTipCallback={(url: string) => `CTRL+Click to follow link\n${url}`}
                        clickOpenHyperlinkViewMode={true}
                        defaultFormat={{}}
                        data-foo="bar"
                    />,
                    <RoosterCommandBar
                        key="cmd"
                        className="lean-cmdbar"
                        buttonOverrides={[
                            { key: ButtonKeys.Strikethrough, exclude: true },
                            {
                                key: "vacation",
                                name: "Vacation",
                                iconProps: { iconName: "Vacation" },
                                handleChange: () => {
                                    console.log(leanRooster.getContent());
                                    alert("Hello");
                                    setTimeout(() => {
                                        leanRoosterViewState.content = "";
                                        leanRooster.reloadContent();
                                    }, 2000);
                                },
                                order: 0
                            },
                            { key: ButtonKeys.Bold, className: "my-button-root", buttonClassName: "my-button" },
                            { key: ButtonKeys.FontColor, className: "my-button-root", buttonClassName: "my-button" }
                        ]}
                        roosterCommandBarPlugin={commandBarPlugin}
                        emojiPlugin={emojiPlugin}
                        calloutClassName={calloutClassName}
                        calloutOnDismiss={calloutOnDismiss}
                        imageManager={imageManager}
                        ref={commandBarOnRef}
                        onButtonClicked={buttonKey => {
                            if (buttonKey === ButtonKeys.InsertImage) {
                                suppressBlur = true;
                            }

                            console.log(buttonKey);
                        }}
                        overflowMenuProps={{ className: "custom-overflow" }}
                        disableListWorkaround={true}
                        tooltipDirectionHint={DirectionalHint.bottomCenter}
                    />
                ];
            }}
        </FocusOutShell>
    );
}

const view = (
    <div className="root-container">
        <NavBar />
        <div className="editor-container">
            {createEditor("editor #1", true /* loadEmojiStrings */)}
            {createEditor("editor #2")}
        </div>
    </div>
);

ReactDom.render(view, document.getElementById("container"), null);
