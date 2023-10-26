import { Box } from "~/kit/Box";
import { Browser } from "../kit/Browser";
import { Accounts } from "./accounts/Accounts";
import { Web } from "./web/Web";

export default function () {
    return (
        <Box class="m-2 p-2" border>
            <Browser
                items={[
                    {
                        label: "Accounts",
                        view: <Accounts />,
                    },
                    {
                        label: "Domains",
                        view: <div>Domains</div>,
                    },
                    {
                        label: "Web",
                        view: <Web />,
                    },
                ]}
            />
        </Box>
    );
}
