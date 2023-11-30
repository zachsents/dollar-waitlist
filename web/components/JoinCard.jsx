import { Center, Overlay, Paper } from "@mantine/core"
import { useClickOutside } from "@mantine/hooks"
import { useStore } from "@web/modules/store"
import classNames from "classnames"
import { motion } from "framer-motion"
import JoinForm from "./JoinForm"


export default function JoinCard() {

    const showingMobileCard = useStore(s => s.mobileCardOpen)
    const openMobileCard = useStore(s => s.openMobileCard)
    const closeMobileCard = useStore(s => s.closeMobileCard)

    const mobileCardRef = useClickOutside(closeMobileCard)

    return (<>
        <div
            className="hidden lg:flex grow max-w-[24rem] h-screen sticky z-[100] top-0 py-12 flex-col gap-16 justify-center"
        >
            <Center
                component={Paper} withBorder
                className="w-full relative rounded-xl shadow-lg px-xl py-16"
            >
                <JoinForm />
            </Center>
        </div>

        <Center className="lg:hidden fixed left-0 top-0 w-screen h-screen z-[100] pointer-events-none px-xl">
            <Overlay
                className={classNames(
                    "fixed z-[1] transition-opacity",
                    showingMobileCard ?
                        "opacity-50 duration-500 pointer-events-auto" :
                        "opacity-0 duration-100 pointer-events-none",
                )}
            />

            <motion.div
                variants={{
                    hidden: { y: "calc(50vh + 50% - 8rem)" },
                    visible: { y: 0 },
                }}
                className="z-[2] pointer-events-auto"
                initial="hidden"
                animate={showingMobileCard ? "visible" : "hidden"}
                onPointerDown={showingMobileCard ? undefined : openMobileCard}
                ref={mobileCardRef}
            >
                <Center
                    component={Paper} withBorder
                    className="w-full relative rounded-xl shadow-lg px-xl py-16"
                >
                    <JoinForm />
                </Center>
            </motion.div>
        </Center>
    </>)
}
