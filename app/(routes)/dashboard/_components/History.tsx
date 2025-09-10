"use client"

import { Button } from "@/components/ui/button"
import axios from "axios"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { aiToolsList } from "./AiToolsList"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

interface HistoryItem {
  aiAgentType: string
  recordId: string
  createdAt: string
}

function History() {
  const [userHistory, setUserHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true) // start as loading

  useEffect(() => {
    GetHistory()
  }, [])

  const GetHistory = async () => {
    try {
      const result = await axios.get<HistoryItem[]>("/api/history")
      setUserHistory(result.data || [])
    } catch (err) {
      console.error("Error fetching history:", err)
    } finally {
      setLoading(false)
    }
  }

  const GetAgentName = (path: string) => {
    return aiToolsList.find((item) => item.path === path)
  }

  return (
    <div className="mt-5 p-5 border rounded-xl">
      <h2 className="font-bold text-lg">Previous History</h2>
      <p className="text-sm text-gray-500">
        What you previously worked on, you can find here
      </p>

      {/* Loading skeleton */}
      {loading && (
        <div>
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-[50px] mt-4 w-full rounded-md" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && userHistory.length === 0 && (
        <div className="flex items-center justify-center flex-col mt-6">
          <Image src="/idea.png" alt="bulb" width={50} height={50} />
          <h2 className="mt-2 text-gray-600">You do not have any history</h2>
          <Button asChild className="mt-5">
            <Link href="/ai-tools">Explore AI Tools</Link>
          </Button>
        </div>
      )}

      {/* History list */}
      {!loading && userHistory.length > 0 && (
        <div className="mt-4">
          {userHistory.map((history) => {
            const agent = GetAgentName(history.aiAgentType)
            return (
              <Link
                key={history.recordId}
                href={`/${history.aiAgentType}/${history.recordId}`}
                className="flex justify-between items-center my-3 border p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex gap-3 items-center">
                  {agent?.icon ? (
                    <Image
                      src={agent.icon}
                      alt={agent.name}
                      width={24}
                      height={24}
                      className="rounded"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded" />
                  )}
                  <h2 className="font-medium">
                    {agent?.name || "Unknown Tool"}
                  </h2>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(history.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default History
