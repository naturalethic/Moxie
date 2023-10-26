import { zxcvbn } from "@zxcvbn-ts/core";
import { Component, createSignal } from "solid-js";
import { minLength, object, string } from "valibot";
import { Box } from "~/kit/Box";
import { Defcon } from "~/kit/Defcon";
import { createForm } from "~/kit/Form";
import { TextInput } from "~/kit/TextInput";
import { setPassword } from "~/lib/api";

export const Password: Component<{ username: string }> = (props) => {
    const { form, Form, resetForm, setError } = createForm(
        object({
            password: string([minLength(8, "8 chars minimum")]),
        }),
        { password: "" },
        async () => {
            const { error } = await setPassword(props.username, form.password);
            if (error) {
                setError("password", error.split(":")[1]);
            } else {
                resetForm();
            }
        },
    );

    const [complexity, setComplexity] = createSignal(0);

    function checkComplexity(value: string) {
        if (value.length === 0) {
            setComplexity(0);
            return;
        }
        setComplexity(zxcvbn(value).score + 1);
    }

    return (
        <Form>
            <Box variant="attention">
                Bots will try to bruteforce your password. Connections with
                failed authentication attempts will be rate limited but
                attackers WILL find weak passwords. If your account is
                compromised, spammers are likely to abuse your system, spamming
                your address and the wider internet in your name. So please pick
                a random, unguessable password, preferrably at least 12
                characters.
            </Box>
            <TextInput
                name="password"
                label="Password"
                onChange={checkComplexity}
            />
            <Defcon complexity={complexity()} />
            <button>Update password</button>
        </Form>
    );
};
