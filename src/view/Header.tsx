import { Component, For } from "solid-js";
import { Link } from "~/kit/history";

export const Header: Component = () => {
    const items = [
        {
            link: "/mail",
            label: "Mail",
        },
        {
            link: "/admin",
            label: "Admin",
        },
    ];
    return (
        <header>
            <div class="header-logo">Moxie</div>
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
