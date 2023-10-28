import { Component } from "solid-js";
import { Browser } from "~/kit/Browser";
import { deleteHandler, moveHandler, useWebServerConfig } from "~/lib/api";
import { New } from "./New";

export const Handlers: Component = () => {
    const webServerConfig = useWebServerConfig();

    function handleMove(from: number, to: number) {
        moveHandler(from - 1, to - 1);
    }

    return (
        <div>
            <Browser
                onMove={handleMove}
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
                            moveable: true,
                            label: `${handler.Domain}:${handler.PathRegexp}`,
                            view: () => <div>{handler.Name}</div>,
                            onDelete: (index: number) => {
                                deleteHandler(index - 1);
                            },
                        }),
                    ),
                ]}
            />
        </div>
    );
};
