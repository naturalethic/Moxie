import {
    ParentComponent,
    createContext,
    createEffect,
    createSignal,
    useContext,
} from "solid-js";
import { createMutable, modifyMutable, reconcile } from "solid-js/store";
import { Infer, ObjectEntries, ObjectSchema } from "~/lib/schema";
import { ValidationError, validate } from "~/lib/validation";
import { getPath, setPath } from "./util";

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

export function useForm() {
    return useContext(FormContext);
}

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
        modifyMutable(value, reconcile({}));
    }

    const Form: Form = (props) => {
        function handleSubmit(event: SubmitEvent) {
            event.preventDefault();
            onSubmit?.({ success: validate(schema, value, error) });
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

// XXX: Not a very good name for this function.
//      This function is meant to provide a deep mutable from a form to a component, or
//      a non-form local mutable.
export function formDefault<T extends object>(
    form: FormContext | undefined,
    name: string | undefined,
    value: T | undefined,
    fallback: T,
) {
    const mutable =
        form && name
            ? getPath<T>(form.value, name) ?? fallback
            : createMutable<T>(value ?? fallback);

    if (name && form) {
        if (!getPath(form.value, name)) {
            setPath(form.value, name, mutable);
        }
    }

    return mutable;
}
