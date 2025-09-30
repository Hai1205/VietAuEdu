"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { useContactStore } from "@/utils/stores/contactStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProgramStore } from "@/utils/stores/programStore";
import { ADDRESS, EMAIL, PHONE } from "@/utils/services/constants";

const initialContact = {
  name: "",
  email: "",
  phone: "",
  program: "",
  message: "",
};

export default function ContactPageClient() {
  const { isLoading, submitContact } = useContactStore();
  const { isLoading: isLoadingPrograms, getAllPrograms } = useProgramStore();

  const [formData, setFormData] = useState(initialContact);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [programs, setPrograms] = useState<
    { value: string; label: string; _id: string }[]
  >([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      const response = await getAllPrograms();
      if (response.data && response.data.programs) {
        const programOptions = response.data.programs.map((program) => ({
          value: program.title || program.country,
          label: program.title || program.country,
          _id: program._id,
        }));
        setPrograms(programOptions);
        if (programOptions.length > 0) {
          setFormData((prev) => ({
            ...prev,
            program: programOptions[0].value,
          }));
        }
      }
    };

    fetchPrograms();
  }, [getAllPrograms]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await submitContact(
      formData.name,
      formData.email,
      formData.program,
      formData.phone,
      formData.message
    );

    setIsSubmitted(true);
    setFormData(initialContact);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <Card className="max-w-md mx-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="text-center pt-12 pb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Cảm ơn bạn đã liên hệ!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Chúng tôi đã nhận được thông tin của bạn và sẽ liên hệ lại trong
              vòng 24 giờ.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Gửi thông tin khác
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Liên Hệ Tư Vấn
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Hãy để lại thông tin để được tư vấn miễn phí và chi tiết nhất về
              chương trình du học phù hợp
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Gửi thông tin tư vấn
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300">
                  Vui lòng điền thông tin chi tiết để chúng tôi có thể tư vấn
                  tốt nhất cho bạn
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        placeholder="0987 654 321"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="program"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Chương trình quan tâm
                    </label>

                    <Select
                      value={
                        formData.program ||
                        (programs.length > 0 ? programs[0].value : "")
                      }
                      onValueChange={(value: string) =>
                        setFormData((prev) => ({ ...prev, program: value }))
                      }
                      disabled={isLoadingPrograms}
                    >
                      <SelectTrigger
                        id="program"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <SelectValue placeholder="Chọn chương trình" />
                      </SelectTrigger>

                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program._id} value={program.value}>
                            {program.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Câu hỏi hoặc yêu cầu tư vấn
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      placeholder="Chia sẻ về mục tiêu du học, ngành học quan tâm, hoặc bất kỳ câu hỏi nào bạn muốn được tư vấn..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang gửi...
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Gửi thông tin tư vấn
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    Bằng việc gửi thông tin, bạn đồng ý với{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline"
                    >
                      chính sách bảo mật
                    </Link>{" "}
                    của chúng tôi.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Hotline 24/7
                    </h4>
                    <p className="text-primary font-semibold">{PHONE}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tư vấn miễn phí mọi lúc
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Email
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {EMAIL}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Phản hồi trong 24h
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Văn phòng
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {ADDRESS}   
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Giờ làm việc
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Thứ 2 - Thứ 6: 8:00 - 18:00
                      <br />
                      Thứ 7: 8:00 - 12:00
                      <br />
                      Chủ nhật: Nghỉ
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
