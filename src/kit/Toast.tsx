import { ParentComponent, createContext, useContext } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { cls } from "~/lib/util";
import { Box } from "./Box";

type State = {
    active?: boolean;
    variant?: "danger" | "attention" | "success";
    message?: string;
};

type ContextData = [get: State, set: SetStoreFunction<State>];
const Context = createContext<ContextData>([] as unknown as ContextData);

export function useToast() {
    const [, setState] = useContext(Context);
    return function (
        variant: "danger" | "attention" | "success",
        message: string,
    ) {
        setState("active", true);
        setState("variant", variant);
        setState("message", message);
        setTimeout(() => {
            setState("active", false);
        }, 3000);
    };
}

export const Toast: ParentComponent = (props) => {
    const [state, setState] = createStore<State>({});
    const value = [state, setState] as ContextData;
    return (
        <div>
            <Context.Provider value={value}>{props.children}</Context.Provider>
            <Box
                class={cls("toast", { active: state.active })}
                variant={state.variant}
                onClick={() => {
                    setState("active", false);
                }}
            >
                {state.message}
            </Box>
        </div>
    );
};
