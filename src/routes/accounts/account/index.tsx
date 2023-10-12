import { NavList, PageLayout } from "@primer/react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Delete } from "./Delete";
import { Emails } from "./Emails";
import { New } from "./New";
import { Password } from "./Password";

export function Component() {
    const { username } = useParams();
    const [selectedItem, setSelectedItem] = useState("emails");
    return (
        <PageLayout padding="none" columnGap="none" rowGap="none">
            <PageLayout.Pane position="start" width="small" divider="line">
                <NavList>
                    {username === "new" ? (
                        <NavList.Item aria-current={true}>
                            New account details
                        </NavList.Item>
                    ) : (
                        <>
                            <NavList.Item
                                aria-current={selectedItem === "emails"}
                                onClick={() => setSelectedItem("emails")}
                            >
                                Emails
                            </NavList.Item>
                            <NavList.Item
                                aria-current={selectedItem === "password"}
                                onClick={() => setSelectedItem("password")}
                            >
                                Password
                            </NavList.Item>
                            <NavList.Item
                                aria-current={selectedItem === "delete"}
                                onClick={() => setSelectedItem("delete")}
                            >
                                Delete
                            </NavList.Item>
                        </>
                    )}
                </NavList>
            </PageLayout.Pane>
            <PageLayout.Content
                padding="none"
                sx={{ paddingLeft: 2, paddingTop: 2 }}
            >
                {username === "new" ? (
                    <New />
                ) : (
                    <>
                        {selectedItem === "emails" && username && (
                            <Emails username={username} />
                        )}
                        {selectedItem === "password" && username && (
                            <Password username={username} />
                        )}
                        {selectedItem === "delete" && username && (
                            <Delete username={username} />
                        )}
                    </>
                )}
            </PageLayout.Content>
        </PageLayout>
    );
}
