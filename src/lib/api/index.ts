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
    if (initialValue) {
        return resourceCache[key] as InitializedResourceReturn<T>;
    } else {
        return resourceCache[key] as ResourceReturn<T>;
    }
}

export function apiFunctions(
    username: () => string,
    password: () => string,
    path: string,
) {
    return {
        api<T>(resource: string, params: unknown[] = []) {
            return api<T>(
                username(),
                password(),
                `${path}/${resource}`,
                params,
            );
        },
        safeApi<T>(
            resource: string,
            params: unknown[] = [],
        ): Promise<{ result?: T; error?: string }> {
            return safeApi<T>(
                username(),
                password(),
                `${path}/${resource}`,
                params,
            );
        },
        apiResource<T, F = undefined>({
            resource,
            params = [],
            initialValue,
            transform,
        }: {
            resource: string;
            params?: unknown[];
            initialValue?: T;
            transform?: Transform<T, F>;
        }) {
            return apiResource(
                username(),
                password(),
                `${path}/${resource}`,
                params,
                initialValue,
                transform,
            ) as ResourceReturn<T> | InitializedResourceReturn<T>;
        },
        reload(resource: string, params: unknown[] = [], data?: unknown) {
            const [, { refetch, mutate }] = apiResource(
                username(),
                password(),
                `${path}/${resource}`,
                params,
            );
            if (data) {
                mutate(data);
            } else {
                refetch();
            }
        },
    };
}

export type Domain = {
    ASCII: string;
    Unicode: string;
};
