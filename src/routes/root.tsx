import { NavList, PageLayout, TextInput } from "@primer/react";
import { PageHeader } from "@primer/react/drafts";
import { Outlet, useLocation } from "react-router-dom";
import { useSnap } from "../lib/store";

export function Component() {
    const snap = useSnap();
    const location = useLocation();

    return (
        <PageLayout padding="normal" columnGap="none" rowGap="none">
            <PageLayout.Header divider="line" padding="condensed">
                <PageHeader>
                    <PageHeader.Title>Moxie</PageHeader.Title>
                    <PageHeader.Actions>
                        <TextInput
                            placeholder="Username"
                            defaultValue={snap.credentials.username}
                        />
                        <TextInput
                            placeholder="Password"
                            type="password"
                            defaultValue={snap.credentials.password}
                        />
                    </PageHeader.Actions>
                </PageHeader>
            </PageLayout.Header>
            <PageLayout.Pane position="start" divider="line" width="small">
                <NavList>
                    <NavList.Item
                        href="#/accounts"
                        aria-current={location.pathname.startsWith("/accounts")}
                    >
                        Accounts
                        {/* <NavList.SubNav>
                            <NavList.Item href="#/account">
                                <Button size="small">Create</Button>
                            </NavList.Item>
                            {accounts?.map((account) => (
                                <NavList.Item
                                    key={account}
                                    href={`#/account/${account}`}
                                >
                                    {account}
                                </NavList.Item>
                            ))}
                        </NavList.SubNav> */}
                    </NavList.Item>
                    <NavList.Item
                        href="#/domains"
                        aria-current={location.pathname.startsWith("/domains")}
                    >
                        Domains
                        {/* <NavList.SubNav>
                            {domains?.map((domain) => (
                                <NavList.Item
                                    key={domain.ASCII}
                                    href={`#/domain/${domain.ASCII}`}
                                >
                                    {domain.ASCII}
                                </NavList.Item>
                            ))}
                        </NavList.SubNav> */}
                    </NavList.Item>
                    <NavList.Item
                        href="#/redirects"
                        aria-current={location.pathname === "/redirects"}
                    >
                        Redirects
                    </NavList.Item>
                </NavList>
            </PageLayout.Pane>
            <PageLayout.Content sx={{ paddingLeft: 2 }}>
                <Outlet />
            </PageLayout.Content>
        </PageLayout>
    );
}
