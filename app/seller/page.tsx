"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/web3-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductList } from "@/components/product-list"
import { RequestList } from "@/components/request-list"
import { Loader2, Upload, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SellerDashboard() {
  const router = useRouter()
  const { address, signer } = useWeb3()
  const { toast } = useToast()

  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productPrice, setProductPrice] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [ipfsCid, setIpfsCid] = useState<string | null>(null)

  // Mock products for the seller
  const sellerProducts = [
    { id: "1", name: "Organic Apples", description: "Fresh organic apples", price: "2.99", status: "Available" },
    { id: "2", name: "Premium Coffee", description: "Arabica coffee beans", price: "12.99", status: "Ready to Ship" },
    { id: "3", name: "Handmade Soap", description: "Natural ingredients", price: "5.99", status: "Shipping" },
  ]

  // Mock requests for the seller
  const sellerRequests = [
    {
      id: "101",
      productId: "2",
      productName: "Premium Coffee",
      from: "Buyer (0x1234...5678)",
      requestType: "Ready to Ship",
      timestamp: "2023-06-15T10:30:00Z",
    },
    {
      id: "102",
      productId: "3",
      productName: "Handmade Soap",
      from: "Distributor (0x8765...4321)",
      requestType: "Shipping",
      timestamp: "2023-06-14T14:45:00Z",
    },
  ]

  const handleUploadToIPFS = async () => {
    if (!productName || !productDescription || !productPrice) {
      toast({
        title: "Missing information",
        description: "Please fill in all product details",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // In a real implementation, this would upload to IPFS
      // For now, we'll simulate it
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockCid = "Qm" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      setIpfsCid(mockCid)

      toast({
        title: "Uploaded to IPFS",
        description: `CID: ${mockCid}`,
      })
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload to IPFS",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRegisterOnBlockchain = async () => {
    if (!ipfsCid || !signer) {
      toast({
        title: "Cannot register product",
        description: !ipfsCid ? "Please upload to IPFS first" : "Wallet not connected properly",
        variant: "destructive",
      })
      return
    }

    setIsRegistering(true)

    try {
      // In a real implementation, this would call a smart contract
      // For now, we'll simulate it
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Product registered",
        description: "Your product has been registered on the blockchain",
      })

      // Reset form
      setProductName("")
      setProductDescription("")
      setProductPrice("")
      setIpfsCid(null)
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register on blockchain",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  const handleAcceptRequest = (requestId: string) => {
    toast({
      title: "Request accepted",
      description: `Request ${requestId} has been accepted`,
    })
  }

  return (
    <DashboardLayout role="seller">
      <div className="container mx-auto py-6 space-y-8">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>

        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Product</TabsTrigger>
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Product</CardTitle>
                <CardDescription>Add a new product to the blockchain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input
                    id="product-name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Describe your product"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-price">Price (USD)</Label>
                  <Input
                    id="product-price"
                    type="number"
                    step="0.01"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {ipfsCid && (
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <p className="font-medium">IPFS CID:</p>
                    <p className="font-mono text-xs break-all">{ipfsCid}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleUploadToIPFS}
                  disabled={isUploading || !productName || !productDescription || !productPrice}
                  className="w-full sm:w-auto"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload to IPFS
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleRegisterOnBlockchain}
                  disabled={isRegistering || !ipfsCid || !signer}
                  className="w-full sm:w-auto"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Register on Blockchain
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <ProductList products={sellerProducts} emptyMessage="You haven't uploaded any products yet." />
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <RequestList
              requests={sellerRequests}
              onAccept={handleAcceptRequest}
              emptyMessage="You don't have any pending requests."
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
