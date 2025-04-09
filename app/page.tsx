"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye } from "lucide-react"
import StudentIdForm from "@/components/student-id-form"
import IdCardPreview from "@/components/id-card-preview"
import "./globals.css"
export default function HomePage() {
  const [studentData, setStudentData] = useState({
    name: "",
    rollNumber: "",
    classAndDivision: "",
    allergies: [],
    photo: null,
    photoPreview: "",
    rackNumber: "",
    busRouteNumber: "",
  })

  const [cardStyle, setCardStyle] = useState<"modern" | "retro">("modern")

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Smart Student ID Generator</h1>
        <Link href="/saved-cards">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Saved Cards
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="modern" className="mb-6" onValueChange={(value) => setCardStyle(value as "modern" | "retro")}>
        <div className="flex justify-center mb-4">
          <TabsList>
            <TabsTrigger value="modern">Modern Style</TabsTrigger>
            <TabsTrigger value="retro">Retro Style</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="pt-6">
            <StudentIdForm studentData={studentData} setStudentData={setStudentData} cardStyle={cardStyle} />
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">ID Card Preview</h2>
          <IdCardPreview studentData={studentData} cardStyle={cardStyle} />
        </div>
      </div>
    </main>
  )
}
