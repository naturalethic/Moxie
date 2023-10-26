import { Component, For, JSX, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { cls } from "~/lib/util";
import { Icon } from "./Icon";

type BrowserItem = {
    label: string;
    view: JSX.Element;
    divider?: boolean;
    icon?: string;
};

export const Browser: Component<{ items: BrowserItem[] }> = (props) => {
    const [state, setState] = createStore<{
        selectedItem: number;
    }>({
        selectedItem: 0,
    });

    return (
        <div class="flex gap-4">
            <div class="flex flex-col">
                <For each={props.items}>
                    {(item, index) => (
                        <>
                            <div
                                class={cls(
                                    "browser-label flex items-center gap-1",
                                    {
                                        selected:
                                            index() === state.selectedItem,
                                    },
                                )}
                                onClick={() => {
                                    setState("selectedItem", index);
                                }}
                            >
                                <Show when={item.icon}>
                                    <Icon name={item.icon!} class="h-5" />
                                </Show>
                                {item.label}
                            </div>
                            <Show when={item.divider}>
                                <hr class="browser-divider" />
                            </Show>
                        </>
                    )}
                </For>
            </div>
            <div class="browser-content">
                <For each={props.items}>
                    {(item, index) => (
                        <Show when={index() === state.selectedItem}>
                            {item.view}
                        </Show>
                    )}
                </For>
            </div>
        </div>
    );
};
