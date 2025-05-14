"use client"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/web3-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductList } from "@/components/product-list"
import { useToast } from "@/components/ui/use-toast"

export default function DeliveryDashboard() {
  const router = useRouter()
  const { address } = useWeb3()
  const { toast } = useToast()

  // Mock products in shipped status
  const shippedProducts = [
    {
      id: "30",
      name: "Premium Coffee",
      description: "Arabica coffee beans",
      price: "12.99",
      status: "Shipped",
      seller: "0x1234...5678",
    },
  ]

  // Mock products ready for delivery
  const readyForDeliveryProducts = [
    {
      id: "31",
      name: "Handmade Soap",
      description: "Natural ingredients",
      price: "5.99",
      status: "Ready for Delivery",
      seller: "0x1234...5678",
    },
  ]

  // Mock products out for delivery
  const outForDeliveryProducts = [
    {
      id: "32",
      name: "Bluetooth Speaker",
      description: "Portable speaker",
      price: "39.99",
      status: "Out for Delivery",
      seller: "0x1357...2468",
    },
  ]

  const handleRequestReadyForDelivery = (productId: string) => {
    toast({
      title: "Status update requested",
      description: "Your request to update status to 'Ready for Delivery' has been sent.",
    })
  }

  const handleRequestOutForDelivery = (productId: string) => {
    toast({
      title: "Status update requested",
      description: "Your request to update status to 'Out for Delivery' has been sent.",
    })
  }

  const handleRequestDelivered = (productId: string) => {
    toast({
      title: "Status update requested",
      description: "Your request to update status to 'Delivered' has been sent.",
    })
  }

  return (
    <DashboardLayout role="delivery">
      <div className="container mx-auto py-6 space-y-8">
        <h1 className="text-3xl font-bold">Delivery Dashboard</h1>

        <Tabs defaultValue="shipped">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="ready-for-delivery">Ready for Delivery</TabsTrigger>
            <TabsTrigger value="out-for-delivery">Out for Delivery</TabsTrigger>
          </TabsList>

          <TabsContent value="shipped" className="mt-6">
            <ProductList
              products={shippedProducts}
              emptyMessage="No products are currently shipped."
              actionLabel="Request Ready for Delivery"
              onAction={handleRequestReadyForDelivery}
              showSeller
            />
          </TabsContent>

          <TabsContent value="ready-for-delivery" className="mt-6">
            <ProductList
              products={readyForDeliveryProducts}
              emptyMessage="No products are ready for delivery."
              actionLabel="Request Out for Delivery"
              onAction={handleRequestOutForDelivery}
              showSeller
            />
          </TabsContent>

          <TabsContent value="out-for-delivery" className="mt-6">
            <ProductList
              products={outForDeliveryProducts}
              emptyMessage="No products are out for delivery."
              actionLabel="Request Delivered"
              onAction={handleRequestDelivered}
              showSeller
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
