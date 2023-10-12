import { BaseStyles, ThemeProvider } from "@primer/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { SWRConfig } from "swr";
import "./index.css";
import { fetcher, middleware } from "./lib/api";

const router = createHashRouter([
    {
        path: "/",
        lazy: () => import("./routes/root"),
        children: [
            {
                path: "accounts",
                lazy: () => import("./routes/accounts"),
                children: [
                    {
                        path: ":username",
                        lazy: () => import("./routes/accounts/account"),
                    },
                ],
            },
            {
                path: "domains",
                lazy: () => import("./routes/domains"),
                children: [
                    {
                        path: ":name",
                        lazy: () => import("./routes/domains/domain"),
                    },
                ],
            },
            {
                path: "redirects",
                lazy: () => import("./routes/redirects"),
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <SWRConfig value={{ fetcher, use: [middleware] }}>
            <ThemeProvider>
                <BaseStyles>
                    <RouterProvider router={router} />
                </BaseStyles>
            </ThemeProvider>
        </SWRConfig>
    </React.StrictMode>,
);
