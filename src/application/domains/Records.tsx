import { CopyIcon } from "@primer/octicons-react";
import { Box, Button } from "@primer/react";
import { useState } from "react";
import { useApi } from "~/lib/api";

export function Records({ name }: { name: string }) {
    const records: string[] = useApi("DomainRecords", [name]);
    const [flash, setFlash] = useState(false);
    return (
        <Box className="space-y-4">
            <Box className="flex gap-4 items-center">
                <Button
                    leadingIcon={CopyIcon}
                    onClick={() => {
                        navigator.clipboard.writeText(records.join("\n"));
                        setFlash(true);
                        setTimeout(() => {
                            setFlash(false);
                        }, 1000);
                    }}
                >
                    Copy to clipboard
                </Button>
                <Box>{flash ? "Copied!" : ""}</Box>
            </Box>
            <pre className="text-xs">{records.join("\n")}</pre>
        </Box>
    );
}
