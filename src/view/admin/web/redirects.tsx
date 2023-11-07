import { Component, Show, createEffect } from "solid-js";
import { Associative } from "~/kit/associative";
import { Box } from "~/kit/box";
import { createForm } from "~/kit/form";
import { useToast } from "~/kit/toast";
import { saveRedirects, useWebServerConfig } from "~/lib/api/admin";
import { object, record, string } from "~/lib/schema";

export const Redirects: Component = () => {
    const webServerConfig = useWebServerConfig();
    const toast = useToast();

    const form = createForm({
        schema: object({ redirects: record(string()) }),
        initialValue: {
            redirects: {} as Record<string, string>, // XXX: <--- that typecast should not be needed
        },
        onSubmit: async () => {
            const { error } = await saveRedirects(form.value.redirects);
            if (error) {
                toast("danger", error.split(":").pop()!);
            } else {
                toast("success", "Redirects saved");
            }
        },
    });

    createEffect(() => {
        if (webServerConfig.latest?.WebDNSDomainRedirects) {
            form.value.redirects =
                webServerConfig.latest.WebDNSDomainRedirects.reduce(
                    (prev: Record<string, string>, [from, to]) => {
                        prev[from.ASCII] = to.ASCII;
                        return prev;
                    },
                    {},
                );
        }
    });

    async function handleSubmit(from: string, to: string) {
        const { error } = await saveRedirects({
            ...form.value.redirects,
            [from]: to,
        });
        if (error) {
            toast("danger", error.split(":").pop()!);
        }
    }

    function handleChange(from: string, to: string) {
        form.value.redirects[from] = to;
    }

    async function handleDelete(from: string) {
        delete form.value.redirects[from];
        const { error } = await saveRedirects(form.value.redirects);
        if (error) {
            toast("danger", error.split(":").pop()!);
        }
    }

    return (
        <form.Form>
            <Associative
                name="redirects"
                keyPlaceholder="from"
                valuePlaceholder="to"
                submitLabel="Add redirect"
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                onChange={handleChange}
            />
            <Show when={form.message}>
                <Box variant="danger">{form.message}</Box>
            </Show>
            <button>Save redirects</button>
        </form.Form>
    );
};
