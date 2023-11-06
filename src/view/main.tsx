import { Kit } from "~/kit";
import { Deck } from "~/kit/deck";
import { History } from "~/kit/history";
import { Toast } from "~/kit/toast";
import { Account } from "./account";
import { Admin } from "./admin";
import { Header } from "./header";
import { Mail } from "./mail/mail";

export const Main = () => {
    return (
        <Toast>
            <History>
                <div class="flex flex-col h-screen">
                    <Header />
                    <Deck
                        items={[
                            {
                                route: "/",
                                view: () => <div>Home</div>,
                            },
                            {
                                route: "/kit",
                                view: () => <Kit />,
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
                        ]}
                    />
                </div>
            </History>
        </Toast>
    );
};
