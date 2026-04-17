import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { updateProfile } from "../lib/api";
import toast from "react-hot-toast";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  SaveIcon,
  ShuffleIcon,
  UploadIcon,
  UserIcon,
  MailIcon,
  CalendarIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";
import { capitialize } from "../lib/utils";
import ThemeSelector from "../components/ThemeSelector";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setPreviewUrl(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation(formState);
  };

  const handleRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(2, 10);
    const randomAvatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
    setFormState({ ...formState, profilePic: randomAvatar });
    setPreviewUrl(null);
    toast.success("Random avatar generated!");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image must be less than 4MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setFormState({ ...formState, profilePic: base64 });
      setPreviewUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const memberSince = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const displayPic = previewUrl || formState.profilePic;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            <UserIcon className="size-8 text-primary" />
            Profile Settings
          </h1>
          <p className="text-base-content/60 mt-1">Customize your profile and preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* PROFILE PICTURE SECTION */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">Profile Picture</h2>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar Preview */}
                <div className="relative group">
                  <div className="size-32 rounded-full bg-base-300 overflow-hidden ring-4 ring-primary/20">
                    {displayPic ? (
                      <img
                        src={displayPic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <CameraIcon className="size-12 text-base-content/40" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Avatar Actions */}
                <div className="flex flex-col gap-3">
                  {/* Upload Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadIcon className="size-4" />
                    Upload Photo
                  </button>

                  {/* Random Avatar */}
                  <button
                    type="button"
                    className="btn btn-accent btn-sm gap-2"
                    onClick={handleRandomAvatar}
                  >
                    <ShuffleIcon className="size-4" />
                    Random Avatar
                  </button>

                  <p className="text-xs text-base-content/50">
                    JPG, PNG or GIF. Max 4MB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PERSONAL INFO */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">Personal Information</h2>

              <div className="space-y-4">
                {/* Full Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={formState.fullName}
                    onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                    className="input input-bordered w-full"
                    placeholder="Your full name"
                  />
                </div>

                {/* Bio */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Bio</span>
                  </label>
                  <textarea
                    value={formState.bio}
                    onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                    className="textarea textarea-bordered h-24"
                    placeholder="Tell others about yourself and your language learning goals"
                  />
                </div>

                {/* Location */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Location</span>
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute top-1/2 -translate-y-1/2 left-3 size-5 text-base-content/50" />
                    <input
                      type="text"
                      value={formState.location}
                      onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                      className="input input-bordered w-full pl-10"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LANGUAGES */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">Languages</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Native Language */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Native Language</span>
                  </label>
                  <select
                    value={formState.nativeLanguage}
                    onChange={(e) =>
                      setFormState({ ...formState, nativeLanguage: e.target.value })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Learning Language */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Learning Language</span>
                  </label>
                  <select
                    value={formState.learningLanguage}
                    onChange={(e) =>
                      setFormState({ ...formState, learningLanguage: e.target.value })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select language you're learning</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ACCOUNT INFO (read-only) */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">Account Information</h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-base-300/50">
                  <MailIcon className="size-5 text-base-content/50" />
                  <div>
                    <p className="text-xs text-base-content/50">Email</p>
                    <p className="font-medium">{authUser?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-base-300/50">
                  <CalendarIcon className="size-5 text-base-content/50" />
                  <div>
                    <p className="text-xs text-base-content/50">Member Since</p>
                    <p className="font-medium">{memberSince}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* APPEARANCE */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title text-lg mb-4">Appearance</h2>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-base-content/60">Choose your preferred color theme</p>
                </div>
                <ThemeSelector />
              </div>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end sticky bottom-4">
            <button
              type="submit"
              className="btn btn-primary btn-lg gap-2 shadow-lg"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <LoaderIcon className="size-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon className="size-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
