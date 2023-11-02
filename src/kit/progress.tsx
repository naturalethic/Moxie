import { Component } from "solid-js";

export const Progress: Component<{ current: number; total: number }> = (
    props,
) => {
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
