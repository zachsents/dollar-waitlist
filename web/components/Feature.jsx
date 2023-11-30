import { Group, Paper, Skeleton, Stack, Text } from "@mantine/core"
import { useStorageUrl } from "@web/modules/firebase/storage"
import classNames from "classnames"
import * as TbIcons from "react-icons/tb"


export default function Feature({ className, image, title, description, icon: iconName }) {

    const Icon = iconName && TbIcons[`Tb${iconName}`]

    const { data: imageSource } = useStorageUrl(image)

    return (
        <Stack className={classNames("w-full break-inside-avoid-column", className)}>
            {imageSource ?
                <img
                    src={imageSource}
                    className="w-full rounded-lg base-border shadow-sm"
                /> :
                <Skeleton className="h-36" />}

            <Paper
                withBorder
                className="bg-white rounded-lg p-xs text-center shadow-sm"
            >
                <Group className="justify-center gap-xs">
                    {Icon && <Icon />}
                    <Text>{title}</Text>
                </Group>
                {description &&
                    <Text className="text-xs text-gray">{description}</Text>}
            </Paper>
        </Stack>
    )
}
