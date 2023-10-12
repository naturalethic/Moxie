import { PlusCircleIcon } from "@primer/octicons-react";
import { NavList, PageLayout } from "@primer/react";
import { Outlet, useParams } from "react-router-dom";
import { useDomains } from "~/lib/api";

export function Component() {
    const { name } = useParams();
    const domains = useDomains();
    return (
        <PageLayout padding="none" columnGap="none" rowGap="none">
            <PageLayout.Pane position="start" width="small" divider="line">
                <NavList>
                    <NavList.Item
                        href="#/domains/new"
                        aria-current={name === "new"}
                    >
                        Add new domain
                        <NavList.LeadingVisual>
                            <PlusCircleIcon />
                        </NavList.LeadingVisual>
                    </NavList.Item>
                    <NavList.Divider />
                    {domains?.map((domain) => (
                        <NavList.Item
                            key={domain.ASCII}
                            href={`#/domains/${domain.ASCII}`}
                            aria-current={name === domain.ASCII}
                        >
                            {domain.ASCII}
                        </NavList.Item>
                    ))}
                </NavList>
            </PageLayout.Pane>
            <PageLayout.Content sx={{ paddingLeft: 2 }}>
                <Outlet />
            </PageLayout.Content>
        </PageLayout>
    );
}
