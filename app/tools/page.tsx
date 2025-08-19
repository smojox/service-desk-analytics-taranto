"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ToolsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-green-400">
      {/* Header */}
      <header className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-white/20"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <img 
                src="/logo.png" 
                alt="Taranto Logo" 
                className="h-8 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const fallback = document.createElement('h1')
                  fallback.textContent = 'Taranto'
                  fallback.className = 'text-2xl font-bold text-white'
                  e.currentTarget.parentNode?.insertBefore(fallback, e.currentTarget)
                }}
              />
              <span className="text-gray-300">Service Desk Tools</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 text-2xl">Service Desk Tools</CardTitle>
              <p className="text-gray-600">Additional tools and utilities for service desk management</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Appeal Codes Widget */}
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-teal-100 rounded-full">
                        <FileText className="h-8 w-8 text-teal-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Appeal Codes</h3>
                    <p className="text-sm text-gray-600 mb-4">Manage and generate appeal codes for service desk tickets</p>
                    <Button 
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={() => router.push('/appeal-codes')}
                    >
                      Open Appeal Codes
                    </Button>
                  </div>
                </Card>
                
                {/* Placeholder for future tools */}
                <Card className="p-6 text-center border-dashed border-2 border-gray-300">
                  <div className="text-gray-500">
                    <h3 className="text-lg font-semibold mb-2">More Tools Coming Soon</h3>
                    <p className="text-sm">Additional service desk tools will be available here</p>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}