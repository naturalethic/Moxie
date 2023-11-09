import { Component, Show, createSignal } from "solid-js";
import { Box } from "~/kit/box";
import { Browser } from "~/kit/browser";
import { FileInput } from "~/kit/file-input";
import { Progress } from "~/kit/progress";
import { Select } from "~/kit/select";
import { TextInput } from "~/kit/text-input";
import { useToast } from "~/kit/toast";
import {
    credentials,
    reloadAccount,
    updateFullName,
    updatePassword,
    useAccount,
} from "~/lib/api/account";
import { createForm } from "~/lib/form";
import { object, string } from "~/lib/schema";
import { Email } from "./email";

export const Account: Component = () => {
    const account = useAccount();
    const toast = useToast();
    const form = createForm({
        schema: object({
            domain: string(),
            name: string(),
            password: string([
                (value: string) => {
                    if (value.length !== 0 && value.length >= 8) {
                        return "Minium 8 characters";
                    }
                },
            ]),
        }),
        prototype: {
            domain: "",
            name: "",
            password: "",
        },
        prototypeEffect: () => {
            return {
                domain: account.latest?.Domain.ASCII || "(none)",
                name: account.latest?.FullName,
            };
        },
        onSubmit: async ({ success }) => {
            if (success) {
                const message = [];
                if (form.value.name !== form.prototype.name) {
                    await updateFullName(form.value.name!);
                    message.push("Full name updated");
                }
                if (form.value.password!.length > 0) {
                    await updatePassword(form.value.password!);
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
    const [importProgress, setImportProgress] = createSignal<
        { current: number; total: number } | undefined
    >();

    let xhr: XMLHttpRequest;

    async function handleClickImport() {
        // XXX: Incorporate file uploading into the normal api framework.
        if (!importFile()) return;
        setImportProgress({
            current: 0,
            total: 0,
        });
        const body = new FormData();
        body.append("file", importFile()!);
        body.append("stripMailboxPrefix", importStripInput.value);
        xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                setImportProgress({
                    current: event.loaded,
                    total: event.total,
                });
            }
        });
        xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
                toast("success", "Messages imported");
            } else {
                toast("danger", "Import failed");
            }
            setImportProgress(undefined);
        });
        xhr.addEventListener("error", () => {
            toast("danger", "Import failed");
            setImportProgress(undefined);
        });
        xhr.addEventListener("abort", () => {
            toast("attention", "Import cancelled");
            setImportProgress(undefined);
        });
        xhr.open(
            "POST",
            "/mox/account/import",
            true,
            credentials.username(),
            credentials.password(),
        );
        xhr.send(body);
    }

    async function handleClickCancelImport() {
        xhr.abort();
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
        <div class="m-4">
            {/* <pre>{JSON.stringify(account.latest, null, 4)}</pre> */}
            <div class="flex gap-4 items-stretch">
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
                        <Show when={!importProgress()}>
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
                        </Show>
                        <Show when={importProgress()}>
                            <Box class="text-xs">
                                Importing:{" "}
                                <span class="text-accent-semimuted">
                                    {importFile()!.name}
                                </span>
                            </Box>
                            <Progress
                                current={importProgress()!.current}
                                total={importProgress()!.total}
                            />
                            <button
                                type="button"
                                onClick={handleClickCancelImport}
                            >
                                Cancel
                            </button>
                        </Show>
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
                <div class="w-full">
                    <Box
                        title="Email addresses"
                        class="h-full"
                        contentClass="pt-4 h-full"
                    >
                        <Browser
                            class="h-full"
                            contentClass="w-full"
                            items={[
                                ...Object.entries(
                                    account.latest?.Emails ?? {},
                                ).map(([address, item]) => ({
                                    route: `/account/${address}`,
                                    label: address,
                                    view: () => (
                                        <Email
                                            address={address}
                                            defaultName={
                                                account.latest?.FullName ?? ""
                                            }
                                            name={item.FullName}
                                            mailbox={item.Mailbox}
                                        />
                                    ),
                                })),
                            ]}
                        />
                    </Box>
                </div>
            </div>
        </div>
    );
};
