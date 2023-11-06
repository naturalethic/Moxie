import {
    ParentComponent,
    createContext,
    createEffect,
    createSignal,
} from "solid-js";
import { createMutable, modifyMutable, produce, unwrap } from "solid-js/store";
import { Infer, Schema } from "~/lib/schema";
// import { BaseSchema, Input, SafeParseResult, safeParse } from "valibot";
// import { setPath } from "~/lib/util";

type Form = ParentComponent<{ class?: string }>;
type FormData = Record<string, unknown>;
type FormError = Record<string, string | undefined>;

type FormContext =
    | {
          value: FormData;
          error: FormError;
      }
    | undefined;

export const FormContext = createContext<FormContext>();

type CreateForm<S extends Schema<"object">, V extends Partial<Infer<S>>> = {
    Form: Form;
    value: V;
    initialValue: V;
    error: FormError;
    reset: () => void;
    set message(message: string);
    get message(): string;
};

export function createForm<
    S extends Schema<"object">,
    V extends Partial<Infer<S>>,
>(options: {
    schema: S;
    initialValue?: V;
    initialValueEffect?: () => V;
    onSubmit?: (result: { success: boolean; value: V }) => void;
}): CreateForm<S, V> {
    const { /* schema , */ onSubmit } = options;
    const initialValue = options.initialValue ?? ({} as V);

    const value = createMutable<V>(structuredClone(unwrap(initialValue)));
    const error = createMutable<FormError>({});
    const [message, setMessage] = createSignal("");

    if (options.initialValueEffect) {
        createEffect(() => {
            const effectValue = options.initialValueEffect!();
            modifyMutable(
                value,
                produce((value) => {
                    for (const key in effectValue) {
                        initialValue[key] = effectValue[key]!;
                        value[key] = effectValue[key]!;
                    }
                }),
            );
        });
    }

    function reset() {
        if (Object.keys(initialValue).length === 0) {
            console.warn(
                "Called form.reset() when no initial data was provided",
            );
            return;
        }
        modifyMutable(
            value,
            produce((value) => {
                for (const key in initialValue) {
                    value[key] = initialValue[key]!;
                }
            }),
        );
    }

    const Form: Form = (props) => {
        function handleSubmit(event: SubmitEvent) {
            event.preventDefault();
            onSubmit?.({ success: true, value });
            // const result = safeParse(schema, value);
            // if (!result.success) {
            //     for (const issue of result.issues) {
            //         if (issue.path) {
            //             const path = issue.path.map((p) => p.key);
            //             setPath(error, path, issue.message);
            //         }
            //     }
            // }
            // onSubmit?.(result);
        }

        return (
            <FormContext.Provider
                value={{
                    value,
                    error,
                }}
            >
                <form onSubmit={handleSubmit} class={props.class}>
                    <input type="submit" style="display: none" />
                    {props.children}
                </form>
            </FormContext.Provider>
        );
    };
    return {
        Form,
        value,
        initialValue,
        error,
        reset,
        set message(value: string) {
            setMessage(value);
        },
        get message() {
            return message();
        },
    };
}
