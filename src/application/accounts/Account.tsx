import { MoxieNavLayout } from "~/components/MoxieNavLayout";
import { Delete } from "./Delete";
import { Emails } from "./Emails";
import { New } from "./New";
import { Password } from "./Password";

export function Account({ username }: { username?: string }) {
    if (!username) {
        return (
            <MoxieNavLayout key="new">
                <MoxieNavLayout.Item id="new" label="New account details">
                    <New />
                </MoxieNavLayout.Item>
            </MoxieNavLayout>
        );
    }
    return (
        <MoxieNavLayout>
            <MoxieNavLayout.Item id="emails" label="Emails">
                <Emails username={username} />
            </MoxieNavLayout.Item>
            <MoxieNavLayout.Item id="password" label="Password">
                <Password username={username} />
            </MoxieNavLayout.Item>
            <MoxieNavLayout.Item id="delete" label="Delete">
                <Delete username={username} />
            </MoxieNavLayout.Item>
        </MoxieNavLayout>
    );
}
