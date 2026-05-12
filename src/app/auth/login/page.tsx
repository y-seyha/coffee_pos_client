"use client";

import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "សូមបញ្ចូលអ៊ីមែល")
    .email("អ៊ីមែលមិនត្រឹមត្រូវ")
    .max(100, "អ៊ីមែលវែងពេក"),

  password: z
    .string()
    .min(8, "លេខសម្ងាត់ត្រូវមានយ៉ាងតិច 8 តួ")
    .max(64, "លេខសម្ងាត់វែងពេក"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();

  const { login } = useAuth();

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError("");

      await login({
        email: data.email,
        password: data.password,
      });

      router.push("/");
    } catch (error: any) {
      setServerError(
        // error?.response?.data?.message || error?.message ||
        "Incorrect email or password",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#cd8c52] p-4 font-sans selection:bg-[#43281c] selection:text-white">
      <Head>
        <title>404' Cafe - Login</title>
      </Head>

      {/* Main Container: ensures vertical and horizontal centering */}
      <div className="relative flex items-center justify-center w-full max-w-7xl">
        {/* Login Card: Width is responsive (full on mobile, fixed 640px on laptop) */}
        <div
          className="bg-[#f1e0ca] p-8 md:p-16 rounded-[40px] md:rounded-[60px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-10 flex flex-col justify-center transition-all w-full max-w-[440px] md:max-w-[640px]"
          style={{ minHeight: "512px" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-5 h-5 bg-[#43281c] rounded-full flex items-center justify-center">
              <div className="w-[2px] h-3 bg-[#f1e0ca] rotate-45 rounded-full"></div>
            </div>
            <span className="font-bold text-xs tracking-[0.25em] text-[#43281c]">
              404' CAFE.
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-[40px] md:text-[52px] font-bold text-[#43281c] mb-10 font-khmer leading-none text-left">
            ចូលប្រើប្រាស់
          </h1>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 w-full md:max-w-[400px]"
          >
            {/* SERVER ERROR */}
            {serverError && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-5 py-3 rounded-2xl text-sm font-medium">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-[#a47e5e] ml-6">
                ឈ្មោះអ្នកប្រើប្រាស់ ឬ អ៊ីមែល
              </label>

              <input
                type="email"
                placeholder="example@gmail.com"
                autoComplete="email"
                {...register("email")}
                className={`w-full h-12 px-7 rounded-full border-2 bg-[#f1e0ca] focus:outline-none focus:ring-2 transition-all placeholder:text-[#a47e5e]/40 text-[#43281c] font-medium ${
                  errors.email
                    ? "border-red-500 focus:ring-red-300"
                    : "border-[#813800] focus:ring-[#813800]/20"
                }`}
              />

              {errors.email && (
                <p className="text-red-500 text-sm ml-6 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between px-6">
                <label className="text-[13px] font-bold text-[#a47e5e]">
                  លេខសម្ងាត់
                </label>

                <a
                  href="#"
                  className="text-[13px] font-bold text-[#cd8c52] hover:opacity-80 transition-opacity"
                >
                  ភ្លេចលេខសម្ងាត់?
                </a>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="........"
                  autoComplete="current-password"
                  {...register("password")}
                  className={`w-full h-12 px-7 pr-14 rounded-full border-2 bg-[#f1e0ca] focus:outline-none focus:ring-2 transition-all placeholder:text-[#a47e5e]/40 text-[#43281c] ${
                    errors.password
                      ? "border-red-500 focus:ring-red-300"
                      : "border-[#813800] focus:ring-[#813800]/20"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#a47e5e] hover:text-[#43281c] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm ml-6 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-12 py-3.5 bg-[#43281c] text-[#f1e0ca] rounded-[20px] font-bold text-[14px] hover:bg-[#2d1a13] transition-all active:scale-95 shadow-xl disabled:opacity-60"
              >
                {isSubmitting ? "កំពុងផ្ទៀងផ្ទាត់..." : "ចូលប្រើ"}
              </button>
            </div>
          </form>
        </div>

        {/* Coffee Cup: Hidden on mobile */}
        <div className="hidden md:block relative md:ml-[-240px] z-20 pointer-events-none select-none">
          <div className="relative md:w-[580px] md:h-[680px]">
            <Image
              src="/coffee_cup.png"
              alt="Coffee Cup"
              fill
              priority
              className="object-contain drop-shadow-[0_45px_45px_rgba(0,0,0,0.35)]"
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;700&display=swap");

        .font-khmer {
          font-family: "Kantumruy Pro", sans-serif;
          letter-spacing: -0.03em;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
