import { apiFunctions, Domain } from ".";

const { apiResource } = apiFunctions(
    () => import.meta.env.VITE_EMAIL_USERNAME,
    () => import.meta.env.VITE_EMAIL_PASSWORD,
    "/account/api",
);

export function useAccount() {
    return apiResource<Account, [string, Domain, Record<string, Email>]>(
        "Account",
        ([FullName, Domain, Emails]) => ({
            FullName,
            Domain,
            Emails,
        }),
    )[0];
}

type Email = {
    Mailbox: "";
    Rulesets: null;
    FullName: "";
};

type Account = {
    FullName: string;
    Domain: Domain;
    Emails: Record<string, Email>;
};
