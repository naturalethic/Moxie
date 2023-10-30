import { Component } from "solid-js";
import { Browser } from "~/kit/Browser";
import { useAccounts } from "~/lib/api";
import { Account } from "./Account";
import { New } from "./New";

export const Accounts: Component = () => {
    const accounts = useAccounts();

    return (
        <div>
            <Browser
                items={[
                    {
                        label: "Add new account",
                        route: "/admin/accounts/new",
                        view: () => <New />,
                        divider: true,
                        icon: "circle-plus",
                    },
                    ...accounts.latest.map((account) => ({
                        route: `/admin/accounts/${account}`,
                        label: account,
                        view: () => <Account username={account} />,
                    })),
                ]}
            />
        </div>
    );
};
