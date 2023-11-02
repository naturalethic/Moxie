import {
    ParentComponent,
    createContext,
    createSignal,
    onCleanup,
    onMount,
    splitProps,
    useContext,
} from "solid-js";

export type Routable = {
    route: string;
};

type History = {
    route: string;
    matchRoute<R extends Routable>(routables: R[]): () => R | undefined;
    push(route: string): void;
};

const HistoryContext = createContext();

export function useHistory() {
    return useContext(HistoryContext) as History;
}

export const History: ParentComponent = (props) => {
    const [route, setRoute] = createSignal(location.pathname);
    const value = {
        route,
        matchRoute<R extends Routable>(routables: R[]) {
            return () => {
                // XXX: Presuming the user orders their routes in increasing depth,
                //      search backwards through them.
                for (let i = routables.length - 1; i >= 0; i--) {
                    if (route().startsWith(routables[i].route)) {
                        return routables[i];
                    }
                }
                if (routables.length > 0) {
                    history.replaceState(null, "", routables[0].route);
                    return routables[0];
                }
            };
        },
        push(route: string) {
            history.pushState(null, "", route);
            setRoute(route);
        },
    };

    function handlePopState() {
        setRoute(location.pathname);
    }

    onMount(() => {
        window.addEventListener("popstate", handlePopState);
    });

    onCleanup(() => {
        window.removeEventListener("popstate", handlePopState);
    });

    return (
        <HistoryContext.Provider value={value}>
            {props.children}
        </HistoryContext.Provider>
    );
};

export const Link: ParentComponent<{
    href?: string;
    route?: string;
}> = (props) => {
    const [, anchorProps] = splitProps(props, ["route"]);
    const history = useHistory();

    function handleClick(event: MouseEvent) {
        event.preventDefault();
        history.push(props.route!);
    }

    return (
        <a {...anchorProps} onClick={props.route ? handleClick : undefined} />
    );
};
