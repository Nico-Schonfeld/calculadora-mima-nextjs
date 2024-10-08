"use client"

import { useState, useRef } from "react"
import { Plus, Minus, Calculator, Scissors, DollarSign, ShoppingCart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

interface Material {
  name: string
  quantity: number
  price: number
}

const DressmakerBudgetCalculator = () => {
  const [materials, setMaterials] = useState<Material[]>([{ name: "", quantity: 0, price: 0 }])
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [totalWith10Percent, setTotalWith10Percent] = useState(0)
  const [totalWith15Percent, setTotalWith15Percent] = useState(0)
  const [activeTab, setActiveTab] = useState("materials")
  const formRef = useRef<HTMLFormElement>(null)

  const addMaterial = () => {
    setMaterials([...materials, { name: "", quantity: 0, price: 0 }])
  }

  const removeMaterial = (index: number) => {
    const newMaterials = materials.filter((_, i) => i !== index)
    setMaterials(newMaterials)
  }

  const updateMaterial = (index: number, field: keyof Material, value: string | number) => {
    const newMaterials = [...materials]
    newMaterials[index] = { ...newMaterials[index], [field]: value }
    setMaterials(newMaterials)
  }

  const calculateTotal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const materialData: Material[] = []
    let isValid = false
    let sum = 0

    for (let i = 0; i < materials.length; i++) {
      const name = formData.get(`material-${i}`) as string
      const quantityStr = (formData.get(`quantity-${i}`) as string).replace(',', '.')
      const quantity = parseFloat(quantityStr)
      const price = parseFloat(formData.get(`price-${i}`) as string)

      if (name && !isNaN(quantity) && !isNaN(price)) {
        materialData.push({ name, quantity, price })
        isValid = true
        sum += quantity * price
      }
    }

    if (!isValid) {
      toast.error("Por favor complete al menos un material antes de calcular.")
      return
    }

    const finalTotal = sum * 3
    setMaterials(materialData)
    setSubtotal(sum)
    setTotal(finalTotal)
    setTotalWith10Percent(finalTotal * 1.1)
    setTotalWith15Percent(finalTotal * 1.15)
    setActiveTab("summary")
    toast.success("Presupuesto calculado correctamente!")
  }

  const startNewCalculation = () => {
    setMaterials([{ name: "", quantity: 0, price: 0 }])
    setSubtotal(0)
    setTotal(0)
    setTotalWith10Percent(0)
    setTotalWith15Percent(0)
    setActiveTab("materials")
    toast.info("Comenzó un nuevo cálculo.")
  }

  const handleTabChange = (value: string) => {
    if (value !== "materials" && !materials.some(m => m.name && m.quantity && m.price)) {
      toast.error("Por favor complete al menos un material antes de continuar.")
      return
    }
    setActiveTab(value)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto h-auto">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="materials">
            <Scissors className="w-4 h-4 mr-2" />
            Materiales
          </TabsTrigger>
          <TabsTrigger value="summary">
            <Calculator className="w-4 h-4 mr-2" />
            Sumas
          </TabsTrigger>
          <TabsTrigger value="installments">
            <DollarSign className="w-4 h-4 mr-2" />
            Cuotas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="materials">
          <CardContent>
            <form ref={formRef} onSubmit={calculateTotal}>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6">
                  {materials.map((material, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-muted/50">
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label htmlFor={`material-${index}`}>Material</Label>
                          <Input
                            id={`material-${index}`}
                            name={`material-${index}`}
                            value={material.name}
                            onChange={(e) => updateMaterial(index, "name", e.target.value)}
                            placeholder="Telas, Hilos..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`quantity-${index}`}>Cantidad</Label>
                          <Input
                            id={`quantity-${index}`}
                            name={`quantity-${index}`}
                            type="text"
                            value={material.quantity}
                            onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                            placeholder="Ej: 4 o 3.50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`price-${index}`}>Precio por Unidad</Label>
                          <Input
                            id={`price-${index}`}
                            name={`price-${index}`}
                            type="number"
                            value={material.price}
                            onChange={(e) => updateMaterial(index, "price", parseFloat(e.target.value))}
                            placeholder="Ingrese precio"
                          />
                        </div>
                        <div className="flex items-end">
                          {materials.length > 1 && (
                            <Button type="button" variant="destructive" onClick={() => removeMaterial(index)}>
                              <Minus className="w-4 h-4 mr-2" />
                              Eliminar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
                <Button type="button" onClick={addMaterial} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Material
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calcular Total
                </Button>
              </div>
            </form>
          </CardContent>
        </TabsContent>
        <TabsContent value="summary">
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">Costo de Materiales</h3>
                    <p className="text-3xl font-bold">${subtotal.toFixed(2)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">Total (x3)</h3>
                    <p className="text-3xl font-bold">${total.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </div>
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Total con 10%</h3>
                  <p className="text-4xl font-bold">${totalWith10Percent.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card className="bg-secondary text-secondary-foreground">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Total con 15%</h3>
                  <p className="text-4xl font-bold">${totalWith15Percent.toFixed(2)}</p>
                </CardContent>
              </Card>
              <div className="flex justify-center">
                <Button onClick={startNewCalculation}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Comenzar Nuevo Cálculo
                </Button>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        <TabsContent value="installments">
          <CardContent>
            <div className="flex justify-center items-center w-full py-20">
              <Button onClick={startNewCalculation}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Comenzar Nuevo Cálculo
              </Button>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Calcular Cuotas</h3>
              <p>Use la calculadora a continuación para determinar las opciones de cuotas:</p>
              <div className="aspect-video w-full">
                <iframe
                  src="https://infleta.com.ar/"
                  title="Calculadora de Cuotas"
                  className="w-full h-screen border-0 rounded-lg"
                  allow="fullscreen"
                ></iframe>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

export default DressmakerBudgetCalculator
