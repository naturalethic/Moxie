import {
    Accessor,
    ParentComponent,
    Setter,
    createContext,
    createSignal,
} from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { BaseSchema, Input, SafeParseResult, safeParse } from "valibot";

type Form = ParentComponent<{ class?: string }>;
type FormData = Record<string, unknown>;
type FormError = Record<string, string | undefined>;

export const FormContext = createContext<{
    form?: FormData;
    setForm?: SetStoreFunction<FormData>;
    error?: FormError;
    setError?: SetStoreFunction<FormError>;
}>({});

type CreateForm<S extends BaseSchema> = {
    form: Input<S>;
    setForm: SetStoreFunction<Partial<Input<S>>>;
    Form: Form;
    resetForm: () => void;
    error: FormError;
    setError: SetStoreFunction<FormError>;
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

    const [form, setForm] = createStore<Partial<Input<S>>>(
        structuredClone(data ?? {}),
    );
    const [error, setError] = createStore<FormError>({});
    const [message, setMessage] = createSignal("");

    function resetForm() {
        setForm(structuredClone(data ?? {}));
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
