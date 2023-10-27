import {
    Accessor,
    ParentComponent,
    Setter,
    createContext,
    createSignal,
    useContext,
} from "solid-js";
import { cls } from "~/lib/util";
import { Box } from "./Box";

type State = {
    active?: boolean;
    variant?: "danger" | "attention" | "success";
    message?: string;
};

type ContextData = [Accessor<State>, Setter<State>];
const Context = createContext<ContextData>([] as unknown as ContextData);

export function useToast() {
    const [state, setState] = useContext(Context);
    return function (
        variant: "danger" | "attention" | "success",
        message: string,
    ) {
        setState({ active: true, variant, message });
        // XXX: Rapid invocations of toast will cause goofiness.  Need to store and
        //      cancel extant timeouts, or do some kind of queueing.
        setTimeout(() => {
            setState({ ...state(), active: false });
        }, 3000);
    };
}

export const Toast: ParentComponent = (props) => {
    const [state, setState] = createSignal<State>({});
    const value = [state, setState] as ContextData;
    return (
        <div>
            <Context.Provider value={value}>{props.children}</Context.Provider>
            <Box
                class={cls("toast", { active: state().active })}
                variant={state().variant}
                onClick={() => {
                    setState({ ...state(), active: false });
                }}
            >
                {state().message}
            </Box>
        </div>
    );
};
