"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface Request {
  id: string
  productId: string
  productName: string
  from: string
  requestType: string
  timestamp: string
}

interface RequestListProps {
  requests: Request[]
  emptyMessage: string
  onAccept?: (requestId: string) => void
  onReject?: (requestId: string) => void
}

export function RequestList({ requests, emptyMessage, onAccept, onReject }: RequestListProps) {
  if (requests.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">{emptyMessage}</div>
  }

  // Function to format the timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{request.productName}</CardTitle>
              <Badge variant="outline">{request.requestType}</Badge>
            </div>
            <CardDescription>Request #{request.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">From:</span> {request.from}
            </p>
            <p className="text-xs text-muted-foreground">{formatTimestamp(request.timestamp)}</p>
          </CardContent>
          <CardFooter className="flex gap-2">
            {onAccept && (
              <Button className="flex-1" onClick={() => onAccept(request.id)}>
                Accept
              </Button>
            )}

            {onReject && (
              <Button className="flex-1" onClick={() => onReject(request.id)} variant="outline">
                Reject
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
