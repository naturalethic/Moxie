import { Component } from "solid-js";
import { Browser } from "~/kit/browser";
import { useDomains } from "~/lib/api";
import { Domain } from "./domain";
import { New } from "./new";

export const Domains: Component = () => {
    const domains = useDomains();

    return (
        <div>
            <Browser
                items={[
                    {
                        route: "/admin/domains/new",
                        label: "Add new domain",
                        view: () => <New />,
                        divider: true,
                        icon: "circle-plus",
                    },
                    ...domains.latest.map((domain) => ({
                        route: `/admin/domains/${domain.ASCII}`,
                        label: domain.ASCII,
                        view: () => <Domain domain={domain.ASCII} />,
                    })),
                ]}
            />
        </div>
    );
};
