import { ParentComponent, createContext, createSignal } from "solid-js";
import { createMutable, modifyMutable, produce, unwrap } from "solid-js/store";
import { BaseSchema, Input, SafeParseResult, safeParse } from "valibot";
import { setPath } from "~/lib/util";

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

type CreateForm<S extends BaseSchema> = {
    Form: Form;
    value: Input<S>;
    error: FormError;
    reset: () => void;
    set message(message: string);
    get message(): string;
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
    const schema = args.shift() as S;
    let data: Partial<Input<S>> = {};
    if (typeof args[0] === "object") {
        data = args.shift() as Partial<Input<S>>;
    }
    const onSubmit = args[0] as
        | ((result: SafeParseResult<S>) => void)
        | undefined;

    const value = createMutable<S>(structuredClone(unwrap(data)) as S);
    const error = createMutable<FormError>({});
    const [message, setMessage] = createSignal("");

    function reset() {
        if (Object.keys(data).length === 0) {
            console.warn(
                "Called form.reset() when no initial data was provided",
            );
            return;
        }
        modifyMutable(
            value,
            produce((value) => {
                for (const key in data) {
                    value[key] = data[key]!;
                }
            }),
        );
    }

    const Form: Form = (props) => {
        function handleSubmit(event: SubmitEvent) {
            event.preventDefault();
            const result = safeParse(schema, value);
            if (!result.success) {
                for (const issue of result.issues) {
                    if (issue.path) {
                        const path = issue.path.map((p) => p.key);
                        setPath(error, path, issue.message);
                    }
                }
            }
            onSubmit?.(result);
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
