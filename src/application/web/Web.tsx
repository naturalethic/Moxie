import { MoxieNavLayout } from "~/components/MoxieNavLayout";
import { Handlers } from "./Handlers";
import { Redirects } from "./Redirects";

export function Web() {
    return (
        <MoxieNavLayout>
            <MoxieNavLayout.Item id="handlers" label="Handlers">
                <Handlers />
            </MoxieNavLayout.Item>
            <MoxieNavLayout.Item id="redirects" label="Redirects">
                <Redirects />
            </MoxieNavLayout.Item>
        </MoxieNavLayout>
    );
}
