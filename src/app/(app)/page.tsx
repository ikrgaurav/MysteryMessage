"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gradient-to-b from-gray-900 to-gray-700 text-white min-h-[90vh]">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Onest Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-xl md:text-2xl max-w-2xl mx-auto text-gray-200">
            Send and receive anonymous messages with friends and colleagues.
          </p>
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/sign-up">Get Started</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-blue-400 text-blue-400 hover:bg-blue-900/20"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </section>

        {/* Carousel for Messages */}
        <div className="w-full max-w-3xl mx-auto mt-8 backdrop-blur-sm bg-white/10 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            What People Are Saying
          </h2>
          <Carousel plugins={[Autoplay({ delay: 3000 })]} className="w-full">
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="border-0 bg-white/20 backdrop-blur-md text-white shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-400" />
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg">{message.content}</p>
                      <p className="text-sm text-gray-300 mt-2">
                        {message.received}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <p>© 2025 Onest Feedback. All rights reserved.</p>
          <p className="text-sm mt-2">
            Send anonymous messages with ease and privacy.
          </p>
        </div>
      </footer>
    </>
  );
}
