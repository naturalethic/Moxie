import { Component } from "solid-js";
import { minLength, object, string } from "valibot";
import { Box } from "~/kit/box";
import { createForm } from "~/kit/form";
import { TextInput } from "~/kit/input";
import { setPassword } from "~/lib/api/admin";

export const Password: Component<{ username: string }> = (props) => {
    const form = createForm({
        schema: object({
            password: string([minLength(8, "8 chars minimum")]),
        }),
        initialValue: { password: "" },
        onSubmit: async () => {
            const { error } = await setPassword(
                props.username,
                form.value.password,
            );
            if (error) {
                form.error.password = error.split(":")[1];
            } else {
                form.reset();
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
