import { PlusCircleIcon } from "@primer/octicons-react";
import { MoxieNavLayout } from "~/components/MoxieNavLayout";
import { useDomains } from "~/lib/api";
import { Domain } from "./Domain";
import { New } from "./New";

export function Domains() {
    const domains = useDomains();

    return (
        <MoxieNavLayout>
            <MoxieNavLayout.Item
                id="new"
                label="Add new domain"
                leadingVisual={PlusCircleIcon}
            >
                <New />
            </MoxieNavLayout.Item>
            <MoxieNavLayout.Divider />
            {domains?.map((domain) => (
                <MoxieNavLayout.Item
                    key={domain.ASCII}
                    id={domain.ASCII}
                    label={domain.ASCII}
                >
                    <Domain name={domain.ASCII} />
                </MoxieNavLayout.Item>
            ))}
        </MoxieNavLayout>
    );
}
