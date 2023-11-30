import { Anchor, Divider, Stack, Text, Title } from "@mantine/core"
import Benefit from "@web/components/Benefit"
import CTAButton from "@web/components/CTAButton"
import FeatureGroup from "@web/components/FeatureGroup"
import Header from "@web/components/Header"
import JoinCard from "@web/components/JoinCard"
import TeamMemberCard from "@web/components/TeamMemberCard"
import Tweet from "@web/components/Tweet"
import { fire } from "@web/modules/firebase"
import { CurrentWaitlistContext, useCurrentWaitlist, useLogTest, useSectionLabel, useWaitlistCSSVariables } from "@web/modules/hooks"
import { useStore } from "@web/modules/store"
import { doc, getDoc } from "firebase/firestore"
import _ from "lodash"
import Head from "next/head"


export async function getServerSideProps(context) {

    const waitlist = await getDoc(doc(fire.db, "waitlists", context.params.waitlistId))
        .then(doc => doc.data())

    waitlist.id = context.params.waitlistId

    if (waitlist.tests?.length > 0) {
        const { id, ...randomTest } = waitlist.tests[Math.floor(Math.random() * waitlist.tests.length)]
        for (const [key, value] of Object.entries(randomTest)) {
            _.set(waitlist, key, value)
        }
        waitlist.testId = id
    }

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

    const openMobileCard = useStore(s => s.openMobileCard)

    useLogTest(waitlist.testId)

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

                            <Stack className="mt-20 lg:mt-24">
                                <Text className="font-bold text-[var(--wl-primary-dark)]">
                                    {waitlist?.content.eyebrow}
                                </Text>
                                <Title order={1} className="text-5xl">
                                    {waitlist?.content.headline}
                                </Title>
                                <Text className="text-xl">
                                    {waitlist?.content.description}
                                </Text>

                                <CTAButton
                                    className="lg:hidden shadow-md self-start mt-md"
                                    onClick={openMobileCard}
                                >
                                    Join the Waitlist
                                </CTAButton>
                            </Stack>

                            {waitlist?.content.sections.map(section => {
                                const SectionComponent = sectionComponents[section]
                                return <SectionComponent key={section} />
                            })}

                            <Divider />
                            <Text className="text-center text-gray text-sm mb-48 lg:mb-0">
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


const sectionComponents = {
    demo: DemoSection,
    benefits: BenefitsSection,
    features: FeaturesSection,
    testimonials: TestimonialsSection,
    team: TeamSection,
}


function DemoSection() {

}

function BenefitsSection() {

    const [waitlist] = useCurrentWaitlist()

    return (
        <Stack className="gap-10 scroll-m-20" id="benefits">
            <SectionLabel slug="benefits" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-16">
                {waitlist?.content.benefits?.map((benefit, i) =>
                    <Benefit {...benefit} key={i} />
                )}
            </div>
        </Stack>
    )
}

function FeaturesSection() {
    return (
        <Stack className="gap-10 scroll-m-20" id="features">
            <SectionLabel slug="features" />
            <FeatureGroup />
        </Stack>
    )
}

function TestimonialsSection() {

    const [waitlist] = useCurrentWaitlist()

    return (
        <Stack className="gap-10 scroll-m-20" id="testimonials">
            <SectionLabel slug="testimonials" />
            <Stack className="gap-xl">
                <div className="columns-1 lg:columns-2 gap-x-10">
                    {waitlist?.content.tweets?.map(tweetId =>
                        <Tweet id={tweetId} className="mb-10" key={tweetId} />
                    )}
                </div>
            </Stack>
        </Stack>
    )
}

function TeamSection() {

    const [waitlist] = useCurrentWaitlist()

    return (
        <Stack className="gap-10 scroll-m-20" id="team">
            <SectionLabel slug="team" />
            <Stack className="gap-xl">
                {waitlist?.content.team?.map((member, i) =>
                    <TeamMemberCard {...member} key={i} />
                )}
            </Stack>
        </Stack>
    )
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