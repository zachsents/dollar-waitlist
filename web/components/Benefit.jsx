import { Center, Stack, Text } from "@mantine/core"
import * as TbIcons from "react-icons/tb"


export default function Benefit({ title, subtitle, icon: iconName }) {

    const Icon = TbIcons[`Tb${iconName}`]

    return (
        <Stack className="items-center">
            <Center className="rounded-lg wl-primary-dark-on-light w-20 h-auto aspect-square text-4xl">
                <Icon />
            </Center>

            <Text className="text-xl font-medium text-center">
                {title}
            </Text>
            <Text className="text-md text-center">
                {subtitle}
            </Text>
        </Stack>
    )
}
