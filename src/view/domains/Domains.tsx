import { Component } from "solid-js";
import { useDomains } from "~/lib/api";
import { Browser } from "../../kit/Browser";
import { Domain } from "./Domain";
import { New } from "./New";

export const Domains: Component = () => {
    const domains = useDomains();

    return (
        <div>
            <Browser
                cacheKey="Domains"
                items={[
                    {
                        label: "Add new domain",
                        view: () => <New />,
                        divider: true,
                        icon: "circle-plus",
                    },
                    ...domains.latest.map((domain) => ({
                        label: domain.ASCII,
                        view: () => <Domain domain={domain.ASCII} />,
                    })),
                ]}
            />
        </div>
    );
};
