import { Anchor, Divider, Stack, Text, Title } from "@mantine/core"
import Benefit from "@web/components/Benefit"
import CTAButton from "@web/components/CTAButton"
import Header from "@web/components/Header"
import HeroDemo from "@web/components/HeroDemo"
import JoinCard from "@web/components/JoinCard"
import TeamMemberCard from "@web/components/TeamMemberCard"
import Tweet from "@web/components/Tweet"
import { fire } from "@web/modules/firebase"
import { useStorageUrl } from "@web/modules/firebase/storage"
import { CurrentWaitlistContext, useSectionLabel, useWaitlistCSSVariables } from "@web/modules/hooks"
import { useStore } from "@web/modules/store"
import { doc, getDoc } from "firebase/firestore"
import Head from "next/head"
import { TbCheck } from "react-icons/tb"


export async function getServerSideProps(context) {

    const waitlist = await getDoc(doc(fire.db, "waitlists", context.params.waitlistId))
        .then(doc => doc.data())

    return waitlist ? {
        props: {
            waitlist,
        },
    } : {
        notFound: true,
    }
}


export default function WaitlistPage({ waitlist }) {

    const cssVariables = useWaitlistCSSVariables(waitlist)

    const demoImageUrlQuery = useStorageUrl(waitlist?.demo?.image)

    const openMobileCard = useStore(s => s.openMobileCard)

    return (<>
        <Head>
            <title key="title">
                {`${waitlist.name} - Dollar Waitlist`}
            </title>
        </Head>

        <CurrentWaitlistContext.Provider value={waitlist}>
            <Header />

            <div
                className="bg-gray-50 glowy-bg px-xl lg:px-20"
                style={cssVariables}
            >
                <div className="flex relative gap-20 justify-center w-full max-w-6xl mx-auto">
                    <div className="py-20 flex-1">
                        <Stack className="gap-36 w-full">
                            {/* <Brand /> */}

                            <Stack className="mt-24">
                                <Text className="font-bold text-[var(--wl-primary-dark)]">
                                    Hey {waitlist?.target}!
                                </Text>
                                <Title order={1} className="text-5xl">
                                    {waitlist?.headline}
                                </Title>
                                <Text className="text-xl">
                                    {waitlist?.description}
                                </Text>

                                <CTAButton
                                    className="lg:hidden shadow-md self-start mt-md"
                                    onClick={openMobileCard}
                                >
                                    Join the Waitlist
                                </CTAButton>
                            </Stack>
                            <Stack className="gap-10 scroll-m-20" id="showcase">
                                <SectionLabel slug="showcase">
                                    {/* <ActionIcon
                                        variant="transparent" size="xl"
                                        className="pointer-events-auto text-3xl text-gray-400 hover:text-gray transition-colors"
                                        onClick={() => setDemoPlaying(!demoPlaying)}
                                    >
                                        {demoPlaying ? <TbPlayerPause /> : <TbPlayerPlay />}
                                    </ActionIcon> */}
                                </SectionLabel>
                                <HeroDemo
                                    imageSource={demoImageUrlQuery.data}
                                    labels={waitlist?.demo?.labels}
                                />
                                {!!waitlist?.otherFeatures &&
                                    <Stack>
                                        <Text className="text-sm font-bold text-gray">
                                            Other Features:
                                        </Text>
                                        <ul className="columns-1 lg:columns-2 gap-x-md m-0 p-0">
                                            {waitlist?.otherFeatures?.map((feature, i) =>
                                                <li className="flex items-center gap-md mb-md" key={i}>
                                                    <TbCheck className="text-lg text-[var(--wl-primary)] shrink-0" />
                                                    <Text className="text-lg">{feature}</Text>
                                                </li>
                                            )}
                                        </ul>
                                    </Stack>}
                            </Stack>
                            <Stack className="gap-10 scroll-m-20" id="benefits">
                                <SectionLabel slug="benefits" />
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-16">
                                    {waitlist?.benefits?.map((benefit, i) =>
                                        <Benefit {...benefit} key={i} />
                                    )}
                                </div>
                            </Stack>
                            <Stack className="gap-10 scroll-m-20" id="testimonials">
                                <SectionLabel slug="testimonials" />
                                <Stack className="gap-xl">
                                    <div className="columns-1 lg:columns-2 gap-x-10">
                                        {waitlist?.tweets?.map(tweetId =>
                                            <Tweet id={tweetId} className="mb-10" key={tweetId} />
                                        )}
                                    </div>
                                </Stack>
                            </Stack>
                            <Stack className="gap-10 scroll-m-20" id="team">
                                <SectionLabel slug="team" />
                                <Stack className="gap-xl">
                                    {waitlist?.team?.map((member, i) =>
                                        <TeamMemberCard {...member} key={i} />
                                    )}
                                </Stack>
                            </Stack>
                            <Divider />
                            <Text className="text-center text-gray text-sm">
                                This site was made with Dollar Waitlist. <Anchor href="https://dollarwaitlist.com" target="_blank">Create your own</Anchor>.
                            </Text>
                        </Stack>
                    </div>

                    <JoinCard />
                </div>
            </div>
        </CurrentWaitlistContext.Provider>
    </>)
}


function SectionLabel({ defaultLabel = "", slug, children }) {

    const label = useSectionLabel(slug) || defaultLabel

    return (
        <div
            className="flex justify-end items-center gap-xl sticky top-20 lg:top-10 z-10 pointer-events-none"
        >
            {children}
            <Text
                className="text-center text-gray text-sm uppercase font-bold p-md rounded-full border-dashed border-gray border-1 cursor-pointer hover:text-dark hover:border-dark transition"
            // component="a"
            // href={`#${slug}`}
            >
                {label}
            </Text>
        </div>
    )
}