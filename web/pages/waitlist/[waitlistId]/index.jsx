import { Anchor, Badge, Button, Center, Divider, Group, LoadingOverlay, Paper, Progress, Stack, Text, TextInput, ThemeIcon, Title, useMantineTheme } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useHotkeys, useLocalStorage } from "@mantine/hooks"
import Benefit from "@web/components/Benefit"
import Header from "@web/components/Header"
import HeroDemo from "@web/components/HeroDemo"
import TeamMemberCard from "@web/components/TeamMemberCard"
import Tweet from "@web/components/Tweet"
import { useStorageUrl } from "@web/modules/firebase/storage"
import { useCurrentWaitlist } from "@web/modules/hooks"
import { formatNumber } from "@web/modules/util"
import classNames from "classnames"
import Head from "next/head"
import { useMemo } from "react"
import { TbBallpen, TbMail } from "react-icons/tb"
import { useMutation } from "react-query"


const EMAIL_LIMIT = 4


export default function PreviewWaitlistPage() {

    const theme = useMantineTheme()

    const [waitlist, waitlistQuery] = useCurrentWaitlist()
    // const { data: user } = useUser()

    const demoImageUrlQuery = useStorageUrl(waitlist?.demo?.image)

    return (<>
        <Head>
            <title key="title">
                {waitlist?.name || "Loading..."} - Dollar Waitlist
            </title>
        </Head>
        <Header />
        <div
            className="bg-gray-50 glowy-bg px-xl md:px-20"
            style={{
                "--waitlistPrimaryColor": waitlist?.primaryColor || "gray",
                "--waitlistLightenedPrimaryColor": theme.fn.lighten(waitlist?.primaryColor || "gray", 0.65),
                "--waitlistDarkenedPrimaryColor": theme.fn.darken(waitlist?.primaryColor || "gray", 0.25),
                "--bgGradientColor": theme.fn.lighten(waitlist?.primaryColor || "gray", 0.85),
            }}
        >
            <div className="flex relative gap-20 justify-center w-full max-w-6xl mx-auto">
                <div className="py-20 flex-1">
                    <Stack className="gap-36 w-full">
                        {/* <Brand /> */}
                        <Stack className="my-20">
                            <Text className="font-bold text-[var(--waitlistDarkenedPrimaryColor)]">
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
        <LoadingOverlay visible={waitlistQuery.isLoading} />
    </>)
}


function JoinSidebar() {

    const [waitlist] = useCurrentWaitlist()

    const form = useForm({
        initialValues: {
            email: "",
        },
        validate: {
            email: value => !value.includes("@") || !value.includes("."),
        },
    })

    const [previousEmails, setPreviousEmails] = useLocalStorage({
        key: "previouslyUsedEmails",
        defaultValue: [],
    })

    const joinWaitlistMut = useMutation({
        mutationFn: async ({ email }) => {
            form.setFieldValue("email", email)
            await new Promise(resolve => setTimeout(resolve, 1000))

            if (!previousEmails.includes(email))
                setPreviousEmails([...new Set([email, ...previousEmails].slice(0, EMAIL_LIMIT))])
            // TO DO: take user to stripe page
        },
    })

    const hotkeyHandlers = useMemo(() => previousEmails?.map((email, i) => [
        `${i + 1}`,
        () => joinWaitlistMut.mutate({ email }),
    ]) || [], [previousEmails?.join()])

    useHotkeys(hotkeyHandlers)

    const signupProgress = waitlist?.signupCount && waitlist?.maxSignupCount ?
        waitlist?.signupCount / waitlist?.maxSignupCount * 100 : 0

    return (
        <div
            className="hidden md:flex grow max-w-[24rem] h-screen sticky top-0 py-12 flex-col gap-16 justify-center"
        >
            <Center
                component={Paper} withBorder
                className="w-full relative rounded-xl shadow-lg px-xl py-16"
            >
                <form
                    onSubmit={form.onSubmit(joinWaitlistMut.mutate)}
                    className="w-full max-w-xs"
                >
                    <Stack>
                        <Group noWrap className="justify-center my-md">
                            <ThemeIcon size="lg" radius="md" className="bg-[var(--waitlistPrimaryColor)]">
                                <TbBallpen />
                            </ThemeIcon>

                            <Text className="font-bold text-2xl whitespace-nowrap">
                                Join the waitlist!
                            </Text>
                        </Group>

                        <TextInput
                            placeholder="Email"
                            size="lg" radius="xl"
                            icon={<TbMail />}
                            type="email" variant="filled" name="email"
                            classNames={{
                                input: "border-none outline outline-1 outline-transparent focus:outline-[var(--waitlistPrimaryColor)] focus:outline"
                            }}
                            disabled={joinWaitlistMut.isLoading}
                            {...form.getInputProps("email")}
                        />

                        <Button
                            className={classNames(
                                "sketch-border hover:scale-105 hover:shadow-lg transition bg-[var(--waitlistPrimaryColor)] hover:bg-[var(--waitlistPrimaryColor)]",
                                { "shadow-md": form.isValid() },
                            )}
                            size="xl" radius="xl" rightIcon={<Text className="font-bold">$1</Text>}
                            disabled={!form.isValid()}
                            loading={joinWaitlistMut.isLoading}
                            type="submit"
                        >
                            Join Waitlist
                        </Button>

                        {/* {previousEmails?.length > 0 &&
                            <Stack className="gap-xs my-md">
                                <Text className="text-gray text-xs text-center">
                                    Previously Used
                                </Text>
                                {previousEmails?.map((email, i) =>
                                    <button
                                        className="bg-white hover:bg-gray-100 border-none outline-none rounded-md flex items-center gap-xs cursor-pointer px-xs py-1"
                                        type="button" onClick={() => joinWaitlistMut.mutate({ email })}
                                        key={email}
                                    >
                                        <Kbd size="xs">{i + 1}</Kbd>
                                        <Text className="text-xs">{email}</Text>
                                    </button>
                                )}
                            </Stack>} */}

                        <Stack className="mt-10">
                            {
                                <Text className="text-center font-bold">{formatNumber(waitlist?.signupCount)} signed up!</Text>}

                            <div>
                                {waitlist?.maxSignupCount ?
                                    <Progress
                                        value={signupProgress}
                                        radius="xl" className="h-4"
                                        classNames={{
                                            bar: "bg-[var(--waitlistPrimaryColor)]",
                                        }}
                                    /> :
                                    null}
                                <Text className="text-gray text-sm mt-1 mr-xs text-right">
                                    {formatNumber(waitlist?.signupCount)} / {formatNumber(waitlist?.maxSignupCount)}
                                </Text>
                            </div>
                        </Stack>
                    </Stack>
                </form>

                {/* <Menu withinPortal shadow="lg" position="top-end">
                    <Menu.Target>
                        <ActionIcon variant="transparent" className="absolute bottom-md right-md">
                            <TbDots />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            icon={<TbMailOff />}
                            onClick={() => setPreviousEmails([])}
                        >
                            Clear Previously Used Emails
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu> */}

                <Badge
                    size="lg"
                    className="self-center light-waitlist !normal-case absolute top-0 right-0 scale-125 rotate-12 shadow-lg"
                >
                    {waitlist?.maxSignupCount ? "Limited Spots!" : "Join Now!"}
                </Badge>
            </Center>
        </div>
    )
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
