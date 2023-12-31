import { unwrap } from "solid-js/store";
import { apiFunctions, Domain } from ".";

const { safeApi, apiResource, reload } = apiFunctions(
    () => import.meta.env.VITE_USERNAME,
    () => import.meta.env.VITE_PASSWORD,
    "/admin/api",
);

export function useAccounts() {
    return apiResource<string[]>({ resource: "Accounts", initialValue: [] })[0];
}

export function reloadAccounts() {
    reload("Accounts");
}

export function useAccount(username: string) {
    return apiResource<Account>({ resource: "Account", params: [username] })[0];
}

export function reloadAccount(username: string) {
    reload("Account", [username]);
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
    // const resource = apiResource<Domain[]>({
    //     resource: "Domains",
    //     initialValue: [],
    // });
    // // const foo = resource[0].latest;
    return apiResource<Domain[]>({ resource: "Domains", initialValue: [] })[0];
}

export function reloadDomains() {
    reload("Domains");
}

export function useDomainRecords(domain: string) {
    return apiResource<string[]>({
        resource: "DomainRecords",
        params: [domain],
        initialValue: [],
    })[0];
}

export async function createDomain(domain: string, username: string) {
    return await safeApi("DomainAdd", [domain, username, ""]);
}

export async function deleteDomain(domain: string) {
    return await safeApi("DomainRemove", [domain]);
}

export function useDomainLocalparts(domain: string) {
    return apiResource<Record<string, string>>({
        resource: "DomainLocalparts",
        params: [domain],
        initialValue: {},
    })[0];
}

export function reloadDomainLocalparts(domain: string) {
    reload("DomainLocalparts", [domain]);
}

export function useWebServerConfig() {
    return apiResource<WebServerConfig>({ resource: "WebserverConfig" })[0];
}

function generateWebDomainRedirects(
    webServerConfig: WebServerConfig,
    redirects: Record<string, string> = {},
) {
    if (redirects) {
        return Object.entries(redirects);
    }
    if (!webServerConfig.WebDNSDomainRedirects) {
        return [];
    }
    return webServerConfig.WebDNSDomainRedirects.map(([from, to]) => [
        from,
        to,
    ]);
}

function generateWebServerConfigParams(redirects: Record<string, string> = {}) {
    const webServerConfig = useWebServerConfig().latest!;
    return [
        webServerConfig,
        {
            WebDomainRedirects: generateWebDomainRedirects(
                webServerConfig,
                redirects,
            ),
            WebHandlers:
                structuredClone(unwrap(webServerConfig.WebHandlers)) ?? [],
        },
    ];
}

export async function saveRedirects(redirects: Record<string, string> = {}) {
    const params = generateWebServerConfigParams(redirects);
    const response = await safeApi("WebserverConfigSave", params);
    if (response.result) {
        reload("WebserverConfig", [], response.result);
    }
    return response;
}

export async function createHandler(handler: WebHandler) {
    const params = generateWebServerConfigParams();
    params[1].WebHandlers.push(handler);
    const response = await safeApi("WebserverConfigSave", params);
    if (response.result) {
        reload("WebserverConfig", [], response.result);
    }
    return response;
}

export async function updateHandler(index: number, handler: WebHandler) {
    const params = generateWebServerConfigParams();
    params[1].WebHandlers[index] = handler;
    const response = await safeApi("WebserverConfigSave", params);
    if (response.result) {
        reload("WebserverConfig", [], response.result);
    }
    return response;
}

export async function moveHandler(from: number, to: number) {
    const params = generateWebServerConfigParams();
    params[1].WebHandlers.splice(
        to,
        0,
        params[1].WebHandlers.splice(from, 1)[0],
    );
    const response = await safeApi("WebserverConfigSave", params);
    if (response.result) {
        reload("WebserverConfig", [], response.result);
    }
    return response;
}

export async function deleteHandler(index: number) {
    const params = generateWebServerConfigParams();
    params[1].WebHandlers.splice(index, 1);
    const response = await safeApi("WebserverConfigSave", params);
    if (response.result) {
        reload("WebserverConfig", [], response.result);
    }
    return response;
}

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
