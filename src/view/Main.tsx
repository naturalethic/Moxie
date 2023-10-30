import { Box } from "~/kit/Box";
import { Browser } from "~/kit/Browser";
import { Toast } from "~/kit/Toast";
import { Accounts } from "./accounts/Accounts";
import { Domains } from "./domains/Domains";
import { Web } from "./web/Web";

export default function () {
    return (
        <Toast>
            <header>Moxie</header>
            <Box class="m-2 p-2" border>
                <Browser
                    cacheKey="Main"
                    items={[
                        {
                            label: "Accounts",
                            view: () => <Accounts />,
                        },
                        {
                            label: "Domains",
                            view: () => <Domains />,
                        },
                        {
                            label: "Web",
                            view: () => <Web />,
                        },
                    ]}
                />
            </Box>
        </Toast>
    );
}
