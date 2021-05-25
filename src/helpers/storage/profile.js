const profileKey = "profile";

export const setProfile = (profileId, profileData) => {
  sessionStorage.setItem(`${profileKey}-${profileId}`, JSON.stringify(profileData));
};

export const getProfile = (profileId) => {
  return JSON.parse(sessionStorage.getItem(`${profileKey}-${profileId}`));
};

export const deleteProfile = (profileId) => {
  sessionStorage.removeItem(`${profileKey}-${profileId}`);
};
