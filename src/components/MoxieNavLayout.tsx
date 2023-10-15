import { Icon } from "@primer/octicons-react";
import { NavList, PageLayout } from "@primer/react";
import {
    Children,
    ReactElement,
    ReactNode,
    Suspense,
    isValidElement,
    useState,
} from "react";

function MoxieNavLayoutImpl({
    children,
}: { children: ReactNode; param?: string }) {
    const items: ReactElement[] = [];
    Children.forEach(children, (child) => {
        if (
            isValidElement(child) &&
            (child.type === MoxieNavLayout.Item ||
                child.type === MoxieNavLayout.Divider)
        ) {
            items.push(child);
        }
    });

    const [selectedItem, setSelectedItem] = useState(
        items.find((item) => item.type === MoxieNavLayout.Item)?.props.id ?? "",
    );

    return (
        <PageLayout padding="none" columnGap="none" rowGap="none">
            <PageLayout.Pane position="start" width="small" divider="line">
                <NavList>
                    {items.map((item) =>
                        item.type === MoxieNavLayout.Item ? (
                            <NavList.Item
                                key={item.props.id}
                                aria-current={item.props.id === selectedItem}
                                onClick={() => {
                                    setSelectedItem(item.props.id);
                                }}
                            >
                                {item.props.label}
                                {item.props.leadingVisual && (
                                    <NavList.LeadingVisual>
                                        <item.props.leadingVisual />
                                    </NavList.LeadingVisual>
                                )}
                            </NavList.Item>
                        ) : (
                            <NavList.Divider key="" />
                        ),
                    )}
                </NavList>
            </PageLayout.Pane>
            <PageLayout.Content padding="none" sx={{ paddingLeft: 2 }}>
                <Suspense>
                    {
                        items.find((item) => item.props.id === selectedItem)
                            ?.props.children
                    }
                </Suspense>
            </PageLayout.Content>
        </PageLayout>
    );
}

type MoxieNavLayoutItemProps = {
    children?: ReactNode;
    id: string;
    label: string;
    leadingVisual?: Icon;
};

export const MoxieNavLayout = Object.assign(MoxieNavLayoutImpl, {
    Item: (_: MoxieNavLayoutItemProps) => <div />,
    Divider: () => <div />,
});
