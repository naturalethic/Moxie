import { Component, For } from "solid-js";
import { Link } from "~/lib/history";

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
    if (process.env.NODE_ENV !== "production") {
        items.push({
            link: "/kit",
            label: "Kit",
        });
    }
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
