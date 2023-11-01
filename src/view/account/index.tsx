import { Component } from "solid-js";
import { custom, object, string } from "valibot";
import { Box } from "~/kit/box";
import { createForm } from "~/kit/form";
import { TextInput } from "~/kit/input";
import { useToast } from "~/kit/toast";
import {
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

    return (
        <div>
            <pre>{JSON.stringify(account.latest, null, 4)}</pre>
            <div class="flex justify-center gap-4">
                <Box shaded class="p-4 w-64">
                    <form.Form>
                        <TextInput
                            name="domain"
                            label="Default domain"
                            disabled
                        />
                        <TextInput name="name" label="Full name" />
                        <TextInput name="password" label="New Password" />
                        <button>Save</button>
                    </form.Form>
                </Box>
            </div>
        </div>
    );
};
