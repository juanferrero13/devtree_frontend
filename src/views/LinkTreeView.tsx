import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { updateProfile } from "../api/DevTreeAPI"
import { DevTreeInput } from "../components/DevTreeInput"
import { social } from "../data/social"
import { SocialNetwork, User } from "../types"
import { isValidUrl } from "../utils"

export const LinkTreeView = () => {
    const [devTreeLinks, setDevTreeLinks] = useState(social)

    const queryClient = useQueryClient()
    const user: User = queryClient.getQueryData(["user"])!
    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Actualizado correctamente")
        },
    })

    useEffect(() => {
        const updateData = devTreeLinks.map((item) => {
            const userLink = JSON.parse(user.links).find(
                (link: SocialNetwork) => link.name === item.name
            )
            if (userLink) {
                return {
                    ...item,
                    url: userLink.url,
                    enabled: userLink.enabled,
                }
            }
            return item
        })
        setDevTreeLinks(updateData)
    }, [])

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedLinks = devTreeLinks.map((link) =>
            link.name === e.target.name
                ? { ...link, url: e.target.value }
                : link
        )
        setDevTreeLinks(updatedLinks)
    }

    const links: SocialNetwork[] = JSON.parse(user.links)

    const handleEnableLink = (socialNetwork: string) => {
        const updatedLinks = devTreeLinks.map((link) => {
            if (link.name === socialNetwork) {
                if (isValidUrl(link.url)) {
                    return { ...link, enabled: !link.enabled }
                } else {
                    toast.error("URL no Válida")
                    return link
                }
            }
            return link
        })
        // setDevTreeLinks(updatedLinks)

        let updatedItems: SocialNetwork[] = []
        const selectedSocialNetwork = updatedLinks.find(
            (link) => link.name === socialNetwork
        )
        if (selectedSocialNetwork?.enabled) {
            // const id = links.filter((link) => link.enabled).length + 1
            const id = links.filter((link) => link.enabled).length + 1
            if (links.some((link) => link.name === socialNetwork)) {
                updatedItems = links.map((link) =>
                    link.name === socialNetwork
                        ? { ...link, enabled: true, id }
                        : link
                )
            } else {
                const newItem = {
                    ...selectedSocialNetwork,
                    id,
                }
                updatedItems = [...links, newItem]
            }
        } else {
            // Disabling the link
            const indexToDisable = links.findIndex(
                (link) => link.name === socialNetwork
            )
            updatedItems = links.map((link) => {
                // prettier-ignore
                if (link.name === socialNetwork) {
                    return {
                        ...link,
                        id: 0,
                        enabled: false,
                    }
                } else if (link.id > links[indexToDisable].id) {
                    return {
                        ...link,
                        id: link.id - 1,
                    }
                } else {
                    return link
                }
            })
        }

        setDevTreeLinks(updatedLinks) // => La asignación de devTreeLinks va al final del proceso

        // Almacenar en DB
        queryClient.setQueryData(["user"], (prevData: User) => {
            return {
                ...prevData,
                links: JSON.stringify(updatedItems),
            }
        })
    }

    return (
        <>
            <div className="space-y-5">
                {devTreeLinks.map((item) => (
                    <DevTreeInput
                        key={item.name}
                        item={item}
                        handleUrlChange={handleUrlChange}
                        handleEnableLink={handleEnableLink}
                    />
                ))}
                <button
                    className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded font-bold"
                    onClick={() => mutate(queryClient.getQueryData(["user"])!)}
                >
                    Guardar Cambios
                </button>
            </div>
        </>
    )
}
