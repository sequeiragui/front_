"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { ethers } from "ethers"

interface Web3ContextType {
  connect: () => Promise<void>
  disconnect: () => void
  isConnected: boolean
  isConnecting: boolean
  address: string | null
  chainId: number | null
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const { toast } = useToast()

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== "undefined" && window.ethereum !== undefined
  }

  // Initialize ethers provider
  const initializeProvider = async () => {
    if (!isMetaMaskInstalled()) return null

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)
      return provider
    } catch (error) {
      console.error("Failed to initialize provider:", error)
      return null
    }
  }

  // Connect to MetaMask
  const connect = async () => {
    if (!isMetaMaskInstalled()) {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask to use this application",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    try {
      // Initialize provider if not already done
      const ethersProvider = provider || (await initializeProvider())
      if (!ethersProvider) throw new Error("Failed to initialize provider")

      // Request accounts from MetaMask
      const accounts = await ethersProvider.send("eth_requestAccounts", [])

      if (accounts.length === 0) throw new Error("No accounts found")

      const userAddress = accounts[0]
      setAddress(userAddress)

      // Get network information
      const network = await ethersProvider.getNetwork()
      setChainId(Number(network.chainId))

      // Get signer
      const signerInstance = await ethersProvider.getSigner()
      setSigner(signerInstance)

      setIsConnected(true)

      toast({
        title: "Connected to MetaMask",
        description: "Your wallet is now connected",
      })
    } catch (error: any) {
      console.error("Error connecting to MetaMask:", error)
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect to MetaMask",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect from MetaMask
  const disconnect = () => {
    setAddress(null)
    setChainId(null)
    setSigner(null)
    setIsConnected(false)

    toast({
      title: "Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return

      try {
        const ethersProvider = await initializeProvider()
        if (!ethersProvider) return

        // Check if we're already connected
        const accounts = await ethersProvider.send("eth_accounts", [])

        if (accounts.length > 0) {
          const userAddress = accounts[0]
          setAddress(userAddress)

          // Get network information
          const network = await ethersProvider.getNetwork()
          setChainId(Number(network.chainId))

          // Get signer
          const signerInstance = await ethersProvider.getSigner()
          setSigner(signerInstance)

          setIsConnected(true)
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }

    checkConnection()
  }, [])

  // Set up event listeners for account and chain changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnect()
      } else if (accounts[0] !== address) {
        // User switched accounts
        setAddress(accounts[0])

        if (provider) {
          const signerInstance = await provider.getSigner()
          setSigner(signerInstance)
        }

        toast({
          title: "Account changed",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        })
      }
    }

    const handleChainChanged = async (chainIdHex: string) => {
      const newChainId = Number.parseInt(chainIdHex, 16)
      setChainId(newChainId)

      // Refresh provider and signer on chain change
      const ethersProvider = await initializeProvider()
      if (ethersProvider && address) {
        const signerInstance = await ethersProvider.getSigner()
        setSigner(signerInstance)
      }

      toast({
        title: "Network changed",
        description: `Connected to chain ID: ${newChainId}`,
      })
    }

    const handleDisconnect = (error: { code: number; message: string }) => {
      console.error("MetaMask disconnected:", error)
      disconnect()
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)
    window.ethereum.on("disconnect", handleDisconnect)

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum.removeListener("chainChanged", handleChainChanged)
      window.ethereum.removeListener("disconnect", handleDisconnect)
    }
  }, [address, provider, toast])

  return (
    <Web3Context.Provider
      value={{
        connect,
        disconnect,
        isConnected,
        isConnecting,
        address,
        chainId,
        provider,
        signer,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}
