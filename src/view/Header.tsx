import { Component, For } from "solid-js";
import { Link } from "~/kit/history";

export const Header: Component = () => {
    const items = [
        {
            link: "/mail",
            label: "Mail",
        },
        {
            link: "/account",
            label: "Account",
        },
        {
            link: "/admin",
            label: "Admin",
        },
    ];
    return (
        <header>
            <Link route="/" class="header-logo">
                Moxie
            </Link>
            <ul>
                <For each={items}>
                    {(item) => (
                        <li>
                            <Link route={item.link}>{item.label}</Link>
                        </li>
                    )}
                </For>
            </ul>
        </header>
    );
};
