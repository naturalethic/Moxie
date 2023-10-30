import { Deck } from "~/kit/Deck";
import { History } from "~/kit/History";
import { Toast } from "~/kit/Toast";
import { Admin } from "./Admin";
import { Header } from "./Header";
import { Mail } from "./Mail";

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
                    ]}
                />
            </History>
        </Toast>
    );
};
