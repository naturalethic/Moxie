import { Component } from "solid-js";
import { Box } from "~/kit/Box";
import { Browser } from "~/kit/Browser";
import { Accounts } from "./accounts/Accounts";
import { Domains } from "./domains/Domains";
import { Web } from "./web/Web";

export const Admin: Component = () => {
    return (
        <Box class="m-2 p-2" border>
            <Browser
                cacheKey="Admin"
                items={[
                    {
                        route: "accounts",
                        label: "Accounts",
                        view: () => <Accounts />,
                    },
                    {
                        route: "domains",
                        label: "Domains",
                        view: () => <Domains />,
                    },
                    {
                        route: "web",
                        label: "Web",
                        view: () => <Web />,
                    },
                ]}
            />
        </Box>
    );
};
