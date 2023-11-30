import { Center, Stack, Text, ThemeIcon } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import { SUBMITTED_EMAIL_LS_KEY, SUCCESSFUL_EMAIL_LS_KEY } from "@web/modules/util"
import { getAnalytics, logEvent } from "firebase/analytics"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { TbCheck } from "react-icons/tb"


export default function WaitlistPaymentSuccessPage() {

    const router = useRouter()

    const [submittedEmail] = useLocalStorage({
        key: SUBMITTED_EMAIL_LS_KEY,
    })

    const goToWaitlist = () => router.replace(`/waitlist/${router.query.waitlistId}`)

    useEffect(() => {
        if (!router.isReady)
            return

        if (!submittedEmail) {
            goToWaitlist()
            return
        }

        localStorage.setItem(SUCCESSFUL_EMAIL_LS_KEY, submittedEmail)
        localStorage.removeItem(SUBMITTED_EMAIL_LS_KEY)
        logEvent(getAnalytics(), "purchase")
        setTimeout(goToWaitlist, 1000)
    }, [submittedEmail, router.isReady])

    return (
        <Center className="fixed top-0 left-0 w-screen h-screen">
            <Stack className="items-center text-center">
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}
                >
                    <ThemeIcon size="xl" radius="xl" color="">
                        <TbCheck />
                    </ThemeIcon>
                </motion.div>
                <Text className="text-xl font-medium">You've joined the waitlist!</Text>
                <Text className="text-gray">{submittedEmail || <>&nbsp;</>}</Text>
            </Stack>
        </Center>
    )
}
