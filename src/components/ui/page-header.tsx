import * as React from "react"
import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    heading: string
    subheading?: string
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
    ({ className, heading, subheading, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("bg-muted/50 py-12 md:py-20", className)}
            {...props}
        >
            <Container>
                <div className="max-w-3xl space-y-4">
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-foreground">
                        {heading}
                    </h1>
                    {subheading && (
                        <p className="text-xl text-muted-foreground">{subheading}</p>
                    )}
                </div>
            </Container>
        </div>
    )
)
PageHeader.displayName = "PageHeader"

export { PageHeader }
