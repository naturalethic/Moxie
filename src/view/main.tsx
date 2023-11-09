import { lazy } from "solid-js";
import { Deck } from "~/kit/deck";
import { Toast } from "~/kit/toast";
import { History } from "~/lib/history";
import { Account } from "./account";
import { Admin } from "./admin";
import { Header } from "./header";
import { Mail } from "./mail/mail";

const Kit = lazy(async () => {
    return { default: (await import("~/kit")).Kit };
});

export const Main = () => {
    const items = [
        {
            route: "/",
            view: () => <div>Home</div>,
        },
        {
            route: "/admin",
            view: () => <Admin />,
        },
        {
            route: "/mail",
            view: () => <Mail />,
        },
        {
            route: "/account",
            view: () => <Account />,
        },
    ];
    if (process.env.NODE_ENV !== "production") {
        items.push({
            route: "/kit",
            view: () => <Kit />,
        });
    }

    return (
        <Toast>
            <History>
                <div class="flex flex-col h-screen">
                    <Header />
                    <Deck items={items} />
                </div>
            </History>
        </Toast>
    );
};
