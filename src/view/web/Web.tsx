import { Component } from "solid-js";
import { Browser } from "../../kit/Browser";
import { Handlers } from "./Handlers";

export const Web: Component = () => {
    return (
        <div>
            <Browser
                items={[
                    { label: "Handlers", view: <Handlers /> },
                    { label: "Redirects", view: <div>Redirects</div> },
                ]}
            />
        </div>
    );
};
