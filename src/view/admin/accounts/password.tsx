import { Component } from "solid-js";
import { Box } from "~/kit/box";
import { createForm } from "~/kit/form";
import { TextInput } from "~/kit/text-input";
import { useToast } from "~/kit/toast";
import { setPassword } from "~/lib/api/admin";
import { object, string } from "~/lib/schema";
import { min } from "~/lib/validation";

export const Password: Component<{ username: string }> = (props) => {
    const toast = useToast();
    const form = createForm({
        schema: object({
            password: string([min(8, "8 chars minimum")]),
        }),
        prototype: { password: "" },
        onSubmit: async ({ success }) => {
            if (success) {
                const { error } = await setPassword(
                    props.username,
                    form.value.password!,
                );
                if (error) {
                    form.error.password = error;
                } else {
                    toast("success", "Password updated");
                    form.reset();
                }
            }
        },
    });

    return (
        <form.Form>
            <Box variant="attention">
                Bots will try to bruteforce your password. Connections with
                failed authentication attempts will be rate limited but
                attackers WILL find weak passwords. If your account is
                compromised, spammers are likely to abuse your system, spamming
                your address and the wider internet in your name. So please pick
                a random, unguessable password, preferrably at least 12
                characters.
            </Box>
            <TextInput name="password" label="Password" />
            <button>Update password</button>
        </form.Form>
    );
};
