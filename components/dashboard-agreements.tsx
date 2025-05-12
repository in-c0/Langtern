"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Languages, Briefcase, Search, Calendar, Clock, Eye, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for signed agreements
const sampleAgreements = [
  {
    id: "1",
    templateId: "standard",
    templateName: "Standard Internship",
    internName: "John Doe",
    organizationName: "Tokyo Tech Solutions",
    position: "Marketing Intern",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    status: "active",
    signedDate: "2023-05-15",
  },
  {
    id: "2",
    templateId: "language-exchange",
    templateName: "Language Exchange Focus",
    internName: "Maria Garcia",
    organizationName: "Madrid Language School",
    position: "Language Exchange Intern",
    startDate: "2023-07-01",
    endDate: "2023-10-31",
    status: "pending",
    signedDate: "2023-06-20",
  },
  {
    id: "3",
    templateId: "project-based",
    templateName: "Project-Based",
    internName: "Alex Johnson",
    organizationName: "Berlin Digital Agency",
    position: "UX Design Intern",
    startDate: "2023-05-15",
    endDate: "2023-11-15",
    status: "completed",
    signedDate: "2023-05-01",
  },
]

const getIconComponent = (templateId: string) => {
  switch (templateId) {
    case "standard":
      return <FileText className="h-5 w-5" />
    case "language-exchange":
      return <Languages className="h-5 w-5" />
    case "project-based":
      return <Briefcase className="h-5 w-5" />
    default:
      return <FileText className="h-5 w-5" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          Active
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
          Pending
        </Badge>
      )
    case "completed":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
          Completed
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          Unknown
        </Badge>
      )
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export function DashboardAgreements() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")

  const filteredAgreements = sampleAgreements.filter(
    (agreement) =>
      (activeTab === "all" || agreement.status === activeTab) &&
      (agreement.internName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agreement.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agreement.position.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Internship Agreements</h2>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <FileText className="h-4 w-4 mr-2" /> New Agreement
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agreements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredAgreements.length > 0 ? (
            filteredAgreements.map((agreement) => <AgreementCard key={agreement.id} agreement={agreement} />)
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No agreements found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AgreementCard({ agreement }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 border border-border/40 hover:border-blue-500/30">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg ${
                agreement.status === "active"
                  ? "bg-green-500/10 text-green-500"
                  : agreement.status === "pending"
                    ? "bg-yellow-500/10 text-yellow-500"
                    : "bg-blue-500/10 text-blue-500"
              }`}
            >
              {getIconComponent(agreement.templateId)}
            </div>
            <div>
              <h3 className="font-medium">{agreement.position}</h3>
              <p className="text-sm text-muted-foreground">
                {agreement.internName} & {agreement.organizationName}
              </p>
            </div>
          </div>
          {getStatusBadge(agreement.status)}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" /> {formatDate(agreement.startDate)} - {formatDate(agreement.endDate)}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" /> Signed on {formatDate(agreement.signedDate)}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Eye className="h-4 w-4" /> View
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
