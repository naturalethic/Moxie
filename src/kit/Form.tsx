import {
    Accessor,
    ParentComponent,
    Setter,
    createContext,
    createSignal,
    useContext,
} from "solid-js";
import { SetStoreFunction, createStore, unwrap } from "solid-js/store";
import { BaseSchema, Input, SafeParseResult, safeParse } from "valibot";

type Form = ParentComponent<{ class?: string }>;
type FormData = Record<string, unknown>;
type FormError = Record<string, string | undefined>;

type FormContext = {
    form?: FormData;
    setForm?: (key: string, value: unknown) => void;
    error?: FormError;
    setError?: SetStoreFunction<FormError>;
};

export const FormContext = createContext<FormContext>({});

type CreateForm<S extends BaseSchema> = {
    form: Input<S>;
    setForm: (key: string, value: unknown) => void;
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
    name: string,
    schema: S,
    onSubmit?: (result: SafeParseResult<S>) => void,
): CreateForm<S>;

export function createForm<S extends BaseSchema = BaseSchema,>(
    name: string,
    schema: S,
    data?: Partial<Input<S>>,
    onSubmit?: (result: SafeParseResult<S>) => void,
): CreateForm<S>;

export function createForm<S extends BaseSchema = BaseSchema,>(
    ...args: unknown[]
): CreateForm<S> {
    let name: string | undefined = undefined;
    if (typeof args[0] === "string") {
        name = args.shift() as string;
    }
    const schema = args.shift() as S;
    let data: Partial<Input<S>> | undefined = undefined;
    if (typeof args[0] === "object") {
        data = args.shift() as Partial<Input<S>>;
    }
    const onSubmit = args[0] as
        | ((result: SafeParseResult<S>) => void)
        | undefined;

    const parent = name
        ? (useContext(FormContext) as Required<FormContext>)
        : undefined;

    if (parent) {
        data ??= parent.form[name!] as Partial<Input<S>>;
    }

    const [form, setFormStore] = createStore<Input<S>>(
        structuredClone(unwrap(data ?? {})),
    );
    const [error, setError] = createStore<FormError>({});
    const [message, setMessage] = createSignal("");

    function setForm(key: string, value: unknown) {
        setFormStore({ [key]: value });
        if (parent) {
            parent.setForm(name!, structuredClone(unwrap(form)));
        }
    }

    function resetForm() {
        setFormStore(structuredClone(data ?? {}));
    }

    const Form: Form = (props) => {
        function handleSubmit(event: SubmitEvent) {
            event.preventDefault();
            if (parent) {
                const parentElement = (event.target as HTMLFormElement)
                    .parentElement!;
                const parentForm = parentElement.closest("form")!;
                const submit = parentForm.querySelector(
                    "input[name=__submit]",
                ) as HTMLInputElement;
                submit.click();
                return;
            }
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
                    <input
                        name="__submit"
                        style="display: none;"
                        type="submit"
                    />
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
