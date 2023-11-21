import { Skeleton } from "@mantine/core"
import { useEffect, useRef } from "react"
import { useMutation, useQuery } from "react-query"


export default function Tweet({ url, id }) {

    const [twitterGlobal] = useTwitterGlobal()

    if (!id && url) {
        id = url.split("/").pop()
    }

    const ref = useRef()

    const renderTweetMutation = useMutation({
        mutationFn: async () => {
            ref.current.textContent = ""
            await twitterGlobal.widgets.createTweet(id, ref.current, {
                conversation: "none",
            })
        },
    })

    useEffect(() => {
        if (!id || !ref.current || !twitterGlobal)
            return

        renderTweetMutation.mutate()
    }, [id, ref.current, !!twitterGlobal])

    return (
        <div>
            <div className="[&_.twitter-tweet]:!m-0" ref={ref} />
            {renderTweetMutation.isLoading &&
                <Skeleton className="w-full h-40" />}
        </div>
    )
}



function useTwitterGlobal() {
    const query = useQuery({
        queryKey: ["twitter-global"],
        queryFn: () => new Promise(resolve => {
            const intervalId = setInterval(() => {
                if (global.twttr) {
                    clearInterval(intervalId)
                    resolve(global.twttr)
                }
            }, 100)
        }),
    })
    return [query.data, query]
}