import { useDocument } from "@zachsents/fire-query"
import { useRouter } from "next/router"

export function useCurrentWaitlist() {
    const router = useRouter()
    const waitlistQuery = useDocument(["waitlists", router.query.waitlistId])
    return [waitlistQuery.data, waitlistQuery]
}