"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Trash2 } from "lucide-react"
import IdCardPreview from "@/components/id-card-preview"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type SavedCard = {
  id: string
  studentData: any
  cardStyle: "modern" | "retro"
  createdAt: string
}

export default function SavedCardsPage() {
  const [savedCards, setSavedCards] = useState<SavedCard[]>([])
  const [selectedCard, setSelectedCard] = useState<SavedCard | null>(null)
  const [viewStyle, setViewStyle] = useState<"modern" | "retro">("modern")

  useEffect(() => {
    const cards = localStorage.getItem("studentIdCards")
    if (cards) {
      setSavedCards(JSON.parse(cards))
    }
  }, [])

  const deleteCard = (id: string) => {
    const updatedCards = savedCards.filter((card) => card.id !== id)
    setSavedCards(updatedCards)
    localStorage.setItem("studentIdCards", JSON.stringify(updatedCards))
    if (selectedCard && selectedCard.id === id) {
      setSelectedCard(null)
    }
  }

  const clearAllCards = () => {
    setSavedCards([])
    localStorage.removeItem("studentIdCards")
    setSelectedCard(null)
  }

  const viewCard = (card: SavedCard) => {
    setSelectedCard(card)
    setViewStyle(card.cardStyle)
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Saved ID Cards</h1>
        </div>

        {savedCards.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Clear All</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your saved ID cards.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearAllCards}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {savedCards.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No saved ID cards</h2>
          <p className="text-gray-500 mb-6">You haven't saved any ID cards yet.</p>
          <Link href="/">
            <Button>Create New ID Card</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Card list */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Your ID Cards</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 p-2">
              {savedCards.map((card) => (
                <Card
                  key={card.id}
                  className={`overflow-hidden cursor-pointer transition-all ${
                    selectedCard?.id === card.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => viewCard(card)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{card.studentData.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteCard(card.id)
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <p>Class: {card.studentData.classAndDivision}</p>
                      <p>Created: {new Date(card.createdAt).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right side - Card preview */}
          <div className="lg:col-span-2">
            {selectedCard ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">ID Card Preview</h2>
                <IdCardPreview
                  studentData={selectedCard.studentData}
                  cardStyle={viewStyle}
                  showDownloadButton={true}
                  showStyleToggle={true}
                  onStyleChange={setViewStyle}
                />
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500">
                  <p className="mb-2">Select a card to preview</p>
                  <p className="text-sm">Click on any card from the list to view and download</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
