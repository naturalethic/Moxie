import { MoxieNavLayout } from "~/components/MoxieNavLayout";
import { Emails } from "./Emails";
import { Records } from "./Records";

export function Domain({ name }: { name: string }) {
    return (
        <MoxieNavLayout>
            <MoxieNavLayout.Item id="emails" label="Emails">
                <Emails name={name} />
            </MoxieNavLayout.Item>
            <MoxieNavLayout.Item id="records" label="DNS Records">
                <Records name={name} />
            </MoxieNavLayout.Item>
        </MoxieNavLayout>
    );
}
