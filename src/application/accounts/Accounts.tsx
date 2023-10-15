import { PlusCircleIcon } from "@primer/octicons-react";
import { MoxieNavLayout } from "~/components/MoxieNavLayout";
import { useAccounts } from "~/lib/api";
import { Account } from "./Account";
import { New } from "./New";

export function Accounts() {
    const accounts = useAccounts();

    return (
        <MoxieNavLayout param="username">
            <MoxieNavLayout.Item
                id="new"
                label="Add new account"
                leadingVisual={PlusCircleIcon}
            >
                <New />
            </MoxieNavLayout.Item>
            {accounts.map((username) => (
                <MoxieNavLayout.Item
                    key={username}
                    id={username}
                    label={username}
                >
                    <Account username={username} />
                </MoxieNavLayout.Item>
            ))}
        </MoxieNavLayout>
    );
}
