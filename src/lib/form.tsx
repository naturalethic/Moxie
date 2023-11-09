import {
    ParentComponent,
    createContext,
    createEffect,
    createSignal,
} from "solid-js";
import { createMutable, modifyMutable, reconcile } from "solid-js/store";
import { Infer, ObjectEntries, ObjectSchema } from "~/lib/schema";
import { ValidationError, validate } from "~/lib/validation";

type Form = ParentComponent<{ class?: string }>;
type FormData = { [key: string]: FormDataNode };
type FormDataNode =
    | { [key: string]: FormDataNode }
    | string
    | boolean
    | number
    | undefined;

type FormContext =
    | {
          value: FormData;
          error: ValidationError;
      }
    | undefined;

export const FormContext = createContext<FormContext>();

type CreateForm<
    E extends ObjectEntries,
    S extends ObjectSchema<E>,
    V extends Infer<S>,
> = {
    Form: Form;
    value: V;
    prototype: V;
    error: ValidationError;
    reset: () => void;
    set message(message: string);
    get message(): string;
};

export function createForm<
    E extends ObjectEntries,
    S extends ObjectSchema<E>,
    V extends Infer<S>,
>(options: {
    schema: S;
    prototype: V;
    prototypeEffect?: () => Partial<V>;
    onSubmit?: (result: { success: boolean }) => void;
}): CreateForm<E, S, V> {
    const { schema, onSubmit } = options;
    const prototype = options.prototype;
    const value = createMutable(Object.create(prototype));
    const error = createMutable<ValidationError>({});
    const [message, setMessage] = createSignal("");

    if (options.prototypeEffect) {
        createEffect(() => {
            const effectValue = options.prototypeEffect!();
            for (const key in effectValue) {
                prototype[key] = effectValue[key]!;
            }
        });
    }

    function reset() {
        // if (Object.keys(initialValue).length === 0) {
        //     console.warn(
        //         "Called form.reset() when no initial data was provided",
        //     );
        //     return;
        // }
        modifyMutable(value, reconcile({}));
        //     value,
        //     produce((value) => {
        //         for (const key in initialValue) {
        //             value[key] = initialValue[key]!;
        //         }
        //     }),
        // );
    }

    const Form: Form = (props) => {
        function handleSubmit(event: SubmitEvent) {
            event.preventDefault();
            onSubmit?.({ success: validate(schema, value, error) });
            // onSubmit?.({ success: true, value });
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
                    value: value as FormData,
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
        prototype,
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
