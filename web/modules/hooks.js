import { useDocument } from "@zachsents/fire-query"
import { useRouter } from "next/router"
import { useMemo } from "react"
import { useMantineTheme } from "@mantine/core"


export function useCurrentWaitlist() {
    const router = useRouter()
    const waitlistQuery = useDocument(["waitlists", router.query.waitlistId])
    return [waitlistQuery.data, waitlistQuery]
}


export function useCurrentWaitlistCSSVariables() {
    const theme = useMantineTheme()
    const [waitlist] = useCurrentWaitlist()

    const primary = waitlist?.colors.primary || "gray"
    const secondary = waitlist?.colors.secondary || waitlist?.colors.primary || "gray"

    return useMemo(() => ({
        "--wl-primary": primary,
        "--wl-primary-light": theme.fn.lighten(primary, 0.65),
        "--wl-primary-light-2": theme.fn.lighten(primary, 0.85),
        "--wl-primary-dark": theme.fn.darken(primary, 0.25),
        "--wl-secondary": secondary,
        "--wl-secondary-light": theme.fn.lighten(secondary, 0.65),
        "--wl-secondary-light-2": theme.fn.lighten(secondary, 0.85),
        "--wl-secondary-dark": theme.fn.darken(secondary, 0.25),
    }), [waitlist])
}