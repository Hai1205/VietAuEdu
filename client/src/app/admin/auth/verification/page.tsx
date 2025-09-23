"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { formatTime } from "@/lib/utils";
import { useAuthStore } from "@/utils/stores/authStore";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const OTPVerificationPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOTP, sendOTP } = useAuthStore();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hasRun = useRef(false);

  // Countdown timer state - 5 minutes (300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [isExpired, setIsExpired] = useState(false);

  // Get email and isPasswordReset from search params
  const email = searchParams.get("email") || "";
  const isPasswordReset = searchParams.get("isPasswordReset") === "true";

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    handleResendCode();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (error) setError("");

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(0, 1); // Only take the first character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);

      // Focus the last input
      inputRefs.current[5]?.focus();
    }
  };

  const validate = () => {
    if (otp.some((digit) => !digit)) {
      setError("Please enter the complete 6-digit code");

      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const res = await verifyOTP(email, otp.join(""));

    if (!res) {
      setOtp(Array(6).fill(""));
      return;
    }

    if (isExpired) {
      setError("The verification code has expired. Please request a new one.");
      setOtp(Array(6).fill(""));
      return;
    }

    if (isPasswordReset) {
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      return;
    }

    router.push("/login");
  };

  const handleResendCode = async () => {
    const res = await sendOTP(email);
    if (!res) {
      return;
    }

    setOtp(Array(6).fill(""));
    setError("");
    setTimeLeft(300);
    setIsExpired(false);
    inputRefs.current[0]?.focus();
  };

  // Determine timer color based on time left
  const getTimerColor = () => {
    if (timeLeft <= 30) return "text-red-500";
    if (timeLeft <= 60) return "text-yellow-500";
    return "text-gray-400";
  };

  return (
    <>
      <h1 className="text-[#1877F2] text-2xl font-bold text-center mb-6">
        Enter verification code
      </h1>

      <p className="text-gray-400 text-sm mb-2">
        We&apos;ve sent a verification code to {email || "your email"}. Enter the
        code below to{" "}
        {isPasswordReset ? "reset your password" : "verify your account"}.
      </p>

      {/* Countdown Timer */}
      <div className={`text-center mb-6 ${getTimerColor()}`}>
        <p className="text-sm">
          {isExpired
            ? "Code expired. Please request a new one."
            : `Code expires in: ${formatTime(timeLeft)}`}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-6">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              ref={(el) => {inputRefs.current[index] = el;}}
              type="text"
              value={otp[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-12 h-12 text-center text-xl font-bold bg-[#282828] text-white border ${
                isExpired ? "border-red-500" : "border-[#3E3E3E]"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-[#1877F2] focus:border-[#1877F2]`}
              maxLength={1}
              disabled={isExpired}
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <Button
          type="submit"
          className="mt-6 mb-4 bg-[#1877F2] hover:bg-[#166FE5]"
        >
          Verify
        </Button>

        <div className="text-center mb-4">
          <p className="text-gray-400 text-sm">
            {isExpired ? "Code expired. " : "Didn&apos;t receive a code? "}

            <a
              onClick={(e) => {
                e.preventDefault();

                handleResendCode();
              }}
              className="text-white hover:text-[#1877F2] underline cursor-pointer"
            >
              Resend code
            </a>
          </p>
        </div>
      </form>
    </>
  );
};

export default OTPVerificationPage;