import { Component } from "solid-js";
import { Box } from "~/kit/box";

export const Email: Component<{ address: string }> = (props) => {
    return (
        <Box shaded class="p-4 w-full h-full">
            <h1>{props.address}</h1>
        </Box>
    );
};
