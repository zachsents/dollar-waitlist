import { Anchor, Center, Group, Menu } from "@mantine/core"
import { TbMenu2 } from "react-icons/tb"
import Brand from "./Brand"


export default function Header() {
    return (
        <header className="fixed z-10 top-0 left-0 w-full p-xl">
            <Group noWrap className="gap-10 justify-between max-w-7xl mx-auto w-full">
                <Brand />

                <Group noWrap className="hidden md:flex gap-lg [&_a]:font-bold [&_a]:text-dark">
                    <Anchor href="#showcase">Showcase</Anchor>
                    <Anchor href="#benefits">Benefits</Anchor>
                    <Anchor href="#testimonials">Testimonials</Anchor>
                    <Anchor href="#team">Team</Anchor>
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
