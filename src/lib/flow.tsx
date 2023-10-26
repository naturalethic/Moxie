import { Accessor, For, JSX } from "solid-js";

export function Keys<
    T extends Record<string, unknown>,
    U extends JSX.Element,
>(props: {
    for: T | undefined | null | false;
    fallback?: JSX.Element;
    children: (item: string, index: Accessor<number>) => U;
}) {
    return (
        <For each={Object.keys(props.for ?? {})} fallback={props.fallback}>
            {props.children}
        </For>
    );
}

export function Values<
    T extends Record<string, unknown>,
    U extends JSX.Element,
>(props: {
    for: T | undefined | null | false;
    fallback?: JSX.Element;
    children: (item: string, index: Accessor<number>) => U;
}) {
    return (
        <For each={Object.values(props.for ?? {})} fallback={props.fallback}>
            {props.children}
        </For>
    );
}

export function Entries<
    T extends Record<string, unknown>,
    U extends JSX.Element,
>(props: {
    for: T | undefined | null | false;
    fallback?: JSX.Element;
    children: (item: [string, string], index: Accessor<number>) => U;
}) {
    return (
        <For each={Object.entries(props.for ?? {})} fallback={props.fallback}>
            {props.children}
        </For>
    );
}
