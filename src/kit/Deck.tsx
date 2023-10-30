import { Component, JSX } from "solid-js";
import { Routable, useHistory } from "./History";

type DeckItem = Routable & {
    view: () => JSX.Element;
};

export const Deck: Component<{
    items: DeckItem[];
}> = (props) => {
    const history = useHistory();
    const item = history.matchRoute(props.items);
    return <>{item().view()}</>;
};