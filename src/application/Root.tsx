import { Box, Header, Text, TextInput } from "@primer/react";
import { MoxieNavLayout } from "~/components/MoxieNavLayout";
import { useSnap } from "../lib/store";
import { Redirects } from "./Redirects";
import { Accounts } from "./accounts/Accounts";
import { Domains } from "./domains/Domains";

export function Root() {
    const snap = useSnap();

    return (
        <Box className="flex flex-col h-screen">
            <Header className="flex justify-between">
                <Text fontSize={5}>Moxie</Text>
                <Box className="flex gap-2">
                    <TextInput
                        placeholder="Username"
                        defaultValue={snap.credentials.username}
                    />
                    <TextInput
                        placeholder="Password"
                        type="password"
                        defaultValue={snap.credentials.password}
                    />
                </Box>
            </Header>
            <Box className="m-3 flex-grow overflow-auto">
                <MoxieNavLayout>
                    <MoxieNavLayout.Item id="accounts" label="Account">
                        <Accounts />
                    </MoxieNavLayout.Item>
                    <MoxieNavLayout.Item id="domains" label="Domains">
                        <Domains />
                    </MoxieNavLayout.Item>
                    <MoxieNavLayout.Item id="redirects" label="Redirects">
                        <Redirects />
                    </MoxieNavLayout.Item>
                </MoxieNavLayout>
            </Box>
        </Box>
    );
}
