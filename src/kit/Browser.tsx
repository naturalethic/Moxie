import { Component, For, JSX, Show, createSignal } from "solid-js";
import { cls } from "~/lib/util";
import { Icon } from "./Icon";

type BrowserItem = {
    label: string;
    view: () => JSX.Element;
    divider?: boolean;
    icon?: string;
    onDelete?: (index: number) => void;
};

export const Browser: Component<{
    items: BrowserItem[];
    cacheKey?: string;
}> = (props) => {
    const cacheKey = props.cacheKey && `browser:${props.cacheKey}`;
    const [selectedItem, setSelectedItem] = createSignal<number>(
        cacheKey ? Number(localStorage.getItem(cacheKey) ?? 0) : 0,
    );

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
                                        selected: index() === selectedItem(),
                                    },
                                )}
                                onClick={() => {
                                    setSelectedItem(index);
                                    cacheKey &&
                                        localStorage.setItem(
                                            cacheKey,
                                            String(index()),
                                        );
                                }}
                            >
                                <Show when={item.icon}>
                                    <Icon name={item.icon!} class="h-5" />
                                </Show>
                                <div class="flex justify-between w-full">
                                    <div>{item.label}</div>
                                    <Show when={item.onDelete}>
                                        <Icon
                                            name="trash"
                                            onClick={() =>
                                                item.onDelete?.(index())
                                            }
                                        />
                                    </Show>
                                </div>
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
                        <Show when={index() === selectedItem()}>
                            {item.view()}
                        </Show>
                    )}
                </For>
            </div>
        </div>
    );
};
