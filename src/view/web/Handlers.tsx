import { Component } from "solid-js";
import { Browser } from "~/kit/Browser";
import { deleteHandler, useWebServerConfig } from "~/lib/api";
import { New } from "./New";

export const Handlers: Component = () => {
    const webServerConfig = useWebServerConfig();
    return (
        <div>
            <Browser
                cacheKey="Handlers"
                items={[
                    {
                        label: "Add new web handler",
                        view: () => <New />,
                        divider: true,
                        icon: "circle-plus",
                    },
                    ...(webServerConfig.latest?.WebHandlers ?? []).map(
                        (handler) => ({
                            label: `${handler.Domain}:${handler.PathRegexp}`,
                            view: () => <div>{handler.Name}</div>,
                            onDelete: (index: number) => {
                                deleteHandler(
                                    // webServerConfig.latest!,
                                    index - 1,
                                );
                            },
                        }),
                    ),
                ]}
            />
        </div>
    );
};
