import Main from "@/components/Main"
import Hero from "@/components/Hero"
import Money from "@/components/Money"
import PackageFeed from "@/components/PackageFeed"
import QuickNav from "@/components/QuickNav"

export default function page() {
  return (
    <>
      <Main />
    <div className="mb-20 bg-gradient-to-br from-gray-50 to-blue-50 px-6">
      <Hero />
      <Money />
      <PackageFeed />
      <QuickNav />
    </div>
    </>
  )
}
