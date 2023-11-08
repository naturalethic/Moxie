/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{ts,tsx}"],
    plugins: [],
    theme: {
        extend: {
            colors: {
                border: {
                    DEFAULT: "var(--color-border)",
                    muted: "var(--color-border-muted)",
                    subtle: "var(--color-border-subtle)",
                },
                neutral: {
                    DEFAULT: "var(--color-neutral)",
                    emphasis: "var(--color-neutral-emphasis)",
                    muted: "var(--color-neutral-muted)",
                    subtle: "var(--color-neutral-subtle)",
                },
                accent: {
                    DEFAULT: "var(--color-accent)",
                    emphasis: "var(--color-accent-emphasis)",
                    muted: "var(--color-accent-muted)",
                    semimuted: "var(--color-accent-semimuted)",
                    subtle: "var(--color-accent-subtle)",
                },
                attention: {
                    DEFAULT: "var(--color-attention)",
                    emphasis: "var(--color-attention-emphasis)",
                    muted: "var(--color-attention-muted)",
                    subtle: "var(--color-attention-subtle)",
                },
                danger: {
                    DEFAULT: "var(--color-danger)",
                    emphasis: "var(--color-danger-emphasis)",
                    muted: "var(--color-danger-muted)",
                    subtle: "var(--color-danger-subtle)",
                },
                success: {
                    DEFAULT: "var(--color-success)",
                    emphasis: "var(--color-success-emphasis)",
                    muted: "var(--color-success-muted)",
                    subtle: "var(--color-success-subtle)",
                },
            },
        },
    },
};
