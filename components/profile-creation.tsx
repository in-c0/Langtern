"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Languages, Briefcase, Clock, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export function ProfileCreation({ onComplete }) {
  const [step, setStep] = useState(1)
  const totalSteps = 4

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
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
        {step === 1 && <PersonalInfoStep />}
        {step === 2 && <LanguageSkillsStep />}
        {step === 3 && <ProfessionalSkillsStep />}
        {step === 4 && <AvailabilityStep />}
      </motion.div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" size="sm" onClick={prevStep} disabled={step === 1}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <Button onClick={nextStep} size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          {step === totalSteps ? "Complete" : "Next"} <ChevronRight className="h-4 w-4 ml-1" />
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

function PersonalInfoStep() {
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
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="Enter your full name" />
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="your@email.com" />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Select>
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
        <Textarea id="bio" placeholder="Tell us a bit about yourself..." className="resize-none" />
      </div>
    </div>
  )
}

function LanguageSkillsStep() {
  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-4">
        <div className="relative w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center">
          <Languages className="h-8 w-8 text-purple-500" />
          <div className="absolute bottom-0 right-0 bg-purple-500 text-white rounded-full p-1">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div>
        <Label>Native Language</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select your native language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
            <SelectItem value="zh">Chinese (Mandarin)</SelectItem>
            <SelectItem value="ko">Korean</SelectItem>
            <SelectItem value="pt">Portuguese</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Languages I Want to Learn</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select target language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
            <SelectItem value="zh">Chinese (Mandarin)</SelectItem>
            <SelectItem value="ko">Korean</SelectItem>
            <SelectItem value="pt">Portuguese</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block">Current Proficiency Level</Label>
        <div className="space-y-6">
          <LanguageProficiency language="English" level={90} />
          <LanguageProficiency language="Spanish" level={40} />
          <LanguageProficiency language="Japanese" level={10} />
        </div>
      </div>
    </div>
  )
}

function LanguageProficiency({ language, level }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{language}</span>
        <span className="text-muted-foreground">{getProficiencyLabel(level)}</span>
      </div>
      <Slider defaultValue={[level]} max={100} step={1} />
    </div>
  )
}

function getProficiencyLabel(level) {
  if (level < 20) return "Beginner"
  if (level < 40) return "Elementary"
  if (level < 60) return "Intermediate"
  if (level < 80) return "Advanced"
  return "Native/Fluent"
}

function ProfessionalSkillsStep() {
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
        <Select>
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
        <Select>
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
        />
      </div>

      <div>
        <Label htmlFor="experience">Experience Level</Label>
        <Select>
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

function AvailabilityStep() {
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
        <Select>
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
        <Select>
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
        <Select>
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
        <Select>
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
