import { Text } from "@mantine/core"
import { useForceUpdate, useHover } from "@mantine/hooks"
import classNames from "classnames"
import { useEffect, useState } from "react"


export default function HeroDemo({ imageSource, labels }) {

    const [containerTopMargin, setContainerTopMargin] = useState(0)
    const [containerBottomMargin, setContainerBottomMargin] = useState(0)

    const forceUpdate = useForceUpdate()

    const [hoveredLabelIndex, setHoveredLabelIndex] = useState()

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
                    <Label
                        {...label}
                        onStartHover={() => setHoveredLabelIndex(i)}
                        onEndHover={() => setHoveredLabelIndex(undefined)}
                        hidden={hoveredLabelIndex != null && hoveredLabelIndex !== i}
                        solo={hoveredLabelIndex === i}
                        key={i}
                    />
                )}
            </div>
        </div>
    )
}


function Label({ x, y, position, offset, text, description, onStartHover, onEndHover, hidden = false, solo = false }) {

    const { ref, hovered } = useHover()

    useEffect(() => {
        if (hovered)
            onStartHover?.()
        else
            onEndHover?.()
    }, [hovered])

    return (<>
        <div
            className={classNames(
                "absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity rounded-xl",
                solo ? "opacity-50" : "opacity-0",
            )}
            style={{
                background: `radial-gradient(circle at ${x}% ${y}%, transparent 25%, var(--mantine-color-dark-6) 100%)`,
            }}
        />

        <div
            className={classNames(
                "absolute -translate-x-1/2 -translate-y-1/2 transition-opacity",
                {
                    "opacity-0": hidden,
                },
            )}
            style={{
                top: `${y}%`,
                left: `${x}%`,
                "--labelOffset": `${offset}px`,
            }}
        >
            <svg
                className={classNames(
                    "absolute w-4 h-[var(--labelOffset)] bottom-1/2 left-1/2 -translate-x-1/2 origin-[bottom_center] transition-opacity",
                    {
                        "rotate-0": position === "top",
                        "rotate-180": position === "bottom",
                        "-rotate-90": position === "left",
                        "rotate-90": position === "right",
                        "opacity-0": solo,
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
                className={classNames(
                    "sketch-border bg-[var(--wl-primary)] rounded-full aspect-square w-2 relative transition-opacity",
                    { "opacity-0": solo }
                )}
            />

            <div
                className={classNames(
                    "absolute sketch-border bg-white rounded-md p-xs w-max max-w-[16rem] text-center cursor-default transition",
                    {
                        "left-1/2 -translate-x-1/2": position === "top" || position === "bottom",
                        "top-1/2 -translate-y-1/2": position === "left" || position === "right",
                        "bottom-1/2 mb-[var(--labelOffset)]": position === "top",
                        "top-1/2 mt-[var(--labelOffset)]": position === "bottom",
                        "left-1/2 ml-[var(--labelOffset)]": position === "right",
                        "right-1/2 mr-[var(--labelOffset)]": position === "left",
                    },
                    solo ? "shadow-lg scale-110" : "shadow-md",
                )}
                ref={ref}
            >
                <Text>{text}</Text>
                {description &&
                    <Text className="text-xs text-gray">{description}</Text>}
            </div>
        </div>
    </>)
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