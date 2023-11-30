import { useCurrentWaitlist } from "@web/modules/hooks"
import Feature from "./Feature"
import { Stack, Text } from "@mantine/core"
import { TbCheck } from "react-icons/tb"
import _ from "lodash"


export default function FeatureGroup() {

    const [waitlist] = useCurrentWaitlist()

    const features = _.groupBy(waitlist?.content.features, "level")

    const hasLevel1Features = features["1"]?.length > 0
    const hasLevel2Features = features["2"]?.length > 0
    const hasLevel3Features = features["3"]?.length > 0

    return (<>
        {hasLevel1Features &&
            <div className="columns-1 gap-10">
                {features["1"].map((feature, i) =>
                    <Feature {...feature} className="mb-10" key={i} />
                )}
            </div>}

        {hasLevel2Features &&
            <div className="columns-1 lg:columns-2 gap-10">
                {features["2"].map((feature, i) =>
                    <Feature {...feature} className="mb-10" key={i} />
                )}
            </div>}

        {hasLevel3Features &&
            <Stack className="gap-md">
                <Text className="text-sm font-bold text-gray">
                    Other Features:
                </Text>
                <ul className="columns-1 lg:columns-2 gap-x-md m-0 p-0">
                    {features["3"].map((feature, i) =>
                        <li className="flex items-center gap-md mb-sm break-inside-avoid-column" key={i}>
                            <TbCheck className="text-lg text-[var(--wl-primary)] shrink-0" />
                            <Text className="text-lg">{feature.title}</Text>
                        </li>
                    )}
                </ul>
            </Stack>}
    </>)
}
