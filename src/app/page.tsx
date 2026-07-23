import { ArrowRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-background p-16">
      <main className="flex flex-col gap-10">
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-foreground">Primary</h2>
          <div className="flex items-center gap-4">
            <Button variant="primary">Default</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="primary">
              <Plus data-icon="inline-start" />
              Start decorator
            </Button>
            <Button variant="primary">
              End decorator
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-foreground">Outline</h2>
          <div className="flex items-center gap-4">
            <Button variant="outline">Default</Button>
            <Button variant="outline" disabled>
              Disabled
            </Button>
            <Button variant="outline">
              <Plus data-icon="inline-start" />
              Start decorator
            </Button>
            <Button variant="outline">
              End decorator
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
