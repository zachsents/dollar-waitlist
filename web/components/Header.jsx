import { Anchor, Center, Group, Menu } from "@mantine/core"
import { useWindowScroll } from "@mantine/hooks"
import { useCurrentWaitlist, useSectionLabel, useWaitlistCSSVariables } from "@web/modules/hooks"
import classNames from "classnames"
import { TbMenu2 } from "react-icons/tb"
import Brand from "./Brand"


export default function Header() {

    const [waitlist] = useCurrentWaitlist()
    const cssVariables = useWaitlistCSSVariables(waitlist)

    const [{ y: windowScroll }] = useWindowScroll()
    const isScrolled = windowScroll > 25

    return (
        <header className="fixed z-20 top-0 left-0 w-full p-xl" style={cssVariables}>
            <Group noWrap className="gap-10 justify-between max-w-7xl mx-auto w-full">
                <Brand className={classNames(
                    "hover:opacity-100 transition-opacity",
                    isScrolled ? "opacity-50" : "opacity-100"
                )} />

                <Group noWrap className="hidden lg:flex gap-lg">
                    <SectionNavLink slug="showcase" />
                    <SectionNavLink slug="benefits" />
                    <SectionNavLink slug="testimonials" />
                    <SectionNavLink slug="team" />
                </Group>

                <Menu position="bottom-end" shadow="xl" offset={0} classNames={{
                    itemLabel: "font-bold text-lg px-sm",
                    dropdown: "py-sm",
                }}>
                    <Menu.Target>
                        <Center className="lg:hidden text-3xl p-6 -m-6">
                            <TbMenu2 />
                        </Center>
                    </Menu.Target>
                    <Menu.Dropdown className="lg:hidden">
                        <Menu.Item component="a" href="#showcase">Showcase</Menu.Item>
                        <Menu.Item component="a" href="#benefits">Benefits</Menu.Item>
                        <Menu.Item component="a" href="#testimonials">Testimonials</Menu.Item>
                        <Menu.Item component="a" href="#team">Team</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>
        </header>
    )
}


function NavLink({ ...props }) {
    return (
        <Anchor
            className="text-dark font-bold hover:text-[var(--wl-primary)] no-underline hover:no-underline"
            // component={Link}
            {...props}
        />
    )
}

function SectionNavLink({ slug, defaultLabel = "" }) {

    const label = useSectionLabel(slug) || defaultLabel

    return (
        <NavLink href={`#${slug}`}>{label}</NavLink>
    )
}