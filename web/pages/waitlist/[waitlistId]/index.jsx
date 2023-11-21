import { Anchor, Divider, Stack, Text, Title } from "@mantine/core"
import Benefit from "@web/components/Benefit"
import Header from "@web/components/Header"
import HeroDemo from "@web/components/HeroDemo"
import JoinSidebar from "@web/components/JoinSidebar"
import TeamMemberCard from "@web/components/TeamMemberCard"
import Tweet from "@web/components/Tweet"
import { fire } from "@web/modules/firebase"
import { useStorageUrl } from "@web/modules/firebase/storage"
import { CurrentWaitlistContext, useWaitlistCSSVariables } from "@web/modules/hooks"
import { doc, getDoc } from "firebase/firestore"
import Head from "next/head"


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


export default function PreviewWaitlistPage({ waitlist }) {

    const cssVariables = useWaitlistCSSVariables(waitlist)

    const demoImageUrlQuery = useStorageUrl(waitlist?.demo?.image)

    return (<>
        <Head>
            <title key="title">
                {`${waitlist.name} - Dollar Waitlist`}
            </title>
        </Head>

        <CurrentWaitlistContext.Provider value={waitlist}>
            <Header />

            <div
                className="bg-gray-50 glowy-bg px-xl md:px-20"
                style={cssVariables}
            >
                <div className="flex relative gap-20 justify-center w-full max-w-6xl mx-auto">
                    <div className="py-20 flex-1">
                        <Stack className="gap-36 w-full">
                            {/* <Brand /> */}
                            <Stack className="my-20">
                                <Text className="font-bold text-[var(--wl-primary-dark)]">
                                    Hey {waitlist?.target}!
                                </Text>
                                <Title order={1} className="text-5xl">
                                    {waitlist?.headline}
                                </Title>
                                <Text className="text-xl">
                                    {waitlist?.description}
                                </Text>
                            </Stack>
                            <Stack className="gap-10" id="showcase">
                                <SectionLabel slug="showcase">Showcase</SectionLabel>
                                <HeroDemo
                                    imageSource={demoImageUrlQuery.data}
                                    labels={waitlist?.demo?.labels}
                                />
                            </Stack>
                            <Stack className="gap-10" id="benefits">
                                <SectionLabel slug="benefits">Benefits</SectionLabel>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
                                    {waitlist?.benefits?.map((benefit, i) =>
                                        <Benefit {...benefit} key={i} />
                                    )}
                                </div>
                            </Stack>
                            <Stack className="gap-10" id="testimonials">
                                <SectionLabel slug="testimonials">Testimonials</SectionLabel>
                                <Stack className="gap-xl">
                                    {/* <Title order={4}>Hear from others</Title> */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                        {waitlist?.tweets?.map(tweetId =>
                                            <Tweet id={tweetId} key={tweetId} />
                                        )}
                                    </div>
                                </Stack>
                            </Stack>
                            <Stack className="gap-10" id="team">
                                <SectionLabel slug="team">Team</SectionLabel>
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

                    <JoinSidebar />
                </div>
            </div>
        </CurrentWaitlistContext.Provider>
    </>)
}


function SectionLabel({ children, slug }) {
    return (
        <div
            className="flex justify-end sticky top-20 md:top-10 z-10 pointer-events-none"
        >
            <Text
                component="a"
                className="text-center text-gray text-sm uppercase font-bold p-md rounded-full border-dashed border-gray border-1 pointer-events-auto cursor-pointer hover:text-dark hover:border-dark transition "
                href={`#${slug}`}
            >
                {children}
            </Text>
        </div>
    )
}