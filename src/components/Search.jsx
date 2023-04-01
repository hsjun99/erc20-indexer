import { Input, Button, Stack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useQueryClient } from "react-query"

export default function Search({ userAddress, setUserAddress, isTokenLoading }) {
    const [address, setAddress] = useState("")

    useEffect(() => {
        setAddress(userAddress)
    }, [userAddress])

    async function resolveENSNameToAddress(ensName) {
        const address = await provider.resolveName(ensName)
        return address
    }

    return (
        <Stack>
            <Input
                onChange={(e) => {
                    if (e.target.value.slice(0, 2) === "0x") {
                        // if user is entering an address
                        setAddress(e.target.value)
                    } else {
                        // if user is entering an ENS name
                        resolveENSNameToAddress(e.target.value).then((address) => {
                            setAddress(address)
                        })
                    }
                }}
                color="black"
                w="600px"
                textAlign="center"
                p={4}
                bgColor="white"
                fontSize={24}
                placeholder="Enter address or ENS name."
                value={address}
            />
            <Button
                fontSize={20}
                onClick={(e) => setUserAddress(address)}
                colorScheme="blue"
                disabled={isTokenLoading}
            >
                {isTokenLoading ? "Loading..." : "Check ERC-20 Token Balances"}
            </Button>
        </Stack>
    )
}
