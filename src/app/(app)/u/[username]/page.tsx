"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();
  const username = pathname.split("/").pop() || "";

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userExists, setUserExists] = useState(true);

  // Hardcoded message suggestions as requested
  const suggestions = [
    "What's a hobby you've recently started?",
    "If you could have dinner with any historical figure, who would it be?",
    "What's a simple thing that makes you happy?",
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast("Error", {
        description: "Please enter a message",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: message,
      });

      if (response.data.success) {
        toast("Success", {
          description: response.data.message || "Message sent successfully",
        });
        setMessage("");
      } else {
        toast("Error", {
          description: response.data.message || "Failed to send message",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.status === 404) {
        if (axiosError.response.data.message === "User not found") {
          setUserExists(false);
        }
        toast("Error", {
          description:
            axiosError.response.data.message || "Failed to send message",
        });
      } else {
        toast("Error", {
          description: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  if (!userExists) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">User Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">
              The user {username} doesn&apos;t exist.
            </p>
            <div className="flex justify-center">
              <Button onClick={() => (window.location.href = "/")}>
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            Send an Anonymous Message to {username}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[120px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message here..."
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Try These Suggestions:</p>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
