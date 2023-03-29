import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Image,
    Input,
    SimpleGrid,
    Text,
    Spacer,
    Spinner,
} from "@chakra-ui/react"
import { Alchemy, Network, Utils } from "alchemy-sdk"
import { useState } from "react"
import Web3Modal from "web3modal"
import { ethers } from "ethers"
// import CoinbaseWalletSDK from "@coinbase/wallet-sdk"
// import WalletConnect from "@walletconnect/web3-provider"

function App() {
    const [userAddress, setUserAddress] = useState("")
    const [results, setResults] = useState([])
    const [hasQueried, setHasQueried] = useState(false)
    const [tokenDataObjects, setTokenDataObjects] = useState([])
    const [connectedAccount, setConnectedAccount] = useState("")

    const providerOptions = {
        binancechainwallet: {
            package: true,
        },
        // walletconnect: {
        //     package: WalletConnect, // required
        //     options: {
        //         infuraId: process.env.REACT_APP_ALCHEMY_API_KEY, // required
        //     },
        // },
        // coinbasewallet: {
        //     package: CoinbaseWalletSDK, // Required
        //     options: {
        //         appName: "Coinbase", // Required
        //         infuraId: process.env.REACT_APP_ALCHEMY_API_KEY, // Required
        //         chainId: 5,
        //     },
        // },
    }

    const web3Modal = new Web3Modal({
        network: "goerli",
        theme: "light", // optional, 'dark' / 'light',
        cacheProvider: false, // optional
        providerOptions, // required
    })

    async function connectWeb3Wallet() {
        try {
            const web3Provider = await web3Modal.connect()
            const library = new ethers.providers.Web3Provider(web3Provider)
            const web3Accounts = await library.listAccounts()
            const network = await library.getNetwork()
            setConnectedAccount(web3Accounts[0])
        } catch (error) {
            console.log(error)
        }
    }

    async function disconnectWeb3Modal() {
        await web3Modal.clearCachedProvider()
        setConnectedAccount("")
    }

    async function getTokenBalance() {
        setHasQueried(false)
        const config = {
            apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
            network: Network.ETH_GOERLI,
        }

        const alchemy = new Alchemy(config)
        const data = await alchemy.core.getTokenBalances(connectedAccount)

        setResults(data)

        const tokenDataPromises = []

        for (let i = 0; i < data.tokenBalances.length; i++) {
            const tokenData = alchemy.core.getTokenMetadata(data.tokenBalances[i].contractAddress)
            tokenDataPromises.push(tokenData)
        }

        setTokenDataObjects(await Promise.all(tokenDataPromises))
        setHasQueried(true)
    }
    return (
        <Box w="100vw">
            <Flex minWidth="max-content" alignItems="center" gap="2">
                <Box p="2">
                    <Text>{connectedAccount && <p>Connected to ${connectedAccount}</p>}</Text>
                    {/* <Heading size="md">Chakra App</Heading> */}
                </Box>
                <Spacer />

                {!connectedAccount ? (
                    <Button onClick={connectWeb3Wallet}>Connect Wallet</Button>
                ) : (
                    <Button onClick={disconnectWeb3Modal}>Disconnect Wallet</Button>
                )}
            </Flex>
            <Center>
                <Flex alignItems={"center"} justifyContent="center" flexDirection={"column"}>
                    <Heading mb={0} fontSize={36}>
                        ERC-20 Token Indexer
                    </Heading>
                    <Text>
                        Plug in an address and this website will return all of its ERC-20 token
                        balances!
                    </Text>
                </Flex>
            </Center>
            <Flex w="100%" flexDirection="column" alignItems="center" justifyContent={"center"}>
                <Heading mt={42}>Get all the ERC-20 token balances of this address:</Heading>
                <Text
                    color="black"
                    w="600px"
                    textAlign="center"
                    p={4}
                    bgColor="white"
                    fontSize={24}
                >
                    {connectedAccount}
                </Text>
                {/* <Input
                    onChange={(e) => setUserAddress(e.target.value)}
                    color="black"
                    w="600px"
                    textAlign="center"
                    p={4}
                    bgColor="white"
                    fontSize={24}
                /> */}
                <Button fontSize={20} onClick={getTokenBalance} mt={36} bgColor="blue">
                    Check ERC-20 Token Balances
                </Button>

                <Heading my={36}>ERC-20 token balances:</Heading>

                {hasQueried ? (
                    <SimpleGrid w={"90vw"} columns={3} spacing={24}>
                        {results.tokenBalances.map((e, i) => {
                            return (
                                <Flex
                                    flexDir={"column"}
                                    color="white"
                                    bg="blue"
                                    w={"30vw"}
                                    key={e.id}
                                >
                                    <Box>
                                        <b>Symbol:</b> ${tokenDataObjects[i].symbol}&nbsp;
                                    </Box>
                                    <Box>
                                        <b>Balance:</b>&nbsp;
                                        {Utils.formatUnits(
                                            e.tokenBalance,
                                            tokenDataObjects[i].decimals
                                        )}
                                    </Box>
                                    <Image src={tokenDataObjects[i].logo} />
                                </Flex>
                            )
                        })}
                    </SimpleGrid>
                ) : results.length != 0 ? (
                    <Flex alignItems={"center"} flexDirection="column">
                        <Box>
                            <Spinner size="xl" />
                        </Box>
                        <Box>
                            <Text>This may take a few seconds...</Text>
                        </Box>
                    </Flex>
                ) : (
                    <Box></Box>
                )}
            </Flex>
        </Box>
    )
}

export default App
