"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Calendar, Mail, Download, Share2, ArrowRight, Bell, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { LegalDisclaimer } from "@/components/legal-disclaimer"

interface AgreementConfirmationProps {
  agreementData: {
    templateId: string
    templateName: string
    internName?: string
    organizationName?: string
    position?: string
    startDate?: string
    endDate?: string
  }
  onContinue: () => void
}

export function AgreementConfirmation({ agreementData, onContinue }: AgreementConfirmationProps) {
  const [activeTab, setActiveTab] = useState("confirmation")
  const [emailSent, setEmailSent] = useState(false)
  const [calendarAdded, setCalendarAdded] = useState(false)

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const handleSendEmail = () => {
    // In a real implementation, this would send emails to both parties
    setTimeout(() => {
      setEmailSent(true)
    }, 1000)
  }

  const handleAddToCalendar = () => {
    // In a real implementation, this would integrate with calendar APIs
    setTimeout(() => {
      setCalendarAdded(true)
    }, 1000)
  }

  return (
    <div className="py-2">
      <div className="flex flex-col items-center mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-radial from-green-500/20 to-transparent rounded-full blur-xl" />
            <div className="relative bg-gradient-to-br from-green-500 to-teal-500 rounded-full p-4">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.h2
          className="text-xl font-bold text-center mb-1"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Arrangement Confirmed!
        </motion.h2>

        <motion.p
          className="text-center text-muted-foreground mb-4 max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Your {agreementData.templateName} arrangement with{" "}
          {agreementData.organizationName || agreementData.internName || "the other party"} has been confirmed.
        </motion.p>
      </div>

      <LegalDisclaimer variant="compact" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="confirmation">Details</TabsTrigger>
          <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
          <TabsTrigger value="settings">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="confirmation" className="space-y-4">
          <Card className="p-4 border border-border/40">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">Arrangement Details</h3>
                <p className="text-sm text-muted-foreground">
                  {agreementData.templateName} - {formatDate(new Date().toISOString())}
                </p>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                Confirmed
              </Badge>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h4 className="font-medium text-sm">Parties</h4>
                  <p className="text-muted-foreground">
                    {agreementData.internName || "Intern"} & {agreementData.organizationName || "Organization"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Position</h4>
                  <p className="text-muted-foreground">{agreementData.position || "Internship Position"}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm">Duration</h4>
                <p className="text-muted-foreground">
                  {formatDate(agreementData.startDate)} - {formatDate(agreementData.endDate)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={() => handleSendEmail()}>
                  <Mail className="h-4 w-4" /> {emailSent ? "Email Sent" : "Send Email Copy"}
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Share2 className="h-4 w-4" /> Share Details
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={() => setActiveTab("next-steps")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              Next Steps <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="next-steps" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-2">Suggested next steps for your internship</div>

          <div className="space-y-3">
            <NextStepCard
              icon={<Calendar className="h-5 w-5" />}
              title="Add Key Dates to Calendar"
              description="Add internship start, end, and milestone dates to your calendar"
              buttonText={calendarAdded ? "Added to Calendar" : "Add to Calendar"}
              buttonAction={handleAddToCalendar}
              completed={calendarAdded}
            />

            <NextStepCard
              icon={<Bell className="h-5 w-5" />}
              title="Set Up Reminders"
              description="Configure reminders for important deadlines and meetings"
              buttonText="Set Reminders"
              buttonAction={() => {}}
            />

            <NextStepCard
              icon={<Clock className="h-5 w-5" />}
              title="Schedule Kickoff Meeting"
              description="Plan your first meeting to discuss expectations and goals"
              buttonText="Schedule Meeting"
              buttonAction={() => {}}
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setActiveTab("settings")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              Communication Preferences <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-2">Configure your communication preferences</div>

          <Card className="p-4 border border-border/40">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="text-sm">
                        Email Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">Receive updates about this match via email</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reminder-notifications" className="text-sm">
                        Reminder Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Get reminders about upcoming deadlines and milestones
                      </p>
                    </div>
                    <Switch id="reminder-notifications" defaultChecked />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Privacy</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="public-match" className="text-sm">
                        Public Match
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Allow this match to be visible to other team members
                      </p>
                    </div>
                    <Switch id="public-match" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Additional Contacts</h3>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="additional-email" className="text-sm">
                      Additional Email
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input id="additional-email" placeholder="Enter email address" className="flex-1" />
                      <Button variant="outline" size="sm">
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end mt-4">
            <Button onClick={onContinue} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              Complete Setup <CheckCircle className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface NextStepCardProps {
  icon: React.ReactNode
  title: string
  description: string
  buttonText: string
  buttonAction: () => void
  completed?: boolean
}

function NextStepCard({ icon, title, description, buttonText, buttonAction, completed }: NextStepCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 border border-border/40">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${completed ? "bg-green-500 text-white" : "bg-blue-500/10 text-blue-500"}`}>
            {completed ? <CheckCircle className="h-5 w-5" /> : icon}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>
          <Button
            variant={completed ? "outline" : "default"}
            size="sm"
            onClick={buttonAction}
            className={completed ? "text-green-500 border-green-500/30" : ""}
            disabled={completed}
          >
            {buttonText}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
