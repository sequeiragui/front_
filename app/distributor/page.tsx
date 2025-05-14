"use client"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/web3-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductList } from "@/components/product-list"
import { useToast } from "@/components/ui/use-toast"

export default function DistributorDashboard() {
  const router = useRouter()
  const { address } = useWeb3()
  const { toast } = useToast()

  // Mock products ready to ship
  const readyToShipProducts = [
    {
      id: "10",
      name: "Premium Coffee",
      description: "Arabica coffee beans",
      price: "12.99",
      status: "Ready to Ship",
      seller: "0x1234...5678",
    },
    {
      id: "11",
      name: "Leather Wallet",
      description: "Genuine leather wallet",
      price: "29.99",
      status: "Ready to Ship",
      seller: "0x2468...1357",
    },
  ]

  // Mock products in shipping
  const shippingProducts = [
    {
      id: "12",
      name: "Handmade Soap",
      description: "Natural ingredients",
      price: "5.99",
      status: "Shipping",
      seller: "0x1234...5678",
    },
  ]

  const handleRequestShipping = (productId: string) => {
    toast({
      title: "Status update requested",
      description: "Your request to update status to 'Shipping' has been sent.",
    })
  }

  const handleRequestShipped = (productId: string) => {
    toast({
      title: "Status update requested",
      description: "Your request to update status to 'Shipped' has been sent.",
    })
  }

  const handleAcceptHandover = (productId: string) => {
    toast({
      title: "Handover accepted",
      description: "You have accepted the handover from the seller.",
    })
  }

  return (
    <DashboardLayout role="distributor">
      <div className="container mx-auto py-6 space-y-8">
        <h1 className="text-3xl font-bold">Distributor Dashboard</h1>

        <Tabs defaultValue="ready-to-ship">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ready-to-ship">Ready to Ship</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>

          <TabsContent value="ready-to-ship" className="mt-6">
            <ProductList
              products={readyToShipProducts}
              emptyMessage="No products are ready to ship."
              actionLabel="Request Shipping"
              onAction={handleRequestShipping}
              secondaryActionLabel="Accept Handover"
              onSecondaryAction={handleAcceptHandover}
              showSeller
            />
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <ProductList
              products={shippingProducts}
              emptyMessage="No products are currently shipping."
              actionLabel="Request Shipped"
              onAction={handleRequestShipped}
              showSeller
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
