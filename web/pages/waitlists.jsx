import { ActionIcon, Badge, Card, Group, Stack, Text, Title, Tooltip } from "@mantine/core"
import { signOut, useMustBeSignedIn } from "@web/modules/firebase"
import { useCollectionQuery } from "@zachsents/fire-query"
import { where } from "firebase/firestore"
import Link from "next/link"
import { TbEye, TbPencil, TbSettings } from "react-icons/tb"


export default function DashboardPage() {

    const user = useMustBeSignedIn()

    const waitlistQuery = useCollectionQuery(["waitlists"], [
        user && where("owner", "==", user?.uid)
    ])

    return (
        <div>
            <header className="sticky top-0 border-solid border-0 border-b-1 border-dark shadow-md py-2 bg-gray-100">
                <Group noWrap className="w-full max-w-7xl mx-auto gap-16 justify-between">
                    <Group noWrap className="gap-16">
                        <Text
                            component={Link} href="/"
                            className="text-2xl text-primary-600 font-bold"
                        >
                            Dollar Waitlist
                        </Text>
                        <Group noWrap className="gap-xl">
                            <NavLink href="/waitlists">
                                My Waitlists
                            </NavLink>
                            <NavLink href="/create">
                                Create a Waitlist
                            </NavLink>
                        </Group>
                    </Group>

                    <Group noWrap>
                        <NavLink onClick={signOut}>
                            Sign Out
                        </NavLink>
                    </Group>
                </Group>
            </header>
            <Stack className="w-full max-w-5xl mx-auto my-10">
                <Title order={1}>
                    My Waitlists
                </Title>
                <div className="grid grid-cols-3">
                    {waitlistQuery.data?.map(waitlist =>
                        <Stack className="gap-xs" key={waitlist.id}>
                            <Tooltip label={`Open "${waitlist.name}"`}>
                                <Card
                                    className="rounded-lg shadow-md sketch-border p-0 hover:shadow-lg hover:scale-102 transition relative"
                                    component={Link} href={`/waitlist/${waitlist.id}/settings`}
                                >
                                    <div className="h-10" style={{
                                        backgroundColor: waitlist.colors.primary,
                                    }} />
                                    <Stack className="p-lg gap-md">
                                        <div>
                                            <Title order={3} className="text-xl font-bold line-clamp-1">{waitlist.name}</Title>
                                            <Text className="line-clamp-2">
                                                {waitlist.content.headline}
                                            </Text>
                                        </div>
                                        <Text className="font-bold text-2xl">
                                            $343
                                        </Text>
                                        <Badge color="gray" className="self-start">
                                            Free Plan
                                        </Badge>
                                    </Stack>
                                    <TbSettings className="absolute bottom-lg right-lg" />
                                </Card>
                            </Tooltip>
                            <Group className="justify-center gap-xs">
                                <Tooltip label="Edit">
                                    <ActionIcon
                                        variant="outline" color="dark" size="lg"
                                        className="bg-white"
                                        component={Link} href={`/waitlist/${waitlist.id}/edit`}
                                    >
                                        <TbPencil />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Preview">
                                    <ActionIcon
                                        variant="outline" color="dark" size="lg"
                                        className="bg-white"
                                        component={Link} href={`/waitlist/${waitlist.id}`}
                                    >
                                        <TbEye />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Stack>
                    )}
                </div>
            </Stack>
        </div>
    )
}

function NavLink({ children, onClick, href, ...props }) {
    return (
        <Text
            component={href ? Link : undefined}
            href={href}
            onClick={onClick}
            className="no-underline text-dark hover:text-primary-600 font-bold cursor-pointer"
            {...props}
        >
            {children}
        </Text>
    )
}