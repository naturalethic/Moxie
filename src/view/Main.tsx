import { Deck } from "~/kit/Deck";
import { History } from "~/kit/History";
import { Toast } from "~/kit/Toast";
import { Header } from "./Header";
import { Admin } from "./admin/Admin";
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
                    ]}
                />
            </History>
        </Toast>
    );
};
