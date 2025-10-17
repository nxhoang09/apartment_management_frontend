import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Home, Maximize2 } from "lucide-react"

export default function PublicApartmentsPage() {
  // Mock data for public view
  const apartments = [
    {
      id: 1,
      code: "A-101",
      floor: 10,
      area: 85,
      status: "available",
      image: "/images/apartment-1.jpg",
    },
    {
      id: 2,
      code: "A-102",
      floor: 10,
      area: 85,
      status: "occupied",
      image: "/images/apartment-2.jpg",
    },
    {
      id: 3,
      code: "B-201",
      floor: 20,
      area: 120,
      status: "available",
      image: "/images/apartment-4.jpg",
    },
    {
      id: 4,
      code: "C-301",
      floor: 30,
      area: 150,
      status: "available",
      image: "/images/apartment-6.jpg",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Căn hộ cao cấp
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">Khám phá căn hộ của chúng tôi</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Các căn hộ hiện đại với đầy đủ tiện nghi, thiết kế thông minh và vị trí đắc địa
              </p>
            </div>
          </div>
        </section>

        {/* Apartments Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {apartments.map((apartment) => (
                <Card
                  key={apartment.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={apartment.image || "/placeholder.svg"}
                      alt={apartment.code}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant={apartment.status === "available" ? "default" : "secondary"}>
                        {apartment.status === "available" ? "Còn trống" : "Đã có người"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold">{apartment.code}</h3>
                      <p className="text-sm text-muted-foreground">Tầng {apartment.floor}</p>
                    </div>

                    <div className="flex items-center gap-6 py-4 border-y border-border">
                      <div className="flex items-center gap-2">
                        <Maximize2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{apartment.area}m²</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Tầng {apartment.floor}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-primary">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Xem chi tiết</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
