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
    error: FormError;
    setError: SetStoreFunction<FormError>;
    message: Accessor<string>;
    setMessage: Setter<string>;
};

/**
 * Creates a form based on the provided schema and optional onSubmit callback.
 *
 * @param {S} schema - The schema to create the form from.
 * @param {(result: SafeParseResult<S>) => void} onSubmit - An optional callback function to be called when the form is submitted.
 * @return {Object} An object containing the form state and helper functions.
 *   - form: The current form state.
 *   - setForm: A function to update the form state.
 *   - Form: A React component to render the form.
 *   - error: The current form error state.
 *   - setError: A function to update the form error state.
 *   - message: The current message state.
 *   - setMessage: A function to update the message state.
 */
export function createForm<S extends BaseSchema = BaseSchema,>(
    schema: S,
    onSubmit?: (result: SafeParseResult<S>) => void,
): CreateForm<S>;

/**
 * Creates a form with the given schema, data, and onSubmit callback.
 *
 * @param {S} schema - The schema for the form.
 * @param {Partial<Input<S>>} [data] - Optional initial data for the form.
 * @param {(result: SafeParseResult<S>) => void} [onSubmit] - Optional callback function called when the form is submitted.
 * @return {Object} An object containing the form state and helper functions.
 *   - form: The current form state.
 *   - setForm: A function to update the form state.
 *   - Form: A React component to render the form.
 *   - error: The current form error state.
 *   - setError: A function to update the form error state.
 *   - message: The current message state.
 *   - setMessage: A function to update the message state.
 */
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

    const [form, setForm] = createStore<Partial<Input<S>>>(data ?? {});
    const [error, setError] = createStore<FormError>({});
    const [message, setMessage] = createSignal("");

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
                    setForm: setForm as SetStoreFunction<FormData>,
                    error,
                    setError: setError as SetStoreFunction<FormError>,
                }}
            >
                <form onSubmit={handleSubmit} class={props.class}>
                    {props.children}
                </form>
            </FormContext.Provider>
        );
    };
    return { form, setForm, Form, error, setError, message, setMessage };
}
