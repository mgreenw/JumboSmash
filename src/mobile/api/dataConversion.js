// @flow
import type { UserSettings, Genders } from "mobile/reducers";

type ServerSettings = {
  usePronouns: Genders,
  wantPronouns: Genders
};

function serverSettingsToMobileSettings(
  settings: ServerSettings
): UserSettings {
  return {
    useGenders: settings.usePronouns,
    wantGenders: settings.wantPronouns
  };
}

function mobileSettingsToServerSettings(
  settings: UserSettings
): ServerSettings {
  return {
    usePronouns: settings.useGenders,
    wantPronouns: settings.wantGenders
  };
}

export { serverSettingsToMobileSettings, mobileSettingsToServerSettings };
