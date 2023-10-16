import { proxy, useSnapshot } from "valtio";

export type Credentials = {
    username: string;
    password: string;
};

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

type Store = {
    credentials: Credentials;
    webServerConfig: WebServerConfig | null;
    accounts: Record<string, Account | null>;
};

export const store = proxy<Store>({
    credentials: {
        username: import.meta.env.VITE_USERNAME ?? "",
        password: import.meta.env.VITE_PASSWORD ?? "",
    },
    webServerConfig: null,
    accounts: {},
});

declare global {
    interface Window {
        store: Store;
    }
}

window.store = store;

export function useSnap() {
    return useSnapshot(store);
}
