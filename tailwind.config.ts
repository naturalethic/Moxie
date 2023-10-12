import { omit } from "rambda";
import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    plugins: [],
    theme: {
        fontFamily: {
            // sans: ["system-ui"],
        },
        colors: {
            ...omit(
                ["lightBlue", "warmGray", "trueGray", "coolGray", "blueGray"],
                colors,
            ),
            primary: colors.emerald,
            secondary: colors.sky,
            error: colors.rose,
            success: colors.green,
            warning: colors.amber,
        },
    },
};
