import { Component } from "solid-js";
import { Browser } from "~/kit/browser";
import { useAccounts } from "~/lib/api/admin";
import { Account } from "./account";
import { New } from "./new";

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
