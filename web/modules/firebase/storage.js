import { getDownloadURL, ref } from "firebase/storage"
import { fire } from "."
import { useMemo } from "react"
import { useQuery } from "react-query"


export function useStorageRef(path) {
    return useMemo(() => path && ref(fire.storage, path), [path])
}

export function useStorageUrl(path) {
    const storageRef = useStorageRef(path)
    return useQuery({
        queryFn: () => storageRef && getDownloadURL(storageRef),
        queryKey: ["download-url", path],
    })
}

export function usePublicStorageUrl(path) {
    return `https://storage.googleapis.com/wait-for-it-aa4fd.appspot.com/${path}`
}