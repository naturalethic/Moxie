import { Deck } from "~/kit/deck";
import { History } from "~/kit/history";
import { Toast } from "~/kit/toast";
import { Account } from "./account";
import { Admin } from "./admin";
import { Header } from "./header";
import { Mail } from "./mail/Mail";

export const Main = () => {
    return (
        <Toast>
            <History>
                <Header />
                <Deck
                    items={[
                        { route: "/", view: () => <div>Home</div> },
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
            </History>
        </Toast>
    );
};
