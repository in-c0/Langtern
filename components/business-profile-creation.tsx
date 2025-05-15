"use client"

import { useState } from "react"
import { Briefcase, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function BusinessProfileCreation({ onComplete, onBack }) {
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    description: "",
    location: "",
    contactEmail: "",
  })
  const [errors, setErrors] = useState([])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    const requiredFields = ["companyName", "industry", "location", "contactEmail"]
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      setErrors(missingFields)
      return false
    }

    setErrors([])
    return true
  }

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Business Profile Data:", formData)
      onComplete(formData)
    }
  }

  const getFieldLabel = (field) => {
    const labels = {
      companyName: "Company Name",
      industry: "Industry",
      location: "Location",
      contactEmail: "Contact Email",
    }
    return labels[field] || field
  }

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
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          name="companyName"
          placeholder="Enter your company name"
          value={formData.companyName}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="industry">Industry</Label>
        <Select name="industry" onValueChange={(value) => handleChange({ target: { name: "industry", value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Company Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Tell us about your company..."
          className="resize-none"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          placeholder="Enter your company location"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="contactEmail">Contact Email</Label>
        <Input
          id="contactEmail"
          name="contactEmail"
          type="email"
          placeholder="Enter your contact email"
          value={formData.contactEmail}
          onChange={handleChange}
        />
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fill in the following required fields: {errors.map((field) => getFieldLabel(field)).join(", ")}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Home
        </Button>

        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white" onClick={handleSubmit}>
          Create Profile
        </Button>
      </div>
    </div>
  )
}
