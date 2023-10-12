import { BaseStyles, ThemeProvider } from "@primer/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { SWRConfig } from "swr";
import { Root } from "~/application/Root";
import "./index.css";
import { fetcher, middleware } from "./lib/api";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <SWRConfig value={{ fetcher, use: [middleware] }}>
            <ThemeProvider>
                <BaseStyles>
                    <Root />
                </BaseStyles>
            </ThemeProvider>
        </SWRConfig>
    </React.StrictMode>,
);
