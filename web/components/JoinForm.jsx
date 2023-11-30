import { Badge, Group, Kbd, Progress, Stack, Text, TextInput, ThemeIcon } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useHotkeys, useLocalStorage } from "@mantine/hooks"
import { modals } from "@mantine/modals"
import { useCurrentWaitlist } from "@web/modules/hooks"
import { SUBMITTED_EMAIL_LS_KEY, SUCCESSFUL_EMAIL_LS_KEY, formatNumber } from "@web/modules/util"
import classNames from "classnames"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import { TbBallpen, TbCheck, TbGift, TbMail } from "react-icons/tb"
import CTAButton from "./CTAButton"
import { logEvent } from "firebase/analytics"
import { fire } from "@web/modules/firebase"


export default function JoinForm() {

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
        logEvent(fire.analytics, "begin_checkout")

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

    const signupCount = waitlist?.allowOverflowSignups ?
        waitlist?.signupCount :
        Math.min(waitlist?.signupCount, waitlist?.maxSignupCount)

    const signupProgress = waitlist?.signupCount && waitlist?.maxSignupCount ?
        waitlist?.signupCount / waitlist?.maxSignupCount * 100 :
        0

    const isWaitlistFull = waitlist?.allowOverflowSignups ?
        false :
        waitlist?.signupCount >= waitlist?.maxSignupCount

    return (<>
        <form
            onSubmit={form.onSubmit(handleSubmit)}
            className="w-full max-w-xs"
        >
            <Stack>
                {successfulEmail ? <>
                    <JoinCardHeading icon={TbCheck}>You're signed up!</JoinCardHeading>

                    <Text className="text-center text-gray">
                        {successfulEmail}
                    </Text>

                    <Text className="text-center text-gray">
                        Watch your inbox for updates.
                    </Text>
                </> :
                    isWaitlistFull ? <>
                        <JoinCardHeading icon={TbGift}>That's a wrap!</JoinCardHeading>

                        <Text className="text-center text-gray">
                            The waitlist is full.
                        </Text>
                    </> : <>
                        <JoinCardHeading icon={TbBallpen}>Join the waitlist!</JoinCardHeading>

                        <Text className="text-center text-gray">
                            You'll get early access to the app.
                        </Text>

                        <TextInput
                            placeholder="Email"
                            size="lg" radius="xl"
                            icon={<TbMail />}
                            type="email" variant="filled" name="email" required
                            classNames={{
                                input: "border-none outline outline-1 outline-transparent focus:outline-[var(--wl-primary)] focus:outline"
                            }}
                            {...form.getInputProps("email")}
                        />

                        <CTAButton
                            className={classNames({ "shadow-md": form.isValid() })}
                            // disabled={!form.isValid()}
                            type="submit"
                            showPrice
                        >
                            Join Waitlist
                        </CTAButton>
                    </>}



                <Stack className="mt-10">
                    <Text className="text-center font-bold">
                        {signupCount > 0 ?
                            `${formatNumber(signupCount)} signed up!` :
                            "Be the first to sign up!"}
                    </Text>

                    {!!waitlist?.maxSignupCount &&
                        <div>
                            <Progress
                                value={signupProgress}
                                radius="xl" className="h-4"
                                classNames={{
                                    bar: "bg-[var(--wl-secondary)]",
                                }}
                            />

                            <Text className="text-gray text-sm mt-1 mr-xs text-right">
                                {formatNumber(signupCount)} / {formatNumber(waitlist?.maxSignupCount)}
                            </Text>
                        </div>}
                </Stack>
            </Stack>
        </form>

        {!successfulEmail &&
            <Badge
                size="lg"
                className="self-center wl-secondary-dark-on-light !normal-case absolute top-0 right-0 scale-125 rotate-12 shadow-lg"
            >
                {waitlist?.maxSignupCount ? "Limited Spots!" : "Join Now!"}
            </Badge>}
    </>)
}


function JoinCardHeading({ icon: Icon, children }) {
    return (
        <Group noWrap className="justify-center my-md">
            <ThemeIcon
                size="lg" radius="md" className="bg-[var(--wl-secondary)]"
                onDoubleClick={confirmClearEmail}
            >
                <Icon />
            </ThemeIcon>

            <Text className="font-bold text-2xl whitespace-nowrap">
                {children}
            </Text>
        </Group>
    )
}


function usePreviousEmails() {
    return useLocalStorage({
        key: "previouslyUsedEmails",
        defaultValue: [],
    })
}


// eslint-disable-next-line no-unused-vars
function PreviousEmails({ onSelectEmail }) {

    const [previousEmails] = usePreviousEmails()

    const hotkeyHandlers = useMemo(() => previousEmails?.map((email, i) => [
        `${i + 1}`,
        () => onSelectEmail?.(email),
    ]) || [], [previousEmails?.join()])

    useHotkeys(hotkeyHandlers)

    return previousEmails?.length > 0 &&
        <Stack className="gap-xs my-md">
            <Text className="text-gray text-xs text-center">
                Previously Used
            </Text>
            {previousEmails?.map((email, i) =>
                <button
                    className="bg-white hover:bg-gray-100 border-none outline-none rounded-md flex items-center gap-xs cursor-pointer px-xs py-1"
                    type="button" onClick={() => onSelectEmail?.(email)}
                    key={email}
                >
                    <Kbd size="xs">{i + 1}</Kbd>
                    <Text className="text-xs">{email}</Text>
                </button>
            )}
        </Stack>
}


const confirmClearEmail = () => {
    modals.openConfirmModal({
        title: "Clear email?",
        children: "Are you sure you want to clear your email? This only affects your browser, not the waitlist.",
        labels: {
            confirm: "Clear Email",
            cancel: "Cancel",
        },
        confirmProps: {
            color: "red",
        },
        cancelProps: {
            variant: "subtle",
            color: "gray",
        },
        onConfirm: () => {
            localStorage.removeItem(SUCCESSFUL_EMAIL_LS_KEY)
            localStorage.removeItem(SUBMITTED_EMAIL_LS_KEY)
            window.location.reload()
        },
    })
}