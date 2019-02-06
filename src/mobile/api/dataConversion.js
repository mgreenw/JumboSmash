// @flow
/* eslint-disable */

import type { UserSettings, Genders } from 'mobile/reducers';

type Pronouns = {
  she: boolean,
  they: boolean,
  he: boolean,
};

type ServerSettings = {
  usePronouns: Pronouns,
  wantPronouns: Pronouns,
};

function pronounsToGenders(pronouns: Pronouns): Genders {
  return {
    female: pronouns.she,
    nonBinary: pronouns.they,
    male: pronouns.he,
  };
}

function gendersToPronouns(genders: Genders): Pronouns {
  return {
    she: genders.female,
    they: genders.nonBinary,
    he: genders.male,
  };
}

function serverSettingsToMobileSettings(settings: ServerSettings): UserSettings {
  return {
    useGenders: pronounsToGenders(settings.usePronouns),
    wantGenders: pronounsToGenders(settings.wantPronouns),
  };
}

function mobileSettingsToServerSettings(settings: UserSettings): ServerSettings {
  return {
    usePronouns: gendersToPronouns(settings.useGenders),
    wantPronouns: gendersToPronouns(settings.wantGenders),
  };
}

export { serverSettingsToMobileSettings, mobileSettingsToServerSettings };
