import { Component } from "solid-js";
import { useAccounts } from "~/lib/api";
import { Browser } from "../../kit/Browser";
import { Account } from "./Account";
import { New } from "./New";

export const Accounts: Component = () => {
    const accounts = useAccounts();

    return (
        <div>
            <Browser
                cacheKey="Accounts"
                items={[
                    {
                        label: "Add new account",
                        view: () => <New />,
                        divider: true,
                        icon: "circle-plus",
                    },
                    ...accounts.latest.map((account) => ({
                        label: account,
                        view: () => <Account username={account} />,
                    })),
                ]}
            />
        </div>
    );
};
