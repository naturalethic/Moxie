import { PlusCircleIcon } from "@primer/octicons-react";
import { MoxieNavLayout } from "~/components/MoxieNavLayout";

import { useWebServerConfig } from "~/lib/api";
import { New } from "./New";

export function Handlers() {
    const webServerConfig = useWebServerConfig();

    return (
        <MoxieNavLayout>
            <MoxieNavLayout.Item
                id="new"
                label="Add new web handler"
                leadingVisual={PlusCircleIcon}
            >
                <New />
            </MoxieNavLayout.Item>
            <MoxieNavLayout.Divider />
            {webServerConfig.WebHandlers.map((handler) => (
                <MoxieNavLayout.Item
                    key={handler.Name}
                    id={handler.Name}
                    label={handler.Name}
                >
                    {handler.Name}
                    {/* <Domain name={domain.ASCII} /> */}
                </MoxieNavLayout.Item>
            ))}
        </MoxieNavLayout>
    );
}
