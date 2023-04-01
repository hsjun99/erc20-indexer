import {
    Box,
    SimpleGrid,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from "@chakra-ui/react"
import { useQuery } from "react-query"
import { useEffect } from "react"
import TokenCard from "./TokenCard"
import { Alchemy, Network } from "alchemy-sdk"

export default function TokenList({ userAddress, setIsTokenLoading }) {
    const config = {
        apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
        network: Network.ETH_MAINNET,
    }

    const alchemy = new Alchemy(config)

    async function getTokenBalance() {
        const { tokenBalances } = await alchemy.core.getTokenBalances(userAddress)

        const tokenDataPromises = []

        for (let i = 0; i < tokenBalances.length; i++) {
            const tokenData = alchemy.core.getTokenMetadata(tokenBalances[i].contractAddress)
            tokenDataPromises.push(tokenData)
        }

        return {
            tokenBalances,
            tokenDataObjects: await Promise.all(tokenDataPromises),
        }
    }

    const { data, isSuccess, isFetching, isLoading, isError, error } = useQuery(
        ["tokenBalance", userAddress],
        getTokenBalance,
        {
            enabled: !!userAddress,
            // refetchInterval: 5000
        }
    )

    useEffect(() => {
        setIsTokenLoading(isLoading || isFetching)
    }, [isLoading, isFetching])

    return (
        <>
            {(isLoading || isFetching) && (
                <Box mt={10}>
                    <Spinner color="red.500" size="xl" />
                </Box>
            )}

            {isError && (
                <Alert
                    status="error"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    height="200px"
                    width="600px"
                    mt={10}
                >
                    <AlertIcon boxSize="40px" mr={0} />
                    <Box>
                        <AlertTitle mt={4} mb={1} fontSize="lg">
                            Error
                        </AlertTitle>
                        <AlertDescription maxWidth="sm">{error.message}</AlertDescription>
                    </Box>
                </Alert>
            )}

            {isSuccess && (
                <SimpleGrid
                    mt={10}
                    spacing={3}
                    columns={data.tokenBalances.length >= 5 ? 5 : data.tokenBalances.length}
                    mr="32px"
                    ml="32px"
                >
                    {data.tokenBalances.map((e, i) => {
                        return (
                            <TokenCard
                                key={i}
                                tokenBalance={e.tokenBalance}
                                tokenDataObject={data.tokenDataObjects[i]}
                            />
                        )
                    })}
                </SimpleGrid>
            )}
        </>
    )
}
