import {
    InitializedResourceReturn,
    ResourceReturn,
    createResource,
} from "solid-js";

export async function api<T>(
    username: string,
    password: string,
    path: string,
    params: unknown[] = [],
) {
    const endpoint = import.meta.env.VITE_MOX_ENDPOINT ?? "/mox";
    const url = `${endpoint}${path}`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
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
    username: string,
    password: string,
    path: string,
    params: unknown[] = [],
): Promise<{ result?: T; error?: string }> {
    try {
        return {
            result: await api<T>(username, password, path, params),
        };
    } catch (error) {
        return {
            error: (error as Error).message,
        };
    }
}

const resourceCache: Record<string, unknown> = {};

type Transform<T, F> = (data: F) => T;

function apiResource<T, F>(
    username: string,
    password: string,
    path: string,
    params: unknown[],
    initialValue: T,
    transform?: Transform<T, F>,
): InitializedResourceReturn<T>;

function apiResource<T, F>(
    username: string,
    password: string,
    path: string,
    params: unknown[],
    initialValue?: T,
    transform?: Transform<T, F>,
): ResourceReturn<T>;

function apiResource<T, F>(
    username: string,
    password: string,
    path: string,
    params: unknown[] = [],
    initialValue?: T,
    transform?: Transform<T, F>,
): ResourceReturn<T> | InitializedResourceReturn<T> {
    const key = `${path}:${JSON.stringify(params)}`;
    if (!resourceCache[key]) {
        resourceCache[key] = createResource<T>(
            async () => {
                const result = await api<T>(username, password, path, params);
                if (transform) {
                    return transform(result as F);
                }
                return result;
            },
            {
                initialValue,
            },
        );
    }
    return resourceCache[key] as
        | ResourceReturn<T>
        | InitializedResourceReturn<T>;
}

class ApiFunctions {
    constructor(
        private username: () => string,
        private password: () => string,
        private path: string,
    ) {}
    api<T>(resource: string, params: unknown[]): Promise<T> {
        return api<T>(
            this.username(),
            this.password(),
            `${this.path}/${resource}`,
            params,
        );
    }
    safeApi<T>(
        resource: string,
        params: unknown[],
    ): Promise<{ result?: T; error?: string }> {
        return safeApi<T>(
            this.username(),
            this.password(),
            `${this.path}/${resource}`,
            params,
        );
    }
    reload(resource: string, params?: unknown[], data?: unknown): void {
        const [, { refetch, mutate }] = apiResource(
            this.username(),
            this.password(),
            `${this.path}/${resource}`,
            params ?? [],
        );
        if (data) {
            mutate(data);
        } else {
            refetch();
        }
    }
    apiResource<T, F = undefined>(options: {
        resource: string;
        params?: unknown[];
        initialValue: T;
        transform?: Transform<T, F>;
    }): InitializedResourceReturn<T>;
    apiResource<T, F = undefined>(options: {
        resource: string;
        params?: unknown[];
        initialValue?: T;
        transform?: Transform<T, F>;
    }): ResourceReturn<T>;
    apiResource<T, F = undefined>(options: {
        resource: string;
        params?: unknown[];
        initialValue?: T;
        transform?: Transform<T, F>;
    }): ResourceReturn<T> | InitializedResourceReturn<T> {
        console.log(this);
        return apiResource<T, F>(
            this.username(),
            this.password(),
            `${this.path}/${options.resource}`,
            options.params ?? [],
            options.initialValue,
            options.transform,
        );
    }
}

export function apiFunctions(
    username: () => string,
    password: () => string,
    path: string,
): ApiFunctions {
    const api = new ApiFunctions(username, password, path);
    return {
        api: api.api.bind(api),
        safeApi: api.safeApi.bind(api),
        reload: api.reload.bind(api),
        apiResource: api.apiResource.bind(api),
    } as ApiFunctions;
}

export type Domain = {
    ASCII: string;
    Unicode: string;
};
