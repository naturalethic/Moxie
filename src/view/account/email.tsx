import { Component } from "solid-js";
import { Box } from "~/kit/box";
import { createForm } from "~/kit/form";
import { TextInput } from "~/kit/input";
import { Label } from "~/kit/label";
import { array, boolean, object, record, string } from "~/lib/schema";

export const Email: Component<{
    address: string;
    defaultName: string;
    name: string;
    mailbox: string;
}> = (props) => {
    const form = createForm({
        schema: object({
            FullName: string(),
            Mailbox: string(),
            Rulesets: array(
                object({
                    SMTPMailFromRegexp: string(),
                    VerifiedDomain: string(),
                    HeadersRegexp: record(string()),
                    IsForward: boolean(),
                    ListAllowDomain: string(),
                    AcceptRejectsToMailbox: string(),
                    Mailbox: string(),
                }),
            ),
        }),
        prototype: {
            FullName: "",
            Mailbox: "",
            Rulesets: [],
        },
    });
    return (
        <Box shaded class="p-4 w-full h-full">
            <form.Form>
                <TextInput
                    label="Email address"
                    value={props.address}
                    disabled
                />
                <div class="grid grid-cols-2 gap-2">
                    <TextInput
                        name="name"
                        label="Full name"
                        placeholder={props.defaultName}
                    />
                    <TextInput
                        name="mailbox"
                        label="Default mailbox"
                        placeholder="Inbox"
                    />
                </div>
                <div>
                    <Label label="Rulesets" />
                </div>
            </form.Form>
        </Box>
    );
};

// const EmailRuleset: Component<{ ruleset: Ruleset }> = (props) => {
//     return (
//         <Box shaded class="p-4 w-full h-full">
//             <Associative />
//         </Box>
//     );
// };
