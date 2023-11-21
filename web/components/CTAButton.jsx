import { Button, Text } from "@mantine/core"
import classNames from "classnames"


export default function CTAButton({ className, showPrice = false, children, ...props }) {
    return (
        <Button
            className={classNames(
                "sketch-border hover:scale-105 hover:shadow-lg transition bg-[var(--wl-secondary)] hover:bg-[var(--wl-secondary)]",
                className
            )}
            size="xl" radius="xl" rightIcon={showPrice ? <Text className="font-bold">$1</Text> : undefined}
            {...props}
        >
            {children}
        </Button>
    )
}
