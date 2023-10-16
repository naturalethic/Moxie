import useSWR, { Middleware, mutate } from "swr";
import { Account, Domain, WebHandler, WebServerConfig, store } from "./store";

export const middleware: Middleware = (useSWRNext) => {
    return (key, fetcher, config) => {
        const swr = useSWRNext(key, fetcher, config);
        const [resource, params] = key as [string, unknown[]];
        if (swr.data) {
            if (resource === "WebserverConfig") {
                store.webServerConfig =
                    (swr.data as unknown as WebServerConfig) ?? null;
            }
            if (resource === "Accounts") {
                for (const account of (swr.data as string[]) ?? []) {
                    store.accounts[account] ??= null;
                }
            }
            if (resource === "Account") {
                store.accounts[params[0] as string] =
                    swr.data as unknown as Account;
            }
        }
        return swr;
    };
};

export async function fetcher([resource, params]: [string, unknown[]]) {
    return api(resource, params);
}

export async function api(resource: string, params: unknown[] = []) {
    const endpoint = import.meta.env.VITE_MOX_ENDPOINT ?? "";
    const response = await fetch(`${endpoint}/api/${resource}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(
                `${store.credentials.username}:${store.credentials.password}`,
            )}`,
        },
        body: JSON.stringify({ params }),
    });
    const body = await response.json();
    if (body.error) {
        throw new Error(body.error.message);
    }
    return body.result;
}

export function reload(
    resource: string,
    params: unknown[] = [],
    data?: unknown,
) {
    mutate([resource, params], data);
}

export function useApi<T = unknown>(resource: string, params: unknown[] = []) {
    const { data } = useSWR([resource, params], fetcher, { suspense: true });
    return data as T;
}

export function useAccounts() {
    return useApi<string[]>("Accounts");
}

export function reloadAccounts() {
    reload("Accounts");
}

export async function createAccount(username: string, address: string) {
    await api("AccountAdd", [username, address]);
}

export async function deleteAccount(username: string) {
    await api("AccountRemove", [username]);
}

export function useAccount(username: string) {
    return useApi<Account>("Account", [username]);
}

export function useDomains() {
    return useApi<Domain[]>("Domains");
}

export function reloadDomains() {
    reload("Domains");
}

export async function createDomain(domain: string, username: string) {
    await api("DomainAdd", [domain, username, ""]);
}

export function useDomainLocalparts(domain: string) {
    return useApi<Record<string, string>>("DomainLocalparts", [domain]);
}

export function reloadDomainLocalparts(domain: string) {
    reload("DomainLocalparts", [domain]);
}

export function useWebServerConfig() {
    return useApi<WebServerConfig>("WebserverConfig");
}

export function reloadWebServerConfig() {
    reload("WebserverConfig");
}

function generateWebDomainRedirects(modify?: { from: string; to?: string }) {
    let modifyWasPresent = false;
    const redirects =
        store.webServerConfig?.WebDNSDomainRedirects.map(([from, to]) => {
            if (from.ASCII === modify?.from) {
                modifyWasPresent = true;
                return [from.ASCII, modify?.to];
            }
            return [from.ASCII, to.ASCII];
        }) ?? [];
    if (modify && !modifyWasPresent) {
        redirects.push([modify?.from, modify?.to]);
    }
    return redirects;
}

export async function saveRedirect(redirect: { from: string; to?: string }) {
    const params = [
        store.webServerConfig,
        {
            WebDomainRedirects: generateWebDomainRedirects(redirect),
            WebHandlers: [],
        },
    ];
    await api("WebserverConfigSave", params);
}

export async function saveHandler(handler: WebHandler) {
    if (store.webServerConfig) {
        const params = [
            store.webServerConfig,
            {
                WebDomainRedirects: generateWebDomainRedirects(),
                WebHandlers: JSON.parse(
                    JSON.stringify(store.webServerConfig.WebHandlers),
                ),
            },
        ];
        if (handler.Name) {
            // XXX: This presumes the Name field is always the index.  In current mox app, it can be the log name.
            params[1].WebHandlers[Number(handler.Name)] = handler;
        } else {
            params[1].WebHandlers.push(handler);
        }
        const result = await api("WebserverConfigSave", params);
        reload("WebserverConfig", [], result);
    }
}

export async function createEmail(username: string, address: string) {
    await api("AddressAdd", [address, username]);
}

export async function deleteEmail(address: string) {
    await api("AddressRemove", [address]);
}

export function reloadAccount(username: string) {
    reload("Account", [username]);
}

export async function setPassword(username: string, password: string) {
    await api("SetPassword", [username, password]);
}
