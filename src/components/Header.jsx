import { Flex, Heading, Text } from "@chakra-ui/react"

export default function Header() {
    return (
        <Flex alignItems={"center"} justifyContent="center" flexDirection={"column"} mb={10}>
            <Heading mb={0} fontSize={36}>
                ERC-20 Token Indexer
            </Heading>
            <Text fontSize={26}>
                Plug in an address and this website will return all of its ERC-20 token balances!
            </Text>
        </Flex>
    )
}
