import { Component } from "solid-js";
import { Box } from "~/kit/Box";
import { Icon } from "~/kit/Icon";
import { useToast } from "~/kit/Toast";
import { useDomainRecords } from "~/lib/api";

export const Records: Component<{ domain: string }> = (props) => {
    const records = useDomainRecords(props.domain);
    const toast = useToast();

    function handleClickCopy() {
        navigator.clipboard.writeText(records.latest.join("\n"));
        toast("success", "Copied to clipboard");
    }

    return (
        <Box class="p-2 space-y-3" shaded>
            <button class="flex gap-1 py-2 px-3" onClick={handleClickCopy}>
                <Icon name="copy" class="h-5" />
                Copy to clipboard
            </button>
            <pre class="text-xs overflow-auto">{records.latest.join("\n")}</pre>
        </Box>
    );
};
