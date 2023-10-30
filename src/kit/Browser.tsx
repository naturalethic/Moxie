import { Component, For, JSX, Show } from "solid-js";
import { cls } from "~/lib/util";
import { Routable, useHistory } from "./History";
import { Icon } from "./Icon";

type BrowserItem = Routable & {
    label: string;
    view: () => JSX.Element;
    divider?: boolean;
    icon?: string;
    onDelete?: (index: number) => void;
    moveable?: boolean;
};

export const Browser: Component<{
    items: BrowserItem[];
    onMove?: (from: number, to: number) => void;
}> = (props) => {
    const history = useHistory();
    const selectedItem = history.matchRoute(props.items);

    let dragFrom = 0;

    function getMarker(event: DragEvent) {
        const element = document.elementFromPoint(event.clientX, event.clientY);
        const marker = element
            ?.closest(".browser-label")
            ?.querySelector(".drag-marker");
        return marker as HTMLElement;
    }

    function handleDragStart(event: DragEvent) {
        const marker = getMarker(event);
        dragFrom = Number(marker?.dataset.index);
    }

    function handleDragOver(event: DragEvent) {
        event.preventDefault();
        for (const child of container.querySelectorAll(".drag-marker")) {
            child.classList.remove("insert-above");
            child.classList.remove("insert-below");
        }
        const marker = getMarker(event);
        if (!marker) {
            return;
        }
        const bounds = marker.getBoundingClientRect();
        if (event.clientY < bounds.y + bounds.height / 2) {
            marker.classList.add("insert-above");
        } else {
            marker.classList.add("insert-below");
        }
    }

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        for (const child of container.querySelectorAll(".drag-marker")) {
            child.classList.remove("insert-above");
            child.classList.remove("insert-below");
        }
        const marker = getMarker(event);
        if (!marker) {
            return;
        }
        const bounds = marker.getBoundingClientRect();
        const dragTo =
            event.clientY < bounds.y + bounds.height / 2
                ? Number(marker.dataset.index)
                : Number(marker.dataset.index) + 1;
        if (dragTo !== dragFrom) {
            props.onMove?.(dragFrom, dragTo);
        }
    }

    let container: HTMLDivElement;

    return (
        <div class="flex gap-4">
            <div
                class="flex flex-col"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                ref={container!}
            >
                <For each={props.items}>
                    {(item, index) => (
                        <>
                            <div
                                draggable={item.moveable && !!props.onMove}
                                onDragStart={handleDragStart}
                                class={cls(
                                    "browser-label flex items-center gap-1",
                                    {
                                        selected:
                                            item.route === selectedItem().route,
                                    },
                                )}
                                onClick={() => {
                                    history.push(item.route);
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
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                item.onDelete?.(index());
                                            }}
                                        />
                                    </Show>
                                </div>
                                <Show when={item.moveable}>
                                    <div
                                        class="drag-marker absolute h-full w-full pointer-events-none"
                                        data-index={index()}
                                    />
                                </Show>
                            </div>
                            <Show when={item.divider}>
                                <hr class="browser-divider" />
                            </Show>
                        </>
                    )}
                </For>
            </div>
            <div class="browser-content">{selectedItem().view()}</div>
        </div>
    );
};
