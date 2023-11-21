import { Avatar, Badge, Card, Group, Text } from "@mantine/core"
import { useStorageUrl } from "@web/modules/firebase/storage"
import { TbBrandGithub, TbBrandLinkedin, TbBrandTwitter } from "react-icons/tb"


export default function TeamMemberCard({ avatar, name, title, linkedin, twitter, badges, github }) {

    const { data: avatarUrl } = useStorageUrl(avatar)

    const badgeGroup =
        <Group className="gap-1 mt-md justify-center md:justify-start">
            {badges.map((badge, i) =>
                <Badge
                    className="wl-primary-dark-on-light"
                    key={i}
                >
                    {badge}
                </Badge>
            )}
        </Group>

    return (
        <Card withBorder className="rounded-xl px-xl py-10 md:p-10 shadow-sm">
            <Group noWrap className="flex-col md:flex-row justify-between">
                <Group noWrap className="gap-xl">
                    <Avatar src={avatarUrl} className="h-20 w-auto aspect-square rounded-full shrink-0" />

                    <div>
                        <Text className="font-medium text-lg">{name}</Text>
                        <Text className="text-gray">{title}</Text>

                        <div className="hidden md:block">
                            {badgeGroup}
                        </div>
                    </div>
                </Group>

                <div className="md:hidden">
                    {badgeGroup}
                </div>

                <Group noWrap className="text-xl gap-0">
                    <SocialLink
                        icon={TbBrandLinkedin}
                        href={linkedin}
                    />
                    <SocialLink
                        icon={TbBrandTwitter}
                        href={twitter}
                    />
                    <SocialLink
                        icon={TbBrandGithub}
                        href={github}
                    />
                </Group>
            </Group>
        </Card>
    )
}


function SocialLink({ icon: Icon, href }) {

    return href && (
        <a
            href={href}
            className="text-3xl text-gray-500 hover:text-[var(--wl-primary)] flex justify-center items-center px-xs py-md"
            target="_blank" rel="noreferrer"
        >
            <Icon />
        </a>
    )
}