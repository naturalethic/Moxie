import { PlusCircleIcon } from "@primer/octicons-react";
import { NavList, PageLayout } from "@primer/react";
import { Suspense } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useAccounts } from "~/lib/api";

export function Component() {
    const accounts = useAccounts();
    const { username } = useParams();

    return (
        <PageLayout padding="none" columnGap="none" rowGap="none">
            <PageLayout.Pane position="start" width="small" divider="line">
                <NavList>
                    <NavList.Item
                        href="#/accounts/new"
                        aria-current={username === "new"}
                    >
                        Add new account
                        <NavList.LeadingVisual>
                            <PlusCircleIcon />
                        </NavList.LeadingVisual>
                    </NavList.Item>
                    <NavList.Divider />
                    {accounts?.map((account) => (
                        <NavList.Item
                            key={account}
                            href={`#/accounts/${account}`}
                            aria-current={username === account}
                        >
                            {account}
                        </NavList.Item>
                    ))}
                </NavList>
            </PageLayout.Pane>
            <PageLayout.Content sx={{ paddingLeft: 2 }}>
                <Suspense>
                    <Outlet />
                </Suspense>
            </PageLayout.Content>
        </PageLayout>
    );
}
