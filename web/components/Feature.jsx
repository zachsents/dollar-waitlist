import { Group, Paper, Skeleton, Stack, Text } from "@mantine/core"
import { useStorageUrl } from "@web/modules/firebase/storage"
import classNames from "classnames"
import * as TbIcons from "react-icons/tb"
import Color from "color"
import { useMemo } from "react"


export default function Feature({ className, image, title, description, icon: iconName, variant, gradientColor }) {

    const Icon = iconName && TbIcons[`Tb${iconName}`]

    const { data: imageSource } = useStorageUrl(image)

    const imageComponent = <img
        src={imageSource}
        className="w-full"
    />

    return (
        <Stack className={classNames("w-full break-inside-avoid-column", className)}>
            {imageSource ?
                variant === "gradient" ?
                    <GradientImage color={gradientColor}>
                        {imageComponent}
                    </GradientImage> :
                    <div className="w-full rounded-lg base-border shadow-sm overflow-clip">
                        {imageComponent}
                    </div> :
                <Skeleton className="h-36" />}

            <Paper
                withBorder
                className="bg-white rounded-lg p-md text-center shadow-sm"
            >
                <Group className="justify-center gap-xs text-lg">
                    {Icon && <Icon />}
                    <Text>{title}</Text>
                </Group>
                {description &&
                    <Text className="text-sm text-gray">{description}</Text>}
            </Paper>
        </Stack>
    )
}


function GradientImage({ children, color }) {

    const firstColor = useMemo(() => Color(color).rotate(-20).saturate(-0.1), [color])
    const secondColor = useMemo(() => Color(color).rotate(20).saturate(-0.1), [color])

    return (
        <div className="w-full p-xl rounded-lg shadow-sm" style={{
            backgroundImage: `linear-gradient(to bottom right, ${firstColor}, ${secondColor})`,
        }}>
            <div className="rounded-lg overflow-clip rotate-3">
                {children}
            </div>
        </div>
    )
}