import "~/index.css";

import { useArgs } from "@storybook/preview-api";
import type { Meta, StoryObj } from "storybook-solidjs";
import { Box } from "~/kit/box";

const meta = {
    title: "Example/Box",
    component: Box,
    tags: ["autodocs"],
    argTypes: {
        border: {
            control: {
                type: "boolean",
            },
        },
        shaded: {
            control: {
                type: "boolean",
            },
        },
        title: {
            control: {
                type: "text",
            },
        },
        class: {
            control: {
                type: "text",
            },
        },
        contentClass: {
            control: {
                type: "text",
            },
        },
        variant: {
            options: ["", "danger", "attention", "success"],
            control: {
                type: "select",
            },
        },
    },
    args: {
        border: false,
        shaded: false,
        contentClass: "p-4",
    },
    render: () => {
        const [args] = useArgs();
        return <Box {...args}>Lorem ipsum dolor sit amet</Box>;
    },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
