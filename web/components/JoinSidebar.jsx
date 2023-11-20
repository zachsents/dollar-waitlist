import { Badge, Button, Center, Group, Paper, Progress, Stack, Text, TextInput, ThemeIcon } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useLocalStorage } from "@mantine/hooks"
import { useCurrentWaitlist } from "@web/modules/hooks"
import { SUBMITTED_EMAIL_LS_KEY, SUCCESSFUL_EMAIL_LS_KEY, formatNumber } from "@web/modules/util"
import classNames from "classnames"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { TbBallpen, TbCheck, TbMail } from "react-icons/tb"


// const EMAIL_LIMIT = 4


export default function JoinSidebar() {

    const router = useRouter()
    const [waitlist] = useCurrentWaitlist()

    const form = useForm({
        initialValues: {
            email: "",
        },
        validate: {
            email: value => !value.includes("@") || !value.includes("."),
        },
    })

    const handleSubmit = ({ email }) => {
        const url = new URL(waitlist.stripePaymentLink)
        url.searchParams.set("prefilled_email", email)
        localStorage.setItem(SUBMITTED_EMAIL_LS_KEY, email)
        router.push(url.toString())
    }

    useEffect(() => {
        localStorage.removeItem(SUBMITTED_EMAIL_LS_KEY)
    }, [])

    const [successfulEmail] = useLocalStorage({
        key: SUCCESSFUL_EMAIL_LS_KEY,
    })

    // const [previousEmails, setPreviousEmails] = useLocalStorage({
    //     key: "previouslyUsedEmails",
    //     defaultValue: [],
    // })

    // const hotkeyHandlers = useMemo(() => previousEmails?.map((email, i) => [
    //     `${i + 1}`,
    //     () => joinWaitlistMut.mutate({ email }),
    // ]) || [], [previousEmails?.join()])

    // useHotkeys(hotkeyHandlers)

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
                    onSubmit={form.onSubmit(handleSubmit)}
                    className="w-full max-w-xs"
                >
                    <Stack>
                        {successfulEmail ? <>
                            <Group noWrap className="justify-center my-md">
                                <ThemeIcon size="lg" radius="md" className="bg-[var(--wl-secondary)]">
                                    <TbCheck />
                                </ThemeIcon>

                                <Text className="font-bold text-2xl whitespace-nowrap">
                                    You're signed up!
                                </Text>
                            </Group>

                            <Text className="text-center text-gray">
                                {successfulEmail}
                            </Text>

                            <Text className="text-center text-gray">
                                Watch your inbox for updates.
                            </Text>
                        </> : <>
                            <Group noWrap className="justify-center my-md">
                                <ThemeIcon size="lg" radius="md" className="bg-[var(--wl-secondary)]">
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
                                    input: "border-none outline outline-1 outline-transparent focus:outline-[var(--wl-primary)] focus:outline"
                                }}
                                // disabled={joinWaitlistMut.isLoading}
                                {...form.getInputProps("email")}
                            />

                            <Button
                                className={classNames(
                                    "sketch-border hover:scale-105 hover:shadow-lg transition bg-[var(--wl-secondary)] hover:bg-[var(--wl-secondary)]",
                                    { "shadow-md": form.isValid() },
                                )}
                                size="xl" radius="xl" rightIcon={<Text className="font-bold">$1</Text>}
                                disabled={!form.isValid()}
                                // loading={joinWaitlistMut.isLoading}
                                type="submit"
                            >
                                Join Waitlist
                            </Button>
                        </>}

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
                                            bar: "bg-[var(--wl-secondary)]",
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

                {!successfulEmail &&
                    <Badge
                        size="lg"
                        className="self-center wl-secondary-dark-on-light !normal-case absolute top-0 right-0 scale-125 rotate-12 shadow-lg"
                    >
                        {waitlist?.maxSignupCount ? "Limited Spots!" : "Join Now!"}
                    </Badge>}
            </Center>
        </div>
    )
}