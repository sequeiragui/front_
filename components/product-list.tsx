"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  name: string
  description: string
  price: string
  status: string
  seller?: string
}

interface ProductListProps {
  products: Product[]
  emptyMessage: string
  actionLabel?: string
  onAction?: (productId: string) => void
  secondaryActionLabel?: string
  onSecondaryAction?: (productId: string) => void
  actionCondition?: (product: Product) => boolean
  showSeller?: boolean
}

export function ProductList({
  products,
  emptyMessage,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  actionCondition = () => true,
  showSeller = false,
}: ProductListProps) {
  // Function to get badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Ready to Ship":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "Shipping":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "Shipped":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "Ready for Delivery":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100"
      case "Out for Delivery":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "Delivered":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  if (products.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">{emptyMessage}</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <Badge className={getStatusColor(product.status)} variant="outline">
                {product.status}
              </Badge>
            </div>
            <CardDescription>${product.price}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{product.description}</p>

            {showSeller && product.seller && (
              <div className="mt-3 text-xs text-muted-foreground">
                <span className="font-medium">Seller:</span> {product.seller}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {actionLabel && onAction && actionCondition(product) && (
              <Button className="w-full" onClick={() => onAction(product.id)} variant="default">
                {actionLabel}
              </Button>
            )}

            {secondaryActionLabel && onSecondaryAction && (
              <Button className="w-full" onClick={() => onSecondaryAction(product.id)} variant="outline">
                {secondaryActionLabel}
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
