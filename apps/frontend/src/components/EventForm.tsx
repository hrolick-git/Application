import { useState, useEffect } from "react";
import api from "../api/api";
import { PrimaryButton } from "./PrimaryButton";
import type { Tag } from "../types/tag";
import { TagSelector } from "./tags/TagSelector";
import { FieldLabel } from "./form/FieldLabel";
import { TextField } from "./form/TextField";
import { TextAreaField } from "./form/TextAreaField";
import { SelectField } from "./form/SelectField";

interface EventFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void> | void;
  buttonText: string;
  availableTags?: Tag[];
}

export function EventForm({
  initialData,
  onSubmit,
  buttonText,
  availableTags: propTags,
}: EventFormProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tags?.map((t: Tag) => t.id) || [],
  );

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    startsAt: initialData?.startsAt
      ? new Date(initialData.startsAt).toISOString().slice(0, 16)
      : "",
    endsAt: initialData?.endsAt
      ? new Date(initialData.endsAt).toISOString().slice(0, 16)
      : "",
    capacity: initialData?.capacity || "",
    visibility: initialData?.visibility || "PUBLIC",
  });

  useEffect(() => {
    if (propTags) {
      setAvailableTags(propTags);
      return;
    }
    api
      .get("/events/tags")
      .then((res) => setAvailableTags(res.data))
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await onSubmit({ ...formData, tagIds: selectedTagIds });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
      {/* Title */}
      <div>
        <FieldLabel>Event Title</FieldLabel>
        <TextField
          required
          name="title"
          placeholder="e.g. Secret Rooftop Party"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      {/* Description */}
      <div>
        <FieldLabel>Description</FieldLabel>
        <TextAreaField
          name="description"
          placeholder="Tell us more about the vibe..."
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="resize-none"
        />
      </div>

      {/* Starts At */}
      <div>
        <FieldLabel>Starts At</FieldLabel>
        <TextField
          required
          type="datetime-local"
          name="startsAt"
          value={formData.startsAt}
          onChange={handleChange}
        />
      </div>

      {/* Ends At */}
      <div>
        <FieldLabel>Ends At (Optional)</FieldLabel>
        <TextField
          type="datetime-local"
          name="endsAt"
          value={formData.endsAt}
          onChange={handleChange}
        />
      </div>

      {/* Location */}
      <div>
        <FieldLabel>Location</FieldLabel>
        <TextField
          required
          name="location"
          placeholder="City, Street or Online Link"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Capacity */}
        <div>
          <FieldLabel>Capacity</FieldLabel>
          <TextField
            type="number"
            name="capacity"
            placeholder="No limit"
            value={formData.capacity}
            onChange={handleChange}
          />
        </div>

        {/* Visibility */}
        <div>
          <FieldLabel>Visibility</FieldLabel>
          <SelectField
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="appearance-none cursor-pointer"
          >
            <option value="PUBLIC">🌍 Public — Everyone can see</option>
            <option value="PRIVATE">🔒 Private — Only via direct access</option>
          </SelectField>
        </div>
      </div>

      {/* Tags */}
      {availableTags.length > 0 && (
        <div>
          <FieldLabel>
            Tags
            <span className="ml-2 text-xs font-medium text-slate-400 normal-case tracking-normal">
              {selectedTagIds.length}/5 selected
            </span>
          </FieldLabel>
          <TagSelector
            availableTags={availableTags}
            selectedTagIds={selectedTagIds}
            onChangeSelectedTagIds={setSelectedTagIds}
            maxSelected={5}
          />
        </div>
      )}

      <PrimaryButton
        type="submit"
        isLoading={isLoading}
        className="mt-4 rounded-[1.5rem]"
      >
        {buttonText}
      </PrimaryButton>
    </form>
  );
}
