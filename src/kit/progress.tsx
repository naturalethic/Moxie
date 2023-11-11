import { Component } from "solid-js";
import { Infer, number, object } from "~/lib/schema";

export const ProgressLab: ProgressProps = {
    current: 50,
    total: 100,
};

export const ProgressProps = object({
    current: number(),
    total: number(),
});

type ProgressProps = Infer<typeof ProgressProps>;

export const Progress: Component<ProgressProps> = (props) => {
    return (
        <div class="progress">
            <div
                class="progress-meter"
                style={{
                    width: `${
                        props.total === 0
                            ? 0
                            : (props.current / props.total) * 100
                    }%`,
                }}
            />
        </div>
    );
};
