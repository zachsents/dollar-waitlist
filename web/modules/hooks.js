import { useMantineTheme } from "@mantine/core"
import { getAnalytics, logEvent } from "firebase/analytics"
import { createContext, useContext, useEffect, useMemo, useState } from "react"


export const CurrentWaitlistContext = createContext()

export function useCurrentWaitlist() {
    return [useContext(CurrentWaitlistContext)]
}


export function useWaitlistCSSVariables(waitlist) {

    const theme = useMantineTheme()

    return useMemo(() => {
        const primary = waitlist?.colors.primary || "gray"
        const secondary = waitlist?.colors.secondary || waitlist?.colors.primary || "gray"

        return {
            "--wl-primary": primary,
            "--wl-primary-light": theme.fn.lighten(primary, 0.65),
            "--wl-primary-light-2": theme.fn.lighten(primary, 0.85),
            "--wl-primary-dark": theme.fn.darken(primary, 0.25),
            "--wl-secondary": secondary,
            "--wl-secondary-light": theme.fn.lighten(secondary, 0.65),
            "--wl-secondary-light-2": theme.fn.lighten(secondary, 0.85),
            "--wl-secondary-dark": theme.fn.darken(secondary, 0.25),
        }
    }, [theme, waitlist])
}


const defaultSectionLabels = {
    "demo": "Demo",
    "benefits": "Benefits",
    "features": "Features",
    "testimonials": "Testimonials",
    "team": "Team",
}

export function useSectionLabel(slug) {
    const [waitlist] = useCurrentWaitlist()
    return waitlist?.content.sectionLabels?.[slug] || defaultSectionLabels[slug] || ""
}


export function useLogTest(testId) {

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted && testId) {
            console.debug("Logging test", testId)
            logEvent(getAnalytics(), "screen_view", {
                test_id: testId,
            })
        }
    }, [mounted, testId])
}