import { Text } from "@mantine/core"
import { useForceUpdate } from "@mantine/hooks"
import classNames from "classnames"
import { useState } from "react"


export default function HeroDemo({ imageSource, labels }) {

    const [containerTopMargin, setContainerTopMargin] = useState(0)
    const [containerBottomMargin, setContainerBottomMargin] = useState(0)

    const forceUpdate = useForceUpdate()

    return (
        <div className="w-full">
            <div
                className="relative w-full"
                style={{
                    marginTop: containerTopMargin ? `${containerTopMargin}px` : 0,
                    marginBottom: containerBottomMargin ? `${containerBottomMargin}px` : 0,
                }}
                ref={el => {
                    const { top: containerTop, bottom: containerBottom } = el?.getBoundingClientRect() || {}
                    const { top: absTop, bottom: absBottom } = getAbsoluteVerticalBounds(el)
                    setContainerTopMargin(containerTop - absTop)
                    setContainerBottomMargin(absBottom - containerBottom)
                }}
            >
                {imageSource &&
                    <img
                        onLoad={forceUpdate}
                        src={imageSource}
                        className="w-full rounded-xl base-border shadow-sm"
                    />}

                {labels?.map((label, i) =>
                    <div
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{
                            top: `${label.y}%`,
                            left: `${label.x}%`,
                            "--labelOffset": `${label.offset}px`,
                        }}
                        key={i}
                    >
                        <svg
                            className={classNames(
                                "absolute w-4 h-[var(--labelOffset)] bottom-1/2 left-1/2 -translate-x-1/2 origin-[bottom_center]",
                                {
                                    "rotate-0": label.position === "top",
                                    "rotate-180": label.position === "bottom",
                                    "-rotate-90": label.position === "left",
                                    "rotate-90": label.position === "right",
                                }
                            )}
                        >
                            <line
                                x1="50%" y1="0" x2="50%" y2="100%"
                                strokeDasharray="6 4"
                                className="stroke-dark stroke-1"
                            />
                        </svg>

                        <div
                            className="sketch-border bg-[var(--waitlistPrimaryColor)] rounded-full aspect-square w-2 relative"
                        />

                        <div
                            className={classNames(
                                "absolute sketch-border bg-white rounded-md p-xs w-max max-w-[16rem] text-center shadow-md",
                                {
                                    "left-1/2 -translate-x-1/2": label.position === "top" || label.position === "bottom",
                                    "top-1/2 -translate-y-1/2": label.position === "left" || label.position === "right",
                                    "bottom-1/2 mb-[var(--labelOffset)]": label.position === "top",
                                    "top-1/2 mt-[var(--labelOffset)]": label.position === "bottom",
                                    "left-1/2 ml-[var(--labelOffset)]": label.position === "right",
                                    "right-1/2 mr-[var(--labelOffset)]": label.position === "left",
                                }
                            )}
                        >
                            <Text>{label.text}</Text>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}


/**
 * @param {Element} el
 */
function getAbsoluteVerticalBounds(el) {

    if (!el)
        return {}

    const rect = el.getBoundingClientRect()

    const childRects = [...el.children].map(child => getAbsoluteVerticalBounds(child))

    return {
        top: Math.min(rect.top, ...childRects.map(child => child.top)),
        bottom: Math.max(rect.bottom, ...childRects.map(child => child.bottom)),
    }
}