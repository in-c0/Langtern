"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  MessageCircle,
  MapPin,
  Briefcase,
  Clock,
  GraduationCap,
  Star,
  DollarSign,
  Globe,
  Award,
  Heart,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { MatchResult } from "@/types/matching"

interface MatchProfileDetailProps {
  match: MatchResult
  isOpen: boolean
  onClose: () => void
  onMessage: (match: MatchResult) => void
  onPass: (match: MatchResult) => void
  onSave?: (match: MatchResult) => void
}

export function MatchProfileDetail({ match, isOpen, onClose, onMessage, onPass, onSave }: MatchProfileDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(!isSaved)
    if (onSave) {
      onSave(match)
    }
  }

  const getRandomImage = (name: string, role: string) => {
    // Generate a consistent but random image based on the name and role
    const seed = name.length + role.length
    const gender = seed % 2 === 0 ? "men" : "women"
    const id = (seed % 30) + 1
    return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`
  }

  // Generate sample portfolio projects
  const portfolioProjects = [
    {
      title: "Marketing Campaign",
      description: "Developed a social media marketing campaign for a local business",
      image: "/marketing-campaign-brainstorm.png",
    },
    {
      title: "Content Strategy",
      description: "Created a content strategy for a tech startup",
      image: "/content-strategy-brainstorm.png",
    },
    {
      title: "Brand Redesign",
      description: "Redesigned brand identity for an e-commerce platform",
      image: "/placeholder-jbb7b.png",
    },
  ]

  // Generate sample education
  const education = [
    {
      degree: "Bachelor of Arts in Marketing",
      institution: "University of Tokyo",
      year: "2018-2022",
    },
    {
      degree: "Digital Marketing Certificate",
      institution: "Google Digital Academy",
      year: "2023",
    },
  ]

  // Generate sample experience
  const experience = [
    {
      role: "Marketing Intern",
      company: "Global Tech Solutions",
      period: "Summer 2021",
      description: "Assisted with social media campaigns and content creation",
    },
    {
      role: "Content Creator",
      company: "Creative Agency",
      period: "2022-2023",
      description: "Developed content strategies and created marketing materials",
    },
  ]

  // Generate sample language proficiency
  const languageProficiency = match.languages.map((lang) => {
    // Generate random proficiency levels between 30 and 100
    const seed = lang.length
    const reading = Math.min(30 + ((seed * 7) % 70), 100)
    const writing = Math.min(30 + ((seed * 5) % 70), 100)
    const speaking = Math.min(30 + ((seed * 3) % 70), 100)

    return {
      language: lang,
      reading,
      writing,
      speaking,
    }
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-background rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header with profile image and basic info */}
              <div className="relative h-64 sm:h-80">
                <Image
                  src={getRandomImage(match.name, match.role) || "/placeholder.svg"}
                  alt={match.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-black/40"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-10 w-10 rounded-full backdrop-blur-sm border-white/20 text-white hover:bg-black/40 ${
                      isSaved ? "bg-red-500/50" : "bg-black/20"
                    }`}
                    onClick={handleSave}
                  >
                    <Heart className={`h-5 w-5 ${isSaved ? "fill-white" : ""}`} />
                  </Button>
                </div>

                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">{match.name}</h1>
                      <p className="text-white/90 text-lg">{match.role}</p>
                    </div>
                    <Badge className="bg-blue-500 text-white border-none text-sm px-3 py-1">
                      {match.matchPercentage}% Match
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Tabs for different sections */}
              <div className="flex-1 overflow-auto">
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="px-6 pt-4 border-b sticky top-0 bg-background z-10">
                    <TabsList className="grid grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="languages">Languages</TabsTrigger>
                      <TabsTrigger value="experience">Experience</TabsTrigger>
                      <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-6">
                    <TabsContent value="overview" className="mt-0 space-y-6">
                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Basic Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{match.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{match.languages.join(", ")}</span>
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{match.workArrangement}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{match.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{match.compensation || "Not specified"}</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Skills</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {match.skills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Bio */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">About</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            {match.bio ||
                              `${match.name} is a ${match.role} based in ${match.location}. They are looking for ${match.duration} opportunities in ${match.workArrangement} settings.`}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Match Reasons */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Why You Match</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {match.reason ? (
                              // Use the new reason array from the server if available
                              match.reason.map((reason, index) => (
                                <li key={index} className="flex items-start">
                                  <Star className="h-4 w-4 mr-2 text-yellow-500 mt-1 flex-shrink-0" />
                                  <span>{reason}</span>
                                </li>
                              ))
                            ) : match.matchReasons ? (
                              // Fall back to matchReasons if reason is not available
                              match.matchReasons.map((reason, index) => (
                                <li key={index} className="flex items-start">
                                  <Star className="h-4 w-4 mr-2 text-yellow-500 mt-1 flex-shrink-0" />
                                  <span>{reason}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-muted-foreground">No matching details available</li>
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="languages" className="mt-0 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Language Proficiency</CardTitle>
                          <CardDescription>Detailed breakdown of {match.name}'s language skills</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {languageProficiency.map((lang) => (
                            <div key={lang.language} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{lang.language}</h3>
                                <Badge variant="outline">
                                  {lang.reading + lang.writing + lang.speaking > 240
                                    ? "Advanced"
                                    : lang.reading + lang.writing + lang.speaking > 180
                                      ? "Intermediate"
                                      : "Beginner"}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Reading</span>
                                  <span>{lang.reading}%</span>
                                </div>
                                <Progress value={lang.reading} className="h-2" />

                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Writing</span>
                                  <span>{lang.writing}%</span>
                                </div>
                                <Progress value={lang.writing} className="h-2" />

                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Speaking</span>
                                  <span>{lang.speaking}%</span>
                                </div>
                                <Progress value={lang.speaking} className="h-2" />
                              </div>
                              <Separator className="my-2" />
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Language Certificates</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {match.languages.includes("English") && (
                              <div className="flex items-start">
                                <Award className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
                                <div>
                                  <h4 className="font-medium">TOEFL</h4>
                                  <p className="text-sm text-muted-foreground">Score: 105/120</p>
                                </div>
                              </div>
                            )}
                            {match.languages.includes("Japanese") && (
                              <div className="flex items-start">
                                <Award className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
                                <div>
                                  <h4 className="font-medium">JLPT N2</h4>
                                  <p className="text-sm text-muted-foreground">Passed in 2022</p>
                                </div>
                              </div>
                            )}
                            {match.languages.includes("Spanish") && (
                              <div className="flex items-start">
                                <Award className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
                                <div>
                                  <h4 className="font-medium">DELE B2</h4>
                                  <p className="text-sm text-muted-foreground">Passed in 2021</p>
                                </div>
                              </div>
                            )}
                            {match.languages.includes("French") && (
                              <div className="flex items-start">
                                <Award className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
                                <div>
                                  <h4 className="font-medium">DELF B1</h4>
                                  <p className="text-sm text-muted-foreground">Passed in 2020</p>
                                </div>
                              </div>
                            )}
                            {match.languages.includes("German") && (
                              <div className="flex items-start">
                                <Award className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
                                <div>
                                  <h4 className="font-medium">Goethe-Zertifikat B1</h4>
                                  <p className="text-sm text-muted-foreground">Passed in 2021</p>
                                </div>
                              </div>
                            )}
                            {!match.languages.some((lang) =>
                              ["English", "Japanese", "Spanish", "French", "German"].includes(lang),
                            ) && <p className="text-muted-foreground">No language certificates available</p>}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="experience" className="mt-0 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Education</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {education.map((edu, index) => (
                              <div key={index} className="flex items-start">
                                <GraduationCap className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
                                <div>
                                  <h4 className="font-medium">{edu.degree}</h4>
                                  <p className="text-sm">{edu.institution}</p>
                                  <p className="text-sm text-muted-foreground">{edu.year}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Work Experience</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {experience.map((exp, index) => (
                              <div key={index} className="flex items-start">
                                <Briefcase className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
                                <div>
                                  <h4 className="font-medium">{exp.role}</h4>
                                  <p className="text-sm">{exp.company}</p>
                                  <p className="text-sm text-muted-foreground">{exp.period}</p>
                                  <p className="text-sm mt-1">{exp.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Certifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <Award className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
                              <div>
                                <h4 className="font-medium">Digital Marketing Certification</h4>
                                <p className="text-sm">Google</p>
                                <p className="text-sm text-muted-foreground">2022</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Award className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
                              <div>
                                <h4 className="font-medium">Social Media Marketing</h4>
                                <p className="text-sm">HubSpot Academy</p>
                                <p className="text-sm text-muted-foreground">2021</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="portfolio" className="mt-0 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Portfolio Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {portfolioProjects.map((project, index) => (
                              <Card key={index} className="overflow-hidden">
                                <div className="h-40 relative">
                                  <Image
                                    src={project.image || "/placeholder.svg"}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <CardHeader className="py-3">
                                  <CardTitle className="text-base">{project.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="py-0">
                                  <p className="text-sm text-muted-foreground">{project.description}</p>
                                </CardContent>
                                <CardFooter className="pt-3 pb-3">
                                  <Button variant="outline" size="sm" className="w-full">
                                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> View Project
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>References</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src="/diverse-group.png" />
                                <AvatarFallback>JD</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">Jane Doe</h4>
                                <p className="text-sm">Marketing Director, Global Tech</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  "{match.name} is a talented professional with excellent communication skills and a
                                  strong work ethic."
                                </p>
                              </div>
                            </div>
                            <Separator />
                            <div className="flex items-start">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src="/diverse-group-conversation.png" />
                                <AvatarFallback>MS</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">Michael Smith</h4>
                                <p className="text-sm">CEO, Creative Solutions</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  "I was impressed by {match.name}'s creativity and ability to deliver high-quality work
                                  on tight deadlines."
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              {/* Footer with action buttons */}
              <div className="p-4 border-t bg-background sticky bottom-0">
                <div className="flex justify-between gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 gap-2"
                    onClick={() => {
                      onPass(match)
                      onClose()
                    }}
                  >
                    <X className="h-5 w-5" /> Pass
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    onClick={() => {
                      onMessage(match)
                      onClose()
                    }}
                  >
                    <MessageCircle className="h-5 w-5" /> Message
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
