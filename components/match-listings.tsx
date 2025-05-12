"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Languages, Briefcase, Search, Calendar, Clock, Eye, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LegalDisclaimer } from "@/components/legal-disclaimer"

// Sample data for matches
const sampleMatches = [
  {
    id: "1",
    templateId: "standard",
    templateName: "Standard Internship",
    internName: "John Doe",
    organizationName: "Tokyo Tech Solutions",
    position: "Marketing Intern",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    status: "ongoing",
    confirmedDate: "2023-05-15",
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
    confirmedDate: "2023-06-20",
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
    confirmedDate: "2023-05-01",
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
    case "ongoing":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          Ongoing
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

export function MatchListings() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("ongoing")
  const [selectedMatch, setSelectedMatch] = useState(null)

  const handleViewDetails = (match) => {
    setSelectedMatch(match)
  }

  const handleCloseDetails = () => {
    setSelectedMatch(null)
  }

  const filteredMatches = sampleMatches.filter(
    (match) =>
      (activeTab === "all" || match.status === activeTab) &&
      (match.internName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.position.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Matches & Arrangements</h2>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <FileText className="h-4 w-4 mr-2" /> New Arrangement
        </Button>
      </div>

      <LegalDisclaimer variant="compact" />

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search matches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} onViewDetails={() => handleViewDetails(match)} />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No matches found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      {selectedMatch && <MatchDetailsView match={selectedMatch} onClose={handleCloseDetails} />}
    </div>
  )
}

function MatchCard({ match, onViewDetails }) {
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
                match.status === "ongoing"
                  ? "bg-green-500/10 text-green-500"
                  : match.status === "pending"
                    ? "bg-yellow-500/10 text-yellow-500"
                    : "bg-blue-500/10 text-blue-500"
              }`}
            >
              {getIconComponent(match.templateId)}
            </div>
            <div>
              <h3 className="font-medium">{match.position}</h3>
              <p className="text-sm text-muted-foreground">
                {match.internName} & {match.organizationName}
              </p>
            </div>
          </div>
          {getStatusBadge(match.status)}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" /> {formatDate(match.startDate)} - {formatDate(match.endDate)}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" /> Confirmed on {formatDate(match.confirmedDate)}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={onViewDetails}>
            <Eye className="h-4 w-4" /> View Details
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

function MatchDetailsView({ match, onClose }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        className="bg-background rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold">{match.position}</h3>
              <p className="text-sm text-muted-foreground">{match.templateName} Arrangement</p>
            </div>
            {getStatusBadge(match.status)}
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <h4 className="text-sm font-medium mb-1">Parties</h4>
              <div className="bg-muted/30 p-3 rounded-md">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{match.internName}</p>
                    <p className="text-sm text-muted-foreground">Intern</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{match.organizationName}</p>
                    <p className="text-sm text-muted-foreground">Organization</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Duration</h4>
              <div className="bg-muted/30 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {formatDate(match.startDate)} - {formatDate(match.endDate)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Arrangement Status</h4>
              <div className="bg-muted/30 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Confirmed on {formatDate(match.confirmedDate)}</span>
                  </div>
                  {getStatusBadge(match.status)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Download className="h-4 w-4 mr-2" /> Download PDF
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
