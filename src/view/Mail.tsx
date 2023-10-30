import { Component } from "solid-js";
import { Box } from "~/kit/Box";
import { Deck } from "~/kit/Deck";
import { Link } from "~/kit/History";

export const Mail: Component = () => {
    return (
        <div>
            <div>Mail</div>
            <div class="flex gap-4">
                <Link route="/mail/inbox">Inbox</Link>
                <Link route="/mail/outbox">Outbox</Link>
            </div>
            <Box shaded class="p-4">
                <Deck
                    items={[
                        { route: "/mail/inbox", view: () => <div>Inbox</div> },
                        {
                            route: "/mail/outbox",
                            view: () => <div>Outbox</div>,
                        },
                    ]}
                />
            </Box>
        </div>
    );
};
