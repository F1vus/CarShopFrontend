import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "styles/profilePage/_profile-settings.scss";
import profileService from "services/profile.service";

function ProfileSettings() {
  const { profile, setProfile } = useOutletContext() || {};
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    profileImage: null,
    profileImagePreview: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // Populate form with profile data on load
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        profileImage: profile.profileImage || null,
        profileImagePreview: profile.profileImage || null,
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          profileImage: file,
          profileImagePreview: event.target?.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      // Prepare FormData for multipart/form-data (if image is being uploaded)
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("email", formData.email);
      dataToSend.append("phoneNumber", formData.phoneNumber);
      if (formData.profileImage && formData.profileImage instanceof File) {
        dataToSend.append("profileImage", formData.profileImage);
      }

      // Call API to update profile
      const updatedProfile = await profileService.updateProfile(
        token,
        dataToSend
      );

      // Update context
      setProfile(updatedProfile);
      setIsEditing(false);
      setMessage("Profil zaktualizowany pomyślnie!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setMessage("Błąd podczas zapisywania profilu. Spróbuj ponownie.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original profile data
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        profileImage: profile.profileImage || null,
        profileImagePreview: profile.profileImage || null,
      });
    }
    setIsEditing(false);
    setMessage("");
  };

  return (
    <div className="profile-settings">
      <h2 className="profile-settings__title">Zmień swoje dane kontaktowe</h2>

      <form className="profile-settings__form" onSubmit={handleSave}>
        {/* Profile Image Section */}
        <div className="profile-settings__image-section">
          <div className="profile-settings__image-container">
            {formData.profileImagePreview ? (
              <img
                src={formData.profileImagePreview}
                alt="Profile"
                className="profile-settings__image"
              />
            ) : (
              <div className="profile-settings__image-placeholder">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="32" cy="20" r="12" fill="currentColor" />
                  <path
                    d="M8 56C8 45.507 18.059 37 32 37C45.941 37 56 45.507 56 56"
                    fill="currentColor"
                  />
                </svg>
              </div>
            )}
          </div>

          {isEditing && (
            <label className="profile-settings__image-upload">
              Zmień zdjęcie
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="profile-settings__file-input"
              />
            </label>
          )}
        </div>

        {/* Form Fields */}
        <div className="profile-settings__fields">
          <div className="profile-settings__field">
            <label className="profile-settings__label">Imię i nazwisko</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="profile-settings__input"
              placeholder="Wpisz imię i nazwisko"
            />
          </div>

          <div className="profile-settings__field">
            <label className="profile-settings__label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="profile-settings__input"
              placeholder="Wpisz email"
            />
          </div>

          <div className="profile-settings__field">
            <label className="profile-settings__label">Numer telefonu</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="profile-settings__input"
              placeholder="Wpisz numer telefonu"
            />
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`profile-settings__message ${
              message.includes("pomyślnie") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="profile-settings__actions">
          {!isEditing ? (
            <button
              type="button"
              className="profile-settings__btn profile-settings__btn--primary"
              onClick={() => setIsEditing(true)}
            >
              Edytuj profil
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="profile-settings__btn profile-settings__btn--primary"
                disabled={isSaving}
              >
                {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
              <button
                type="button"
                className="profile-settings__btn profile-settings__btn--secondary"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Anuluj
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProfileSettings;
