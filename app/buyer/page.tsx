"use client"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/web3-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductList } from "@/components/product-list"
import { useToast } from "@/components/ui/use-toast"

export default function BuyerDashboard() {
  const router = useRouter()
  const { address } = useWeb3()
  const { toast } = useToast()

  // Mock available products
  const availableProducts = [
    {
      id: "1",
      name: "Organic Apples",
      description: "Fresh organic apples",
      price: "2.99",
      status: "Available",
      seller: "0x1234...5678",
    },
    {
      id: "4",
      name: "Handcrafted Mug",
      description: "Ceramic coffee mug",
      price: "14.99",
      status: "Available",
      seller: "0x9876...5432",
    },
    {
      id: "5",
      name: "Wool Blanket",
      description: "100% wool blanket",
      price: "49.99",
      status: "Available",
      seller: "0x5678...1234",
    },
  ]

  // Mock products the buyer has requested
  const myProducts = [
    {
      id: "6",
      name: "Leather Wallet",
      description: "Genuine leather wallet",
      price: "29.99",
      status: "Ready to Ship",
      seller: "0x2468...1357",
    },
    {
      id: "7",
      name: "Bluetooth Speaker",
      description: "Portable speaker",
      price: "39.99",
      status: "Out for Delivery",
      seller: "0x1357...2468",
    },
  ]

  const handleRequestShipping = (productId: string) => {
    toast({
      title: "Request submitted",
      description: "Your request to ship this product has been sent to the seller.",
    })
  }

  const handleAcceptDelivery = (productId: string) => {
    toast({
      title: "Delivery accepted",
      description: "You have confirmed receipt of this product.",
    })
  }

  return (
    <DashboardLayout role="buyer">
      <div className="container mx-auto py-6 space-y-8">
        <h1 className="text-3xl font-bold">Buyer Dashboard</h1>

        <Tabs defaultValue="available">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Products</TabsTrigger>
            <TabsTrigger value="my-products">My Products</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-6">
            <ProductList
              products={availableProducts}
              emptyMessage="No products are currently available."
              actionLabel="Request to Ship"
              onAction={handleRequestShipping}
              showSeller
            />
          </TabsContent>

          <TabsContent value="my-products" className="mt-6">
            <ProductList
              products={myProducts}
              emptyMessage="You haven't purchased any products yet."
              actionLabel="Accept Delivery"
              onAction={handleAcceptDelivery}
              actionCondition={(product) => product.status === "Out for Delivery"}
              showSeller
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
