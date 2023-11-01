import { Component, createSignal } from "solid-js";
import { custom, object, string } from "valibot";
import { Box } from "~/kit/box";
import { createForm } from "~/kit/form";
import { FileInput, TextInput } from "~/kit/input";
import { Select } from "~/kit/select";
import { useToast } from "~/kit/toast";
import {
    credentials,
    reloadAccount,
    updateFullName,
    updatePassword,
    useAccount,
} from "~/lib/api/account";

export const Account: Component = () => {
    const account = useAccount();
    const toast = useToast();
    const form = createForm({
        schema: object({
            domain: string(),
            name: string(),
            password: string([
                custom(
                    (value) => value.length === 0 || value.length >= 8,
                    "Minium 8 characters",
                ),
            ]),
        }),
        initialValueEffect: () => {
            return {
                domain: account.latest?.Domain.ASCII || "(none)",
                name: account.latest?.FullName,
            };
        },
        onSubmit: async ({ success }) => {
            if (success) {
                const message = [];
                if (form.value.name !== form.initialValue.name) {
                    await updateFullName(form.value.name);
                    message.push("Full name updated");
                }
                if (form.value.password.length > 0) {
                    await updatePassword(form.value.password);
                    message.push("Password updated");
                    form.value.password = "";
                }
                if (message.length > 0) {
                    toast("success", message);
                    reloadAccount();
                }
            }
        },
    });

    let importStripInput: HTMLInputElement;
    const [importFile, setImportFile] = createSignal<File | undefined>();

    async function handleClickImport() {
        // XXX: Incorporate file uploading into the normal api framework.
        if (!importFile()) return;
        const body = new FormData();
        body.append("file", importFile()!);
        body.append("stripMailboxPrefix", importStripInput.value);
        const response = await fetch("/mox/account/import", {
            method: "POST",
            headers: {
                Authorization: `Basic ${btoa(
                    `${credentials.username()}:${credentials.password()}`,
                )}`,
            },
            body,
        });
        console.log(response);
    }

    let exportLink: HTMLAnchorElement;
    let exportFormatSelect: HTMLSelectElement;
    let exportCompressionSelect: HTMLSelectElement;

    function handleClickExport() {
        const url = new URL(window.location.href);
        url.username = credentials.username();
        url.password = credentials.password();
        url.pathname = `/mox/account/mail-export-${exportFormatSelect.value}.${exportCompressionSelect.value}`;
        exportLink.href = url.toString();
        exportLink.click();
        exportLink.href = "";
    }

    return (
        <div class="pt-8">
            {/* <pre>{JSON.stringify(account.latest, null, 4)}</pre> */}
            <div class="flex justify-center gap-4">
                <div class="flex flex-col gap-4">
                    <Box shaded contentClass="p-4 w-64" title="Settings">
                        <form.Form>
                            <TextInput name="name" label="Full name" />
                            <TextInput name="password" label="New Password" />
                            <button>Save</button>
                        </form.Form>
                    </Box>
                    <Box
                        shaded
                        title="Import"
                        contentClass="p-4 w-64 flex flex-col gap-2"
                    >
                        <div class="text-xs">
                            Import messages from a .zip or .tgz file with
                            maildirs and/or mbox files.
                        </div>
                        <FileInput
                            name="file"
                            accept=".zip,.tgz"
                            onChange={setImportFile}
                        />
                        <TextInput
                            ref={importStripInput!}
                            name="strip"
                            label="Strip path prefix"
                            placeholder="folder/"
                            tip='If set, any mbox/maildir path with this prefix will have it stripped before importing. For example, if all mailboxes are in a directory "Takeout", specify that path in the field above so mailboxes like "Takeout/Inbox.mbox" are imported into a mailbox called "Inbox" instead of "Takeout/Inbox".'
                        />
                        <button type="button" onClick={handleClickImport}>
                            Import
                        </button>
                    </Box>
                    <Box
                        shaded
                        contentClass="p-4 w-64 flex flex-col gap-2"
                        title="Export"
                    >
                        <div class="grid grid-cols-2 gap-1">
                            <Select
                                ref={exportFormatSelect!}
                                options={["mbox", "maildir"]}
                                label="Format"
                            />
                            <Select
                                ref={exportCompressionSelect!}
                                options={["zip", "tgz"]}
                                label="Compression"
                            />
                        </div>
                        <button class="w-full" onClick={handleClickExport}>
                            Export
                        </button>
                        <a ref={exportLink!} class="hidden" />
                    </Box>
                </div>
            </div>
        </div>
    );
};
