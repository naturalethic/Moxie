import {
    Accessor,
    ParentComponent,
    Setter,
    createContext,
    createSignal,
} from "solid-js";
import { BaseSchema, Input, SafeParseResult, safeParse } from "valibot";
import { setPath } from "~/lib/util";

type Form = ParentComponent<{ class?: string }>;
type FormData = Record<string, unknown>;
type FormError = Record<string, string | undefined>;

export const FormContext = createContext<{
    form?: Accessor<FormData>;
    // setForm?: Setter<FormData>;
    setForm?: (path: string | string[], value: unknown) => void;
    error?: Accessor<FormError>;
    // setError?: Setter<FormError>;
    setError?: (path: string | string[], value: string | undefined) => void;
}>({});

type CreateForm<S extends BaseSchema> = {
    form: Accessor<Input<S>>;
    // setForm: Setter<Partial<Input<S>>>;
    setForm: (path: string | string[], value: unknown) => void;
    Form: Form;
    resetForm: () => void;
    error: Accessor<FormError>;
    // setError: Setter<FormError>;
    setError: (path: string | string[], value: string | undefined) => void;
    message: Accessor<string>;
    setMessage: Setter<string>;
};

export function createForm<S extends BaseSchema = BaseSchema,>(
    schema: S,
    onSubmit?: (result: SafeParseResult<S>) => void,
): CreateForm<S>;

export function createForm<S extends BaseSchema = BaseSchema,>(
    schema: S,
    data?: Partial<Input<S>>,
    onSubmit?: (result: SafeParseResult<S>) => void,
): CreateForm<S>;

export function createForm<S extends BaseSchema = BaseSchema,>(
    schema: S,
    dataOrOnSubmit?: Partial<Input<S>> | ((result: SafeParseResult<S>) => void),
    maybeOnSubmit?: (result: SafeParseResult<S>) => void,
): CreateForm<S> {
    const data = maybeOnSubmit && (dataOrOnSubmit as Partial<Input<S>>);
    const onSubmit =
        maybeOnSubmit ??
        (dataOrOnSubmit as (result: SafeParseResult<S>) => void);

    const [form, setFormSignal] = createSignal<Partial<Input<S>>>(
        structuredClone(data ?? {}),
        { equals: false },
    );
    const [error, setErrorSignal] = createSignal<FormError>(
        {},
        { equals: false },
    );
    const [message, setMessage] = createSignal("");

    function setForm(path: string | string[], value: unknown) {
        console.log("setForm", path, value);
        setFormSignal((form) => setPath(form, path, value));
    }

    function setError(path: string | string[], value: string | undefined) {
        setErrorSignal((error) => setPath(error, path, value));
    }

    function resetForm() {
        setFormSignal(structuredClone(data ?? {}));
    }

    const Form: Form = (props) => {
        function handleSubmit(event: SubmitEvent) {
            event.preventDefault();
            const result = safeParse(schema, form);
            if (!result.success) {
                for (const issue of result.issues) {
                    if (issue.path) {
                        const path = issue.path.map((p) => p.key);
                        setError(path, issue.message);
                    }
                }
            }
            onSubmit?.(result);
        }
        return (
            <FormContext.Provider
                value={{
                    form,
                    setForm,
                    error,
                    setError,
                }}
            >
                <form onSubmit={handleSubmit} class={props.class}>
                    {props.children}
                </form>
            </FormContext.Provider>
        );
    };
    return {
        form,
        setForm,
        resetForm,
        Form,
        error,
        setError,
        message,
        setMessage,
    };
}
