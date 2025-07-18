import UserProfileForm from "../components/UserProfileForm";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/UserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProfile() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { profileData } = useAppContext();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/sign-in");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {profileData ? "Edit Your Profile" : "Create Your Profile"}
        </h1>
        <p className="text-gray-400">
          {profileData
            ? "Update your information below."
            : "Tell us more about you."}
        </p>
      </div>
      <UserProfileForm />
    </div>
  );
}
