"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building, Calendar, Clock, Globe, MapPin } from "lucide-react"

export function InternshipsList() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("current")

  // Sample data - would come from API in real implementation
  const currentInternships = [
    {
      id: 1,
      company: "GreenLeaf Marketing",
      position: "Digital Marketing Intern",
      location: "London, UK",
      startDate: "May 15, 2025",
      endDate: "August 15, 2025",
      status: "active",
      languages: ["English", "Spanish"],
      workArrangement: "Hybrid",
    },
  ]

  const pastInternships = [
    {
      id: 2,
      company: "Tech Innovators",
      position: "Web Development Intern",
      location: "Remote",
      startDate: "January 10, 2025",
      endDate: "April 10, 2025",
      status: "completed",
      languages: ["English"],
      workArrangement: "Remote",
    },
  ]

  const pendingInternships = [
    {
      id: 3,
      company: "Global Solutions",
      position: "Translation Assistant",
      location: "Berlin, Germany",
      startDate: "September 1, 2025",
      endDate: "December 1, 2025",
      status: "pending",
      languages: ["English", "German"],
      workArrangement: "On-site",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/profile")} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Internships</CardTitle>
          <CardDescription>Manage and view your current and past internships</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="current" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="mt-6">
              {currentInternships.length > 0 ? (
                <div className="space-y-4">
                  {currentInternships.map((internship) => (
                    <InternshipCard key={internship.id} internship={internship} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="You don't have any current internships"
                  action="Find opportunities in the matchmaking section"
                  actionFn={() => router.push("/")}
                  actionLabel="Find Opportunities"
                />
              )}
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              {pendingInternships.length > 0 ? (
                <div className="space-y-4">
                  {pendingInternships.map((internship) => (
                    <InternshipCard key={internship.id} internship={internship} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="You don't have any pending internships"
                  action="Applications you've submitted will appear here"
                />
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              {pastInternships.length > 0 ? (
                <div className="space-y-4">
                  {pastInternships.map((internship) => (
                    <InternshipCard key={internship.id} internship={internship} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="You don't have any past internships"
                  action="Completed internships will be shown here"
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function InternshipCard({ internship }) {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
  }

  const workArrangementIcons = {
    Remote: <Globe className="h-4 w-4" />,
    "On-site": <Building className="h-4 w-4" />,
    Hybrid: <Building className="h-4 w-4" />,
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{internship.position}</CardTitle>
            <CardDescription className="mt-1">{internship.company}</CardDescription>
          </div>
          <Badge className={statusColors[internship.status]}>
            {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{internship.location}</span>
          </div>
          <div className="flex items-center text-sm">
            {workArrangementIcons[internship.workArrangement]}
            <span className="ml-2">{internship.workArrangement}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {internship.startDate} - {internship.endDate}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{internship.languages.join(", ")}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

function EmptyState({ message, action, actionFn, actionLabel }) {
  return (
    <div className="text-center py-10">
      <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">{message}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{action}</p>
      {actionFn && actionLabel && (
        <Button onClick={actionFn} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
