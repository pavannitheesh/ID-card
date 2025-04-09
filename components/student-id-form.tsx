"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RefreshCw, Upload } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {CLASS_DIVISIONS, BUS_ROUTES, ALLERGIES} from "@/constants/data";

export default function StudentIdForm({ studentData, setStudentData, cardStyle }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setStudentData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setStudentData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAllergyChange = (allergyId, checked) => {
    setStudentData((prev) => {
      if (checked) {
        return {
          ...prev,
          allergies: [...prev.allergies, allergyId],
        }
      } else {
        return {
          ...prev,
          allergies: prev.allergies.filter((id) => id !== allergyId),
        }
      }
    })
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setStudentData((prev) => ({
          ...prev,
          photo: file,
          photoPreview: reader.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const resetForm = () => {
    setStudentData({
      name: "",
      rollNumber: "",
      classAndDivision: "",
      allergies: [],
      photo: null,
      photoPreview: "",
      rackNumber: "",
      busRouteNumber: "",
    })
  }

  const saveIdCard = () => {
    // Validate form
    if (!studentData.name || !studentData.rollNumber || !studentData.classAndDivision) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields (Name, Roll Number, Class & Division)",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Get existing cards or initialize empty array
      const existingCards = JSON.parse(localStorage.getItem("studentIdCards") || "[]")

      // Create new card object
      const newCard = {
        id: uuidv4(),
        studentData,
        cardStyle,
        createdAt: new Date().toISOString(),
      }

      // Add new card to array
      const updatedCards = [...existingCards, newCard]

      // Save to localStorage
      localStorage.setItem("studentIdCards", JSON.stringify(updatedCards))

      toast({
        title: "Success!",
        description: "ID card has been saved successfully",
      })

      // Optional: reset form after saving
      resetForm()
    } catch (error) {
      console.error("Error saving card:", error)
      toast({
        title: "Error",
        description: "Failed to save ID card",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Student Information</h2>

      <div>
        <Label htmlFor="name">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={studentData.name}
          onChange={handleInputChange}
          placeholder="Enter student's full name"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="rollNumber">
          Roll Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="rollNumber"
          name="rollNumber"
          value={studentData.rollNumber}
          onChange={handleInputChange}
          placeholder="Enter roll number"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="classAndDivision">
          Class & Division <span className="text-red-500">*</span>
        </Label>
        <Select
          value={studentData.classAndDivision}
          onValueChange={(value) => handleSelectChange("classAndDivision", value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select class and division" />
          </SelectTrigger>
          <SelectContent>
            {CLASS_DIVISIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="photo">Photo Upload</Label>
        <div className="mt-1 flex items-center gap-4">
          <div className="flex-1">
            <Label
              htmlFor="photo-upload"
              className="flex items-center justify-center w-full h-10 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              {studentData.photo ? "Change Photo" : "Upload Photo"}
            </Label>
            <Input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </div>

          {studentData.photoPreview && (
            <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-200">
              <img
                src={studentData.photoPreview || "/placeholder.svg"}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="rackNumber">Rack Number</Label>
        <Input
          id="rackNumber"
          name="rackNumber"
          value={studentData.rackNumber}
          onChange={handleInputChange}
          placeholder="Enter rack number"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="busRouteNumber">Bus Route Number</Label>
        <Select
          value={studentData.busRouteNumber}
          onValueChange={(value) => handleSelectChange("busRouteNumber", value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select bus route" />
          </SelectTrigger>
          <SelectContent>
            {BUS_ROUTES.map((route) => (
              <SelectItem key={route} value={route}>
                {route}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block">Allergies</Label>
        <div className="grid grid-cols-2 gap-2">
          {ALLERGIES.map((allergy) => (
            <div key={allergy.id} className="flex items-center space-x-2">
              <Checkbox
                id={`allergy-${allergy.id}`}
                checked={studentData.allergies.includes(allergy.id)}
                onCheckedChange={(checked) => handleAllergyChange(allergy.id, checked)}
              />
              <Label htmlFor={`allergy-${allergy.id}`} className="text-sm font-normal">
                {allergy.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={resetForm} variant="outline" className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>

        <Button onClick={saveIdCard} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Saving..." : "Save ID Card"}
        </Button>
      </div>

      <Toaster />
    </div>
  )
}
