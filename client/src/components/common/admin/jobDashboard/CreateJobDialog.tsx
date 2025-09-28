import { Image as ImageIcon, Save } from "lucide-react";
import { useState, useRef, ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

export const JobStatus = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

interface CreateJobDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (
    field: keyof IJob,
    value: string | number | boolean | File | null
  ) => void;
  onJobCreated: () => void;
  data: IJob | null;
  isLoading: boolean;
}

const CreateJobDialog = ({
  isOpen,
  onOpenChange,
  onChange,
  onJobCreated,
  data,
  isLoading,
}: CreateJobDialogProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      onChange("image", file);

      // Tạo URL để xem trước hình ảnh
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>Create</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-title">Title</Label>

                <Input
                  id="create-title"
                  value={data?.title}
                  onChange={(e) => onChange("title", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-country">Country</Label>

                <Input
                  id="create-country"
                  value={data?.country}
                  onChange={(e) => onChange("country", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-image">Image</Label>

                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    id="create-image"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleButtonClick}
                    className="flex items-center gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Upload Image
                  </Button>

                  {previewImage && (
                    <div className="relative mt-2 h-40 w-full overflow-hidden rounded-md border">
                      <Image
                        src={previewImage}
                        alt="Preview"
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-positions">Positions</Label>

                <Input
                  id="create-positions"
                  value={data?.positions}
                  onChange={(e) => onChange("positions", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-location">Location</Label>

                <Input
                  id="create-location"
                  value={data?.location}
                  onChange={(e) => onChange("location", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-salary">Salary</Label>

                <Input
                  id="create-salary"
                  value={data?.salary}
                  onChange={(e) => onChange("salary", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-application-deadline">
                  Application Deadline
                </Label>

                <Input
                  id="create-application-deadline"
                  value={data?.applicationDeadline}
                  onChange={(e) =>
                    onChange("applicationDeadline", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-estimated-departure">
                  Estimated Departure
                </Label>

                <Input
                  id="create-estimated-departure"
                  value={data?.estimatedDeparture}
                  onChange={(e) =>
                    onChange("estimatedDeparture", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-requirements">
                  Requirements (comma-separated)
                </Label>

                <Input
                  id="create-requirements"
                  value={data?.requirements}
                  onChange={(e) =>
                    onChange("requirements", e.target.value)
                  }
                />
              </div>
            </div>
           
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-benefits">
                  Benefits (comma-separated)
                </Label>

                <Input
                  id="create-benefits"
                  value={data?.benefits}
                  onChange={(e) =>
                    onChange("benefits", e.target.value)
                  }
                />
              </div>
            </div>
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-description">
                  Description
                </Label>

                <Textarea
                  id="create-description"
                  value={data?.description}
                  onChange={(e) =>
                    onChange("description", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-company">company</Label>

                <Input
                  id="create-company"
                  value={data?.company}
                  onChange={(e) => onChange("company", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-workType">workType</Label>

                <Input
                  id="create-workType"
                  value={data?.workType}
                  onChange={(e) => onChange("workType", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-featured">featured</Label>

                <Select
                  value={data?.featured ? "true" : "false"}
                  onValueChange={(value) =>
                    onChange("featured", value === "true")
                  }
                >
                  <SelectTrigger id="create-featured">
                    <SelectValue placeholder="Select featured status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-workingHours">workingHours</Label>

                <Input
                  id="create-workingHours"
                  value={data?.workingHours}
                  onChange={(e) => onChange("workingHours", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-overtime">overtime</Label>

                <Input
                  id="create-overtime"
                  value={data?.overtime}
                  onChange={(e) => onChange("overtime", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-accommodation">accommodation</Label>

                <Input
                  id="create-accommodation"
                  value={data?.accommodation}
                  onChange={(e) => onChange("accommodation", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-work-environment">
                  Work Environment
                </Label>

                <Input
                  id="create-work-environment"
                  value={data?.workEnvironment}
                  onChange={(e) => onChange("workEnvironment", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-training-period">Training Period</Label>

                <Input
                  id="create-training-period"
                  value={data?.trainingPeriod}
                  onChange={(e) => onChange("trainingPeriod", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2 mt-3">
              <Label htmlFor="create-country">Status</Label>

              <Select
                value={data?.status ? data.status : JobStatus[0].value}
                onValueChange={(value) => onChange("status", value)}
              >
                <SelectTrigger id="create-status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>

                <SelectContent>
                  {JobStatus.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
            className="bg-gray-200 border-gray-300 text-gray-700 hover:bg-red-200 hover:text-red-600 hover:border-red-200 dark:bg-transparent dark:border-gray-700 dark:text-white dark:hover:bg-red-900 dark:hover:text-white"
          >
            Cancel
          </Button>

          <Button onClick={onJobCreated} disabled={isLoading}>
            {isLoading ? (
              <>Creating...</>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobDialog;
