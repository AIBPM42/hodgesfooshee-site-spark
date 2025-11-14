"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Loader2 } from "lucide-react";

interface PropertyInquiryFormProps {
  propertyId: string;
  propertyAddress: string;
  agentPhone?: string;
  agentEmail?: string;
}

export function PropertyInquiryForm({
  propertyId,
  propertyAddress,
  agentPhone,
  agentEmail,
}: PropertyInquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "request_info",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/property-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          propertyId,
          propertyAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "request_info",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      setSubmitError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">✓</div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Message Sent!
        </h3>
        <p className="text-sm text-green-700">
          We'll be in touch with you shortly about this property.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quick Contact Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {agentPhone && (
          <a
            href={`tel:${agentPhone}`}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-copper-sweep text-white rounded-lg hover:bg-copper-700 transition-colors font-semibold"
          >
            <Phone className="w-4 h-4" />
            Call
          </a>
        )}
        {agentEmail && (
          <a
            href={`mailto:${agentEmail}`}
            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-copper-sweep text-copper-700 rounded-lg hover:bg-copper-50 transition-colors font-semibold"
          >
            <Mail className="w-4 h-4" />
            Email
          </a>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or send a message</span>
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-charcoal-900 mb-1">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-transparent"
            placeholder="John Smith"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-charcoal-900 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-transparent"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-charcoal-900 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-transparent"
            placeholder="(615) 555-1234"
          />
        </div>

        <div>
          <label htmlFor="inquiryType" className="block text-sm font-medium text-charcoal-900 mb-1">
            I'm Interested In
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-transparent"
          >
            <option value="schedule_showing">Schedule a Showing</option>
            <option value="request_info">Request More Info</option>
            <option value="make_offer">I'm Ready to Make an Offer</option>
            <option value="ask_question">Ask a Question</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-charcoal-900 mb-1">
            Message (Optional)
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-transparent resize-none"
            placeholder="Any additional details or questions..."
          />
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-copper-sweep hover:bg-copper-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Inquiry"
          )}
        </Button>
      </form>
    </div>
  );
}
