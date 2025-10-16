import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  FileText, 
  Tag, 
  Wrench, 
  X,
  Plus
} from "lucide-react";

const metadataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  machineModel: z.string().min(1, "Machine model is required"),
  process: z.string().min(1, "Process is required"),
  tooling: z.array(z.string()),
  step: z.string().min(1, "Step description is required"),
  tags: z.array(z.string()),
  isCustomerSpecific: z.boolean(),
});

type MetadataFormData = z.infer<typeof metadataSchema>;

interface MetadataFormProps {
  onSubmit: (data: MetadataFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<MetadataFormData>;
}

const machineModels = [
  "CNC Mill - Haas VF-2",
  "CNC Lathe - Mazak QT-250",
  "Manual Mill - Bridgeport",
  "Manual Lathe - South Bend",
  "Grinder - Surface Grinder",
  "Welder - TIG Welder",
  "Press - Hydraulic Press",
  "Other"
];

const processes = [
  "Machining",
  "Assembly",
  "Inspection",
  "Setup",
  "Maintenance",
  "Troubleshooting",
  "Safety",
  "Quality Control"
];

const commonTooling = [
  "End Mill",
  "Drill Bit",
  "Tap",
  "Reamer",
  "Bore",
  "Chamfer Tool",
  "Threading Tool",
  "Measuring Tool",
  "Clamp",
  "Vise",
  "Fixture",
  "Gauge"
];

const commonTags = [
  "Safety",
  "Setup",
  "Operation",
  "Maintenance",
  "Troubleshooting",
  "Quality",
  "Inspection",
  "Calibration",
  "Cleaning",
  "Lubrication"
];

export function MetadataForm({ onSubmit, isLoading = false, initialData }: MetadataFormProps) {
  const [toolingInput, setToolingInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [toolingOpen, setToolingOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<MetadataFormData>({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      title: initialData?.title || "",
      machineModel: initialData?.machineModel || "",
      process: initialData?.process || "",
      tooling: initialData?.tooling || [],
      step: initialData?.step || "",
      tags: initialData?.tags || [],
      isCustomerSpecific: initialData?.isCustomerSpecific || false,
    }
  });

  const watchedTooling = watch("tooling");
  const watchedTags = watch("tags");

  const addTooling = (tool: string) => {
    if (tool && !watchedTooling.includes(tool)) {
      setValue("tooling", [...watchedTooling, tool]);
    }
    setToolingInput("");
    setToolingOpen(false);
  };

  const removeTooling = (tool: string) => {
    setValue("tooling", watchedTooling.filter(t => t !== tool));
  };

  const addTag = (tag: string) => {
    if (tag && !watchedTags.includes(tag)) {
      setValue("tags", [...watchedTags, tag]);
    }
    setTagsInput("");
    setTagsOpen(false);
  };

  const removeTag = (tag: string) => {
    setValue("tags", watchedTags.filter(t => t !== tag));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Video Metadata
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter a descriptive title for your video"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Machine Model */}
          <div className="space-y-2">
            <Label htmlFor="machineModel">Machine Model *</Label>
            <Select onValueChange={(value) => setValue("machineModel", value)}>
              <SelectTrigger className={errors.machineModel ? "border-red-500" : ""}>
                <SelectValue placeholder="Select machine model" />
              </SelectTrigger>
              <SelectContent>
                {machineModels.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.machineModel && (
              <p className="text-sm text-red-500">{errors.machineModel.message}</p>
            )}
          </div>

          {/* Process */}
          <div className="space-y-2">
            <Label htmlFor="process">Process *</Label>
            <Select onValueChange={(value) => setValue("process", value)}>
              <SelectTrigger className={errors.process ? "border-red-500" : ""}>
                <SelectValue placeholder="Select process type" />
              </SelectTrigger>
              <SelectContent>
                {processes.map((process) => (
                  <SelectItem key={process} value={process}>
                    {process}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.process && (
              <p className="text-sm text-red-500">{errors.process.message}</p>
            )}
          </div>

          {/* Tooling */}
          <div className="space-y-2">
            <Label>Tooling</Label>
            <div className="space-y-2">
              <Popover open={toolingOpen} onOpenChange={setToolingOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={toolingOpen}
                    className="w-full justify-between"
                  >
                    <Wrench className="h-4 w-4 mr-2" />
                    Add tooling...
                    <Plus className="h-4 w-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search tooling..."
                      value={toolingInput}
                      onValueChange={setToolingInput}
                    />
                    <CommandEmpty>No tooling found.</CommandEmpty>
                    <CommandGroup>
                      {commonTooling
                        .filter(tool => 
                          tool.toLowerCase().includes(toolingInput.toLowerCase())
                        )
                        .map((tool) => (
                          <CommandItem
                            key={tool}
                            value={tool}
                            onSelect={() => addTooling(tool)}
                          >
                            {tool}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {watchedTooling.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedTooling.map((tool) => (
                    <Badge key={tool} variant="secondary" className="flex items-center gap-1">
                      {tool}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeTooling(tool)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Step Description */}
          <div className="space-y-2">
            <Label htmlFor="step">Step Description *</Label>
            <Input
              id="step"
              {...register("step")}
              placeholder="Describe what this step accomplishes"
              className={errors.step ? "border-red-500" : ""}
            />
            {errors.step && (
              <p className="text-sm text-red-500">{errors.step.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="space-y-2">
              <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={tagsOpen}
                    className="w-full justify-between"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Add tags...
                    <Plus className="h-4 w-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search tags..."
                      value={tagsInput}
                      onValueChange={setTagsInput}
                    />
                    <CommandEmpty>No tags found.</CommandEmpty>
                    <CommandGroup>
                      {commonTags
                        .filter(tag => 
                          tag.toLowerCase().includes(tagsInput.toLowerCase())
                        )
                        .map((tag) => (
                          <CommandItem
                            key={tag}
                            value={tag}
                            onSelect={() => addTag(tag)}
                          >
                            {tag}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {watchedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedTags.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Customer Specific Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isCustomerSpecific"
              checked={watch("isCustomerSpecific")}
              onCheckedChange={(checked) => setValue("isCustomerSpecific", !!checked)}
            />
            <Label htmlFor="isCustomerSpecific" className="text-sm">
              This video is customer-specific (not for general use)
            </Label>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Continue to Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
