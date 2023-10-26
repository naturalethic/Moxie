import { Component } from "solid-js";
import { useWebServerConfig } from "~/lib/api";
import { Browser } from "../../kit/Browser";
import { New } from "./New";

export const Handlers: Component = () => {
    const webServerConfig = useWebServerConfig();
    return (
        <div>
            <Browser
                items={[
                    {
                        label: "Add new web handler",
                        view: <New />,
                        divider: true,
                        icon: "circle-plus",
                    },
                    ...(webServerConfig.latest?.WebHandlers ?? []).map(
                        (handler) => ({
                            label: `${handler.Domain}:${handler.PathRegexp}`,
                            view: <div>{handler.Name}</div>,
                        }),
                    ),
                ]}
            />
        </div>
    );
};
