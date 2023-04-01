import { Button, useToast } from "@chakra-ui/react"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { trimAddress } from "../utils/format"
import Web3Modal from "web3modal"
// import CoinbaseWalletSDK from "@coinbase/wallet-sdk"
// import WalletConnect from "@walletconnect/web3-provider"

export default function AuthButton({ setUserAddress }) {
    const toast = useToast()
    if (!window.ethereum) {
        toast({
            title: "Please install Wallet to continue.",
            status: "warning",
            isClosable: false,
        })
        return
    }

    const [connectedAccount, setConnectedAccount] = useState()
    const [ensName, setEnsName] = useState()
    const provider = new ethers.providers.Web3Provider(window.ethereum)

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
        network: "mainnet",
        theme: "light", // optional, 'dark' / 'light',
        cacheProvider: false, // optional
        providerOptions, // required
    })

    async function loadENSName(address) {
        const ensName = await provider.lookupAddress(address)
        if (!!ensName) setEnsName(ensName)
    }

    async function connectWeb3Wallet() {
        try {
            const web3Provider = await web3Modal.connect()
            const library = new ethers.providers.Web3Provider(web3Provider)
            const web3Accounts = await library.listAccounts()
            // const network = await library.getNetwork()

            setConnectedAccount(web3Accounts[0])
            setUserAddress(web3Accounts[0])
            await loadENSName(web3Accounts[0])
        } catch (error) {
            console.log(error)
        }
    }

    async function disconnectWeb3Wallet() {
        await web3Modal.clearCachedProvider()
        setConnectedAccount("")
        setUserAddress("")
        setEnsName("")
    }

    useEffect(() => {
        const setAddressToAccount = async () => {
            await connectWeb3Wallet()
        }

        setAddressToAccount()
    }, [])

    return connectedAccount ? (
        <Button colorScheme="teal" variant="outline" onClick={disconnectWeb3Wallet}>
            {ensName && ensName.length != 0 ? ensName : trimAddress(connectedAccount)}
        </Button>
    ) : (
        <Button colorScheme="teal" variant="solid" onClick={connectWeb3Wallet}>
            Connect Wallet
        </Button>
    )
}
