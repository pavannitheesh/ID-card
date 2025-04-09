"use client"

import { useRef, useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { toPng } from "html-to-image"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function IdCardPreview({
  studentData,
  cardStyle,
  showDownloadButton = true,
  showStyleToggle = false,
  onStyleChange = null,
}) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentView, setCurrentView] = useState("front")
  const [currentStyle, setCurrentStyle] = useState(cardStyle)

  // Update currentStyle when cardStyle prop changes
  useEffect(() => {
    setCurrentStyle(cardStyle)
  }, [cardStyle])
  const idCardRef = useRef(null)
  const backCardRef = useRef(null)

  const generateQRData = () => {
    return JSON.stringify({
      name: studentData.name,
      rollNumber: studentData.rollNumber,
      class: studentData.classAndDivision,
      allergies: studentData.allergies,
      rackNumber: studentData.rackNumber,
      busRouteNumber: studentData.busRouteNumber,
      timestamp: new Date().toISOString(),
    })
  }

  const downloadIDCard = async () => {
    const isModern = currentStyle === "modern";
  
    const frontRef = idCardRef.current;
    const backRef = isModern ? null : backCardRef.current;
  
    if (!frontRef || (!isModern && !backRef)) {
      console.error("One or both card references are null.");
      return;
    }
  
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.gap = "20px";
    container.style.padding = "20px";
    container.style.background = "white";
  
    // Clone only what's available
    const frontCard = frontRef.cloneNode(true);
    container.appendChild(frontCard);
  
    if (!isModern && backRef) {
      const backCard = backRef.cloneNode(true);
      container.appendChild(backCard);
    }
  
    document.body.appendChild(container);
    setIsGenerating(true);
  
    try {
      const dataUrl = await toPng(container, { quality: 0.95 });
  
      const link = document.createElement("a");
      link.download = `${studentData.name.replace(/\s+/g, "-")}-ID-Card.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      document.body.removeChild(container);
      setIsGenerating(false);
    }
  };
  

  const handleStyleChange = (value) => {
    setCurrentStyle(value)
    if (onStyleChange) {
      onStyleChange(value)
    }
  }

  const isFormComplete = studentData.name && studentData.rollNumber && studentData.classAndDivision

  // Format allergies for display
  const allergiesDisplay =
    studentData.allergies.length > 0
      ? studentData.allergies
          .map((id) => {
            const allergy = {
              peanuts: "Peanuts",
              dairy: "Dairy",
              gluten: "Gluten",
              eggs: "Eggs",
              shellfish: "Shellfish",
              soy: "Soy",
              "tree-nuts": "Tree Nuts",
            }[id]
            return allergy
          })
          .join(", ")
      : "None"

  return (
    <div className="space-y-4">
      {showStyleToggle && (
        <Tabs defaultValue={currentStyle} className="mb-6" onValueChange={handleStyleChange}>
          <div className="flex justify-center mb-4">
            <TabsList>
              <TabsTrigger value="modern">Modern Style</TabsTrigger>
              <TabsTrigger value="retro">Retro Style</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      )}

      {currentStyle === "modern" ? (
        <div className="space-y-6">
          <div 
            ref={idCardRef}
            className="bg-[url('/istockphoto-2161589436-612x612.jpg')]  p-4 rounded-lg shadow-md border border-gray-200 w-full max-w-md mx-auto"
            style={{ aspectRatio: "1.6/1"}}
          >
            <div className=" backdrop-blur-sm flex h-full ">
              {/* Left side - Photo and basic info */}
              <div className="w-1/3 flex flex-col items-center justify-center border-r border-gray-200 pr-2">
                <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-2 border-blue-300 mb-3">
                  {studentData.photoPreview ? (
                    <img
                      src={studentData.photoPreview || "/placeholder.svg"}
                      alt={studentData.name.toUpperCase()}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Photo</div>
                  )}
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-blue-800">{studentData.name.toUpperCase() || "Student Name"}</h4>
                  <p className="text-xs text-black">ID: {studentData.rollNumber || "XXXXX"}</p>
                </div>
              </div>

              {/* Right side - Details and QR code */}
              <div className="relative w-2/3 pl-1 flex">
                <div className=" pr-2">
                  <div className="bg-sky-500 text-white text-center py-1 rounded-t-md">
                    <h3 className="text-lg font-bold">UNITY SCHOOL</h3>
                  </div>
                  <div className="space-y-2 mt-4 ">
                    <p className="text-md">
                      <span className="font-semibold">Class:</span> {studentData.classAndDivision || "XX-XXX"}
                    </p>
                    {studentData.rackNumber && (
                      <p className="text-md">
                        <span className="font-semibold">Rack No:</span> {studentData.rackNumber}
                      </p>
                    )}
                    {studentData.busRouteNumber && (
                      <p className="text-md">
                        <span className="font-semibold">Bus Route:</span> {studentData.busRouteNumber}
                      </p>
                    )}
                    {studentData.allergies.length > 0 && (
                      <div className="text-xs bg-red-50 p-1 px-2 inline-block rounded border border-red-200 mt-1">
                        <span className="font-semibold text-red-600">Allergies:</span> {allergiesDisplay}
                      </div>
                    )}
                  </div>
                  <div className=" mt-2 text-xs  text-gray-500">
                    <p>Valid for Academic Year 2024-25</p>
                  </div>
                </div>
                <div className=" absolute bottom-0 right-0 flex items-end justify-center">
                  {isFormComplete ? (
                    <QRCodeSVG value={generateQRData()} size={70} />
                  ) : (
                    <div className="w-[70px] h-[70px] bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded">
                      QR
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {showDownloadButton && (
            <div className="flex justify-center">
              <Button
                onClick={() => downloadIDCard("front")}
                disabled={!isFormComplete || isGenerating}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Download ID Card"}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-6 items-center">
            {/* Front Side */}
            <div
              ref={idCardRef}
              className="bg-amber-50 p-4 rounded-lg shadow-md border-4 border-amber-800 w-full max-w-md"
              style={{ aspectRatio: "1.6/1" }}
            >
              <div className="flex flex-col h-full">
                <div className="bg-amber-800 text-amber-50 text-center py-1 mb-3 rounded">
                  <h3 className="text-lg font-black" style={{ fontFamily: "serif" }}>
                    UNITY SCHOOL
                  </h3>
                </div>
                <div className="flex-1 flex">
                  <div className="w-1/3 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-4 border-amber-800 mb-3">
                      {studentData.photoPreview ? (
                        <img
                          src={studentData.photoPreview}
                          alt={studentData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Photo</div>
                      )}
                    </div>
                  </div>
                  <div className="w-2/3 pl-4">
                    <div className="space-y-2">
                      <div>
                        <h4 className="text-lg font-bold text-amber-900">{studentData.name.toUpperCase() || "Student Name"}</h4>
                        <p className="text-sm text-amber-800">ID: {studentData.rollNumber || "XXXXX"}</p>
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-semibold">Class:</span> {studentData.classAndDivision || "XX-XXX"}
                        </p>
                        {studentData.rackNumber && (
                          <p className="text-sm">
                            <span className="font-semibold">Rack No:</span> {studentData.rackNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-auto text-xs text-center text-amber-800">
                  <p>Valid for Academic Year 2024-25</p>
                </div>
              </div>
            </div>

            {/* Back Side */}
            <div
              ref={backCardRef}
              className="bg-amber-50 p-4 rounded-lg shadow-md border-4 border-amber-800 w-full max-w-md"
              style={{ aspectRatio: "1.6/1" }}
            >
              <div className="flex flex-col h-full">
                <div className="bg-amber-800 text-amber-50 text-center py-1 mb-3 rounded">
                  <h3 className="text-lg font-black" style={{ fontFamily: "serif" }}>
                    STUDENT INFORMATION
                  </h3>
                </div>
                <div className="flex-1 flex justify-between">
                  <div className="w-2/3 space-y-3">
                    {studentData.busRouteNumber && (
                      <div>
                        <h4 className="font-semibold text-amber-900">Bus Route</h4>
                        <p className="text-sm">{studentData.busRouteNumber}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-amber-900">Allergies</h4>
                      <p className="text-sm">{allergiesDisplay}</p>
                    </div>
                    <div className="text-xs text-amber-800">
                      <p>If found, please return to:</p>
                      <p>Unity School</p>
                      <p>123 Education Street</p>
                      <p>Knowledge City, KN 12345</p>
                    </div>
                  </div>
                  <div className="w-1/3 flex items-center justify-center">
                    {isFormComplete ? (
                      <div>
                      <QRCodeSVG value={generateQRData()} size={120} />
                       <span className="text-[9px] text-amber-800">Scan QR Code for details</span>
                      </div>
                    ) : (
                      <div className="w-[80px] h-[80px] bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded">
                        QR
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showDownloadButton && (
            <div className="flex justify-center">
              <Button
                onClick={downloadIDCard}
                disabled={!isFormComplete || isGenerating}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Download ID Card"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
