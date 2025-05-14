"use client"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/web3-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductList } from "@/components/product-list"
import { useToast } from "@/components/ui/use-toast"

export default function WarehouseDashboard() {
  const router = useRouter()
  const { address } = useWeb3()
  const { toast } = useToast()

  // Mock products in shipping status
  const shippingProducts = [
    {
      id: "20",
      name: "Premium Coffee",
      description: "Arabica coffee beans",
      price: "12.99",
      status: "Shipping",
      seller: "0x1234...5678",
    },
  ]

  // Mock products ready for delivery
  const readyForDeliveryProducts = [
    {
      id: "21",
      name: "Bluetooth Speaker",
      description: "Portable speaker",
      price: "39.99",
      status: "Ready for Delivery",
      seller: "0x1357...2468",
    },
  ]

  const handleAcceptShipped = (productId: string) => {
    toast({
      title: "Status updated",
      description: "Product status updated to 'Shipped'.",
    })
  }

  const handleAcceptOutForDelivery = (productId: string) => {
    toast({
      title: "Status updated",
      description: "Product status updated to 'Out for Delivery'.",
    })
  }

  const handleApprovePickup = (productId: string) => {
    toast({
      title: "Pickup approved",
      description: "Delivery pickup has been approved.",
    })
  }

  return (
    <DashboardLayout role="warehouse">
      <div className="container mx-auto py-6 space-y-8">
        <h1 className="text-3xl font-bold">Warehouse Dashboard</h1>

        <Tabs defaultValue="shipping">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="ready-for-delivery">Ready for Delivery</TabsTrigger>
          </TabsList>

          <TabsContent value="shipping" className="mt-6">
            <ProductList
              products={shippingProducts}
              emptyMessage="No products are currently shipping."
              actionLabel="Accept as Shipped"
              onAction={handleAcceptShipped}
              showSeller
            />
          </TabsContent>

          <TabsContent value="ready-for-delivery" className="mt-6">
            <ProductList
              products={readyForDeliveryProducts}
              emptyMessage="No products are ready for delivery."
              actionLabel="Accept for Delivery"
              onAction={handleAcceptOutForDelivery}
              secondaryActionLabel="Approve Pickup"
              onSecondaryAction={handleApprovePickup}
              showSeller
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
