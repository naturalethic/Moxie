import { apiFunctions, Domain } from ".";

export const credentials = {
    username: () => import.meta.env.VITE_EMAIL_USERNAME,
    password: () => import.meta.env.VITE_EMAIL_PASSWORD,
};

const { apiResource, safeApi, reload } = apiFunctions(
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

export function reloadAccount() {
    return reload("Account");
}

export function updateFullName(fullName: string) {
    return safeApi("AccountSaveFullName", [fullName]);
}

export function updatePassword(password: string) {
    return safeApi("SetPassword", [password]);
}

export function updateEmail(address: string, email: Email) {
    const extantEmail = useAccount().latest!.Emails[address];
    return safeApi("DestinationSave", [address, extantEmail, email]);
}

export type Account = {
    FullName: string;
    Domain: Domain;
    Emails: Record<string, Email>;
};

export type Email = {
    FullName: "";
    Mailbox: "";
    Rulesets: Ruleset[] | null;
};

export type Ruleset = {
    SMTPMailFromRegexp: string;
    VerifiedDomain: string;
    HeadersRegexp: Record<string, string>;
    IsForward: boolean;
    ListAllowDomain: string;
    AcceptRejectsToMailbox: string;
    Mailbox: string;
};
