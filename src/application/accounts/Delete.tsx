import { Box, Button } from "@primer/react";
import { Form, Formik } from "formik";
import { last } from "rambda";
import { object, string } from "yup";
import { MoxieTextInputControl } from "~/components/MoxieTextInputControl";
import { deleteAccount, reloadAccounts } from "~/lib/api";

export function Delete({ username }: { username: string }) {
    return (
        <Formik
            initialValues={{
                confirm: "",
            }}
            onSubmit={async ({ confirm }, actions) => {
                try {
                    await deleteAccount(confirm);
                    reloadAccounts();
                } catch (e) {
                    actions.setErrors({
                        confirm: "x",
                    });
                    actions.setStatus(last((e as Error).message.split(":")));
                }
            }}
            validationSchema={object({
                confirm: string()
                    .required("Type the username exactly")
                    .test("confirm", "Type the username exactly", (value) => {
                        return value === username;
                    }),
            })}
        >
            <Form>
                <Box className="flex flex-col gap-2">
                    <MoxieTextInputControl
                        label="Confirm username"
                        name="confirm"
                        placeholder="Enter the username here to confirm delete"
                        block
                        sx={{ textAlign: "center" }}
                    />
                    <Button type="submit" variant="danger">
                        Delete this account
                    </Button>
                </Box>
            </Form>
        </Formik>
    );
}
