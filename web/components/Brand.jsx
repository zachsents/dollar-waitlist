import { Group, Text } from "@mantine/core"
import { useStorageUrl } from "@web/modules/firebase/storage"
import { useCurrentWaitlist } from "@web/modules/hooks"
import classNames from "classnames"
import Link from "next/link"


export default function Brand({ className }) {

    const [waitlist] = useCurrentWaitlist()

    const { data: logoSource } = useStorageUrl(waitlist?.logo)

    return (
        <Link href="#" className="no-underline text-dark">
            <Group noWrap className={classNames("gap-lg opacity-50 hover:opacity-100 transition-opacity", className)}>
                {waitlist?.logoMode === "text" ?
                    <>
                        <img
                            src={logoSource}
                            alt={`${waitlist?.name} logo`}
                            className="h-9 w-auto aspect-square rounded-sm shrink-0"
                        />
                        <Text className="text-2xl font-bold">
                            {waitlist?.name}
                        </Text>
                    </> :
                    <img
                        src={logoSource}
                        alt={`${waitlist?.name} logo`}
                        className="h-9 w-auto rounded-sm shrink-0"
                    />}
            </Group>
        </Link>
    )
}