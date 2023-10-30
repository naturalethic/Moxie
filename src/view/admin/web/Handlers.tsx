import { Component } from "solid-js";
import { Browser } from "~/kit/Browser";
import { deleteHandler, moveHandler, useWebServerConfig } from "~/lib/api";
import { Handler } from "./Handler";

export const Handlers: Component = () => {
    const webServerConfig = useWebServerConfig();

    function handleMove(from: number, to: number) {
        moveHandler(from - 1, to - 1);
    }

    return (
        <div>
            <Browser
                onMove={handleMove}
                items={[
                    {
                        route: "/admin/web/handlers/new",
                        label: "Add new web handler",
                        view: () => <Handler />,
                        divider: true,
                        icon: "circle-plus",
                    },
                    ...(webServerConfig.latest?.WebHandlers ?? []).map(
                        (handler, index) => ({
                            route: `/admin/web/handlers/${index}`,
                            moveable: true,
                            label: `${handler.Domain}:${handler.PathRegexp}`,
                            view: () => <Handler index={index} />,
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
