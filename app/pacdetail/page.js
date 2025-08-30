import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import GetSinglePackage from "@/hooks/GetSinglePackage"


export default function page() {
  const {id} = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GetSinglePackage(id)
        setData(result)
      } catch (error) {
        console.error("Error fetching package data:", error)
      }
    }
    fetchData()
  }, [id])

  if (!data) {
    return <div>Loading...</div>
  }
  return ( 
    <p>hello</p>
  )
}
