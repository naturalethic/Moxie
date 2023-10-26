import {
    InitializedResourceReturn,
    ResourceReturn,
    createResource,
} from "solid-js";

export async function api<T>(resource: string, params: unknown[] = []) {
    const endpoint = import.meta.env.VITE_MOX_ENDPOINT ?? "";
    const response = await fetch(`${endpoint}/api/${resource}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(
                `${import.meta.env.VITE_USERNAME}:${
                    import.meta.env.VITE_PASSWORD
                }`,
            )}`,
        },
        body: JSON.stringify({ params }),
    });
    const body = await response.json();
    if (body.error) {
        throw new Error(body.error.message);
    }
    return body.result as T;
}

export async function safeApi<T>(
    resource: string,
    params: unknown[] = [],
): Promise<{ result?: T; error?: string }> {
    try {
        return {
            result: await api<T>(resource, params),
        };
    } catch (error) {
        return {
            error: (error as Error).message,
        };
    }
}

function apiResource<T>(
    resource: string,
    params: unknown[],
    initialValue: T,
): InitializedResourceReturn<T>;

function apiResource<T>(
    resource: string,
    params?: unknown[],
): ResourceReturn<T>;

function apiResource<T>(
    resource: string,
    params: unknown[] = [],
    initialValue?: T,
): ResourceReturn<T> | InitializedResourceReturn<T> {
    const key = `${resource}:${JSON.stringify(params)}`;
    if (!resourceCache[key]) {
        resourceCache[key] = createResource<T>(() => api<T>(resource, params), {
            initialValue,
        });
    }
    if (initialValue) {
        return resourceCache[key] as InitializedResourceReturn<T>;
    } else {
        return resourceCache[key] as ResourceReturn<T>;
    }
}

const resourceCache: Record<string, unknown> = {};

export function useAccounts() {
    return apiResource<string[]>("Accounts", [], [])[0];
}

export function reloadAccounts() {
    const [, { refetch }] = apiResource<string[]>("Accounts", [], []);
    refetch();
}

export function useAccount(username: string) {
    return apiResource<Account>("Account", [username])[0];
}

export function reloadAccount(username: string) {
    const [, { refetch }] = apiResource<Account>("Account", [username]);
    refetch();
}

export async function createAccount(username: string, address: string) {
    return await safeApi("AccountAdd", [username, address]);
}

export async function deleteAccount(username: string) {
    return await safeApi("AccountRemove", [username]);
}

export async function createEmail(username: string, address: string) {
    return await safeApi("AddressAdd", [address, username]);
}

export async function deleteEmail(address: string) {
    return await safeApi("AddressRemove", [address]);
}

export async function setPassword(username: string, password: string) {
    return await safeApi("SetPassword", [username, password]);
}

export function useDomains() {
    return apiResource<Domain[]>("Domains", [], [])[0];
}

export function reloadDomains() {
    const [, { refetch }] = apiResource<Domain[]>("Domains", [], []);
    refetch();
}

export async function createDomain(domain: string, username: string) {
    return await safeApi("DomainAdd", [domain, username, ""]);
}

export async function deleteDomain(domain: string) {
    return await safeApi("DomainRemove", [domain]);
}

export function useWebServerConfig() {
    return apiResource<WebServerConfig>("WebserverConfig")[0];
}

export type Domain = {
    ASCII: string;
    Unicode: string;
};

export type WebHandler = {
    LogName: string;
    Domain: string;
    PathRegexp: string;
    DontRedirectPlainHTTP: boolean;
    Compress: boolean;
    WebStatic: WebStatic | null;
    WebRedirect: WebRedirect | null;
    WebForward: WebForward | null;
    Name?: string;
    DNSDomain?: Domain;
};

export type WebForward = {
    StripPath: boolean;
    URL: string;
    ResponseHeaders: Record<string, string> | null;
};

export type WebRedirect = {
    BaseURL: string;
    OrigPathRegexp: string;
    ReplacePath: string;
    StatusCode: number;
};

export type WebStatic = {
    StripPrefix: string;
    Root: string;
    ListFiles: boolean;
    ContinueNotFound: boolean;
    ResponseHeaders: Record<string, string> | null;
};

export type WebServerConfig = {
    WebDNSDomainRedirects: Domain[][];
    WebDomainRedirects: string[][] | null;
    WebHandlers: WebHandler[];
};

export type AutomaticJunkFlags = {
    Enabled: boolean;
    JunkMailboxRegexp: string;
    NeutralMailboxRegexp: string;
    NotJunkMailboxRegexp: string;
};

export type Destination = {
    FullName: string;
    Mailbox: string;
    Rulesets: null;
};

export type JunkFilter = {
    IgnoreWords: number;
    MaxPower: number;
    Onegrams: boolean;
    RareWords: number;
    Threegrams: boolean;
    Threshold: number;
    TopWords: number;
    Twograms: boolean;
};

export type Account = {
    AutomaticJunkFlags: AutomaticJunkFlags;
    DNSDomain: Domain;
    Description: string;
    Destinations: Record<string, Destination>;
    Domain: string;
    FullName: string;
    JunkFilter: JunkFilter;
    KeepRejects: boolean;
    MaxFirstTimeRecipientsPerDay: number;
    MaxOutgoingMessagesPerDay: number;
    RejectsMailbox: string;
    Routes: null;
    SubjectPass: {
        Period: number;
    };
};
