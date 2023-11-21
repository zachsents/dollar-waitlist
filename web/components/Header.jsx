import { Anchor, Center, Group, Menu } from "@mantine/core"
import { useWindowScroll } from "@mantine/hooks"
import { useCurrentWaitlist, useWaitlistCSSVariables } from "@web/modules/hooks"
import classNames from "classnames"
import { TbMenu2 } from "react-icons/tb"
import Brand from "./Brand"


export default function Header() {

    const [waitlist] = useCurrentWaitlist()
    const cssVariables = useWaitlistCSSVariables(waitlist)

    const [{ y: windowScroll }] = useWindowScroll()
    const isScrolled = windowScroll > 25

    return (
        <header className="fixed z-10 top-0 left-0 w-full p-xl" style={cssVariables}>
            <Group noWrap className="gap-10 justify-between max-w-7xl mx-auto w-full">
                <Brand className={classNames(
                    "hover:opacity-100 transition-opacity",
                    isScrolled ? "opacity-50" : "opacity-100"
                )} />

                <Group noWrap className="hidden md:flex gap-lg">
                    <NavLink href="#showcase">Showcase</NavLink>
                    <NavLink href="#benefits">Benefits</NavLink>
                    <NavLink href="#testimonials">Testimonials</NavLink>
                    <NavLink href="#team">Team</NavLink>
                </Group>

                <Menu position="bottom-end">
                    <Menu.Target>
                        <Center className="md:hidden text-3xl p-6 -m-6">
                            <TbMenu2 />
                        </Center>
                    </Menu.Target>
                    <Menu.Dropdown className="md:hidden">
                        <Menu.Item>Item 1</Menu.Item>
                        <Menu.Item>Item 2</Menu.Item>
                        <Menu.Item>Item 3</Menu.Item>
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