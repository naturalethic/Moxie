import {
    Accessor,
    For,
    ParentComponent,
    Setter,
    createContext,
    createSignal,
    useContext,
} from "solid-js";
import { cls } from "~/lib/util";
import { Box } from "./box";

export const ToastLab = null;

type State = {
    active: boolean;
    variant: "danger" | "attention" | "success";
    message: string | string[];
};

type ContextData = [Accessor<State>, Setter<State>];
const ToastContext = createContext<ContextData>([] as unknown as ContextData);

export function useToast() {
    const [state, setState] = useContext(ToastContext);
    return function (
        variant: "danger" | "attention" | "success",
        message: string | string[],
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
    const [state, setState] = createSignal<State>({
        active: false,
        variant: "success",
        message: "",
    });
    const value = [state, setState] as ContextData;
    return (
        <ToastContext.Provider value={value}>
            {props.children}
            <Box
                class={cls("toast", { active: state().active })}
                variant={state().variant}
                onClick={() => {
                    setState({ ...state(), active: false });
                }}
            >
                <For
                    each={
                        Array.isArray(state().message)
                            ? (state().message as string[])
                            : [state().message as string]
                    }
                >
                    {(message) => <p>{message}</p>}
                </For>
            </Box>
        </ToastContext.Provider>
    );
};
