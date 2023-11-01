import { Component } from "solid-js";
import { custom, object, string } from "valibot";
import { Box } from "~/kit/box";
import { createForm } from "~/kit/form";
import { TextInput } from "~/kit/input";
import { useToast } from "~/kit/toast";
import { reloadAccount, saveFullName, useAccount } from "~/lib/api/account";

export const Account: Component = (props) => {
    const account = useAccount();
    const toast = useToast();
    const form = createForm({
        schema: object({
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
                name: account.latest?.FullName,
            };
        },
        onSubmit: async ({ success }) => {
            if (success) {
                await saveFullName(form.value.name);
                toast("success", "Full name saved");
                reloadAccount();
            }
        },
    });

    return (
        <div>
            <pre>{JSON.stringify(account.latest, null, 4)}</pre>
            <div class="flex justify-center">
                <Box>
                    Default domain: {account.latest?.Domain.ASCII ?? "None"}
                </Box>
                <Box shaded class="p-4 w-64">
                    <form.Form>
                        <TextInput name="name" label="Full name" />
                        <TextInput name="password" label="Change Password" />
                        <button>Save</button>
                    </form.Form>
                </Box>
            </div>
        </div>
    );
};
