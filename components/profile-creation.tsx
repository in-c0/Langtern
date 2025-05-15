"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Languages, Briefcase, Clock, ChevronRight, ChevronLeft, AlertCircle, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Language options
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese (Mandarin)" },
  { code: "ko", name: "Korean" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
]

// Proficiency levels
const PROFICIENCY_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "elementary", label: "Elementary" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "fluent", label: "Fluent" },
  { value: "native", label: "Native" },
]

export function ProfileCreation({ onComplete, onBack }) {
  const [step, setStep] = useState(1)
  const totalSteps = 4
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    location: "",
    bio: "",
    languages: [], // Array of language objects with proficiency levels
    field: "",
    educationLevel: "",
    skills: "",
    experienceLevel: "",
    availability: "",
    duration: "",
    workArrangement: "",
    compensation: "",
  })
  const [errors, setErrors] = useState([])
  const [registrationError, setRegistrationError] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const { signUp, updateUserType } = useAuth()

  // State for language selection
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [isLearning, setIsLearning] = useState(false)
  const [readingLevel, setReadingLevel] = useState("intermediate")
  const [writingLevel, setWritingLevel] = useState("intermediate")
  const [speakingLevel, setSpeakingLevel] = useState("intermediate")

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addLanguage = () => {
    if (!selectedLanguage) return

    // Check if language already exists
    if (formData.languages.some((lang) => lang.code === selectedLanguage)) {
      return
    }

    const languageName = LANGUAGES.find((lang) => lang.code === selectedLanguage)?.name || selectedLanguage

    const newLanguage = {
      code: selectedLanguage,
      name: languageName,
      isLearning: isLearning,
      proficiency: {
        reading: readingLevel,
        writing: writingLevel,
        speaking: speakingLevel,
      },
    }

    updateFormData("languages", [...formData.languages, newLanguage])

    // Reset selection
    setSelectedLanguage("")
    setReadingLevel("intermediate")
    setWritingLevel("intermediate")
    setSpeakingLevel("intermediate")
  }

  const removeLanguage = (code) => {
    updateFormData(
      "languages",
      formData.languages.filter((lang) => lang.code !== code),
    )
  }

  const validateFinalStep = () => {
    const requiredFields = ["availability", "duration", "workArrangement", "compensation"]
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      setErrors(missingFields)
      return false
    }

    setErrors([])
    return true
  }

  const validatePersonalInfo = () => {
    const requiredFields = ["fullName", "email", "password"]
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      setErrors(missingFields)
      return false
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrors(["email"])
      setRegistrationError("Please enter a valid email address")
      return false
    }

    // Basic password validation
    if (formData.password.length < 6) {
      setErrors(["password"])
      setRegistrationError("Password must be at least 6 characters")
      return false
    }

    setErrors([])
    setRegistrationError("")
    return true
  }

  const validateLanguageStep = () => {
    if (formData.languages.length === 0) {
      setErrors(["languages"])
      return false
    }

    setErrors([])
    return true
  }

  const nextStep = () => {
    // For the first step, validate personal info
    if (step === 1) {
      if (!validatePersonalInfo()) {
        return
      }
    }

    // For the second step, validate languages
    if (step === 2) {
      if (!validateLanguageStep()) {
        return
      }
    }

    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      if (validateFinalStep()) {
        handleProfileComplete()
      }
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      onBack()
    }
  }

  const handleProfileComplete = async () => {
    setIsRegistering(true)
    setRegistrationError("")

    try {
      // Register the user with the server
      const { error, user } = await signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.fullName.split(" ")[0],
        lastName: formData.fullName.split(" ").slice(1).join(" ") || "",
      })

      if (error) {
        setRegistrationError(error)
        setIsRegistering(false)
        return
      }

      // Set user type to student
      updateUserType("student")

      // Call onComplete with the form data
      onComplete(formData)
    } catch (error) {
      console.error("Registration error:", error)
      setRegistrationError("An unexpected error occurred. Please try again.")
      setIsRegistering(false)
    }
  }

  const getFieldLabel = (field) => {
    const labels = {
      fullName: "Full Name",
      email: "Email Address",
      password: "Password",
      languages: "Languages",
      availability: "Availability",
      duration: "Duration",
      workArrangement: "Work Arrangement",
      compensation: "Compensation",
    }
    return labels[field] || field
  }

  return (
    <div className="py-2">
      <h2 className="text-xl font-semibold mb-1">Create Your Profile</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Step {step} of {totalSteps}: {getStepTitle(step)}
      </p>

      <motion.div
        key={`step-${step}`}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {step === 1 && (
          <PersonalInfoStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            registrationError={registrationError}
          />
        )}
        {step === 2 && (
          <LanguageSkillsStep
            formData={formData}
            languages={formData.languages}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            isLearning={isLearning}
            setIsLearning={setIsLearning}
            readingLevel={readingLevel}
            setReadingLevel={setReadingLevel}
            writingLevel={writingLevel}
            setWritingLevel={setWritingLevel}
            speakingLevel={speakingLevel}
            setSpeakingLevel={setSpeakingLevel}
            addLanguage={addLanguage}
            removeLanguage={removeLanguage}
            errors={errors}
          />
        )}
        {step === 3 && <ProfessionalSkillsStep formData={formData} updateFormData={updateFormData} />}
        {step === 4 && <AvailabilityStep formData={formData} updateFormData={updateFormData} />}

        {errors.length > 0 && step === totalSteps && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fill in the following required fields: {errors.map((field) => getFieldLabel(field)).join(", ")}
            </AlertDescription>
          </Alert>
        )}
      </motion.div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" size="sm" onClick={prevStep} disabled={isRegistering}>
          <ChevronLeft className="h-4 w-4 mr-1" /> {step === 1 ? "Back to Home" : "Back"}
        </Button>

        <Button
          onClick={nextStep}
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          disabled={isRegistering}
        >
          {isRegistering ? (
            <>
              <span className="animate-spin mr-2">⟳</span> Creating Account...
            </>
          ) : (
            <>
              {step === totalSteps ? "Complete" : "Next"} <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function getStepTitle(step) {
  switch (step) {
    case 1:
      return "Personal Information"
    case 2:
      return "Language Skills"
    case 3:
      return "Professional Skills"
    case 4:
      return "Availability & Preferences"
    default:
      return ""
  }
}

function PersonalInfoStep({ formData, updateFormData, errors, registrationError }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-4">
        <div className="relative w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center">
          <User className="h-8 w-8 text-blue-500" />
          <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) => updateFormData("fullName", e.target.value)}
          className={errors.includes("fullName") ? "border-red-500" : ""}
        />
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
          className={errors.includes("email") ? "border-red-500" : ""}
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => updateFormData("password", e.target.value)}
          className={errors.includes("password") ? "border-red-500" : ""}
        />
        <p className="text-xs text-muted-foreground mt-1">Password must be at least 6 characters</p>
      </div>

      {registrationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{registrationError}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="location">Location</Label>
        <Select value={formData.location} onValueChange={(value) => updateFormData("location", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
            <SelectItem value="au">Australia</SelectItem>
            <SelectItem value="jp">Japan</SelectItem>
            <SelectItem value="fr">France</SelectItem>
            <SelectItem value="de">Germany</SelectItem>
            <SelectItem value="br">Brazil</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="bio">Short Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us a bit about yourself..."
          className="resize-none"
          value={formData.bio}
          onChange={(e) => updateFormData("bio", e.target.value)}
        />
      </div>
    </div>
  )
}

function LanguageSkillsStep({
  formData,
  languages,
  selectedLanguage,
  setSelectedLanguage,
  isLearning,
  setIsLearning,
  readingLevel,
  setReadingLevel,
  writingLevel,
  setWritingLevel,
  speakingLevel,
  setSpeakingLevel,
  addLanguage,
  removeLanguage,
  errors,
}) {
  // Filter out languages that are already selected
  const availableLanguages = LANGUAGES.filter((lang) => !languages.some((userLang) => userLang.code === lang.code))

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-4">
        <div className="relative w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center">
          <Languages className="h-8 w-8 text-purple-500" />
          <div className="absolute bottom-0 right-0 bg-purple-500 text-white rounded-full p-1">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      {errors.includes("languages") && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please add at least one language</AlertDescription>
        </Alert>
      )}

      {/* Language selection */}
      <Card className={errors.includes("languages") ? "border-red-500" : ""}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Select Language</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLearning}
                    onChange={(e) => setIsLearning(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>I want to learn this language</span>
                </Label>
              </div>
            </div>

            {selectedLanguage && (
              <div className="space-y-4 border-t pt-4 mt-4">
                <h4 className="font-medium">Proficiency Levels</h4>

                <div>
                  <Label>Reading</Label>
                  <Select value={readingLevel} onValueChange={setReadingLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFICIENCY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Writing</Label>
                  <Select value={writingLevel} onValueChange={setWritingLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFICIENCY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Speaking</Label>
                  <Select value={speakingLevel} onValueChange={setSpeakingLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFICIENCY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={addLanguage} className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" /> Add Language
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected languages */}
      {languages.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Your Languages</h4>

          <div className="space-y-3">
            {languages.map((lang) => (
              <Card key={lang.code} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeLanguage(lang.code)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <CardContent className="pt-6">
                  <div className="flex items-center mb-3">
                    <h5 className="font-semibold text-lg">{lang.name}</h5>
                    {lang.isLearning && <Badge className="ml-2 bg-purple-500">Learning</Badge>}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Reading:</span>
                      <div className="font-medium capitalize">{lang.proficiency.reading}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Writing:</span>
                      <div className="font-medium capitalize">{lang.proficiency.writing}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Speaking:</span>
                      <div className="font-medium capitalize">{lang.proficiency.speaking}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ProfessionalSkillsStep({ formData, updateFormData }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-4">
        <div className="relative w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
          <Briefcase className="h-8 w-8 text-green-500" />
          <div className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div>
        <Label>Field of Study/Industry</Label>
        <Select value={formData.field} onValueChange={(value) => updateFormData("field", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tech">Technology</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Education Level</Label>
        <Select value={formData.educationLevel} onValueChange={(value) => updateFormData("educationLevel", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your education level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high-school">High School</SelectItem>
            <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
            <SelectItem value="masters">Master's Degree</SelectItem>
            <SelectItem value="phd">PhD</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="skills">Key Skills</Label>
        <Textarea
          id="skills"
          placeholder="Enter your key skills (e.g., Python, Marketing, Graphic Design)"
          className="resize-none"
          value={formData.skills}
          onChange={(e) => updateFormData("skills", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="experience">Experience Level</Label>
        <Select value={formData.experienceLevel} onValueChange={(value) => updateFormData("experienceLevel", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
            <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
            <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function AvailabilityStep({ formData, updateFormData }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-4">
        <div className="relative w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center">
          <Clock className="h-8 w-8 text-orange-500" />
          <div className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-1">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div>
        <Label>Availability</Label>
        <Select value={formData.availability} onValueChange={(value) => updateFormData("availability", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full-time">Full-time (40+ hours/week)</SelectItem>
            <SelectItem value="part-time">Part-time (20-30 hours/week)</SelectItem>
            <SelectItem value="flexible">Flexible (10-20 hours/week)</SelectItem>
            <SelectItem value="weekends">Weekends only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Preferred Duration</Label>
        <Select value={formData.duration} onValueChange={(value) => updateFormData("duration", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select preferred duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-month">1 month</SelectItem>
            <SelectItem value="3-months">3 months</SelectItem>
            <SelectItem value="6-months">6 months</SelectItem>
            <SelectItem value="1-year">1 year</SelectItem>
            <SelectItem value="flexible">Flexible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Remote/On-site Preference</Label>
        <Select value={formData.workArrangement} onValueChange={(value) => updateFormData("workArrangement", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select work arrangement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="remote">Remote only</SelectItem>
            <SelectItem value="onsite">On-site only</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="flexible">Flexible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Compensation Expectations</Label>
        <Select value={formData.compensation} onValueChange={(value) => updateFormData("compensation", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select compensation type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paid">Paid internship</SelectItem>
            <SelectItem value="unpaid">Unpaid (experience only)</SelectItem>
            <SelectItem value="language-exchange">Language exchange only</SelectItem>
            <SelectItem value="negotiable">Negotiable</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
