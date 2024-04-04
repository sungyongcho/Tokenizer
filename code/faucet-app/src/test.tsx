/**
 * v0 by Vercel.
 * @see https://v0.dev/t/MKNq0c0qKCy
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="w-full max-w-screen-sm rounded-xl border border-gray-200 dark:border-gray-800">
      <Card className="w-full h-[70vh]">
        <CardHeader className="p-6">
          <CardTitle className="text-3xl">Faucet</CardTitle>
          <CardDescription>Get tokens by entering your Ethereum address.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <form className="grid gap-4 w-full">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="address">Ethereum Address</Label>
              <Input id="address" placeholder="Enter your address" />
            </div>
            <Button className="w-full" type="submit">
              Get Tokens
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

