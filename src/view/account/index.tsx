import { Component } from "solid-js";
import { useAccount } from "~/lib/api/account";

export const Account: Component = (props) => {
    const account = useAccount();
    return <pre>{JSON.stringify(account.latest, null, 4)}</pre>;
};
