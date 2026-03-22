import { Separator } from '@/components/ui/separator'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <Separator className="mb-6" />
        <p className="text-center text-sm text-muted-foreground">
          &copy; {currentYear} 센시(Sensi). 민감한 영혼들을 위한 따뜻한 공간.
        </p>
      </div>
    </footer>
  )
}
