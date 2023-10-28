import { Component } from "solid-js";
import { Browser } from "~/kit/Browser";
import { Handlers } from "./Handlers";
import { Redirects } from "./Redirects";

export const Web: Component = () => {
    return (
        <div>
            <Browser
                cacheKey="Web"
                items={[
                    { label: "Handlers", view: () => <Handlers /> },
                    { label: "Redirects", view: () => <Redirects /> },
                ]}
            />
        </div>
    );
};
