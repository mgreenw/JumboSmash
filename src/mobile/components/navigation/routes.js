// @flow

const MATCHES_ROUTE = 'MATCHES_ROUTE';
const MESSAGE_ROUTE = 'MESSAGE_ROUTE';

const CARDS_ROUTE = 'CARDS_ROUTE';
const SMASH_CARDS_ROUTE = 'SMASH_CARDS_ROUTE';
const SOCIAL_CARDS_ROUTE = 'SOCIAL_CARDS_ROUTE';

const PROFILE_ROUTE = 'PROFILE_ROUTE';
const SETTINGS_EDIT_ROUTE = 'SETTINGS_EDIT_ROUTE';
const PROFILE_EDIT_ROUTE = 'PROFILE_EDIT_ROUTE';
const PROFILE_HELP_ROUTE = 'PROFILE_HELP_ROUTE';
const SELECT_CITY_ROUTE = 'SELECT_CITY_ROUTE';

const CARDS_STACK = 'CARDS_STACK';
const PROFILE_STACK = 'PROFILE_STACK';
const MATCHES_STACK = 'MATCHES_STACK';

export const SPLASH_ROUTE = 'SPLASH_ROUTE';
const VERIFY_ROUTE = 'VERIFY_ROUTE';
const EXPIRED_CODE_ROUTE = 'EXPIRED_CODE_ROUTE';
const NOT2019_ROUTE = 'NOT2019_ROUTE';
const AUTH_HELP_ROUTE = 'AUTH_HELP_ROUTE';

const ONBOARDING_START_ROUTE = 'ONBOARDING_START_ROUTE';
const ONBOARDING_NAME_AGE_ROUTE = 'ONBOARDING_NAME_AGE_ROUTE';
const ONBOARDING_GENDERS_ROUTE = 'ONBOARDING_GENDERS_ROUTE';
const ONBOARDING_ADD_PICTURES_ROUTE = 'ONBOARDING_ADD_PICTURES_ROUTE';
const ONBOARDING_BIO_ROUTE = 'ONBOARDING_BIO_ROUTE';
const ONBOARDING_NOTIFICATIONS_ROUTE = 'ONBOARDING_NOTIFICATIONS_ROUTE';
const ONBOARDING_FINISH_ROUTE = 'ONBOARDING_FINISH_ROUTE';
const ONBOARDING_APP_LOAD = 'ONBOARDING_APP_LOAD';
const ONBOARDING_TERMS_AND_CONDITIONS_ROUTE =
  'ONBOARDING_TERMS_AND_CONDITIONS_ROUTE';
const ONBOARDING_SETTINGS_INFO_ROUTE = 'ONBOARDING_SETTINGS_INFO_ROUTE';

const LOGIN_STACK = 'LOGIN_STACK';
const AUTH_LOADING_ROUTE = 'AUTH_LOADING_ROUTE';
const MAIN_SWITCH = 'MAIN_SWITCH';
const ONBOARDING_STACK = 'ONBOARDING_STACK';
const APP_LOADING_ROUTE = 'APP_LOADING_ROUTE';
const APP_SWITCH = 'APP_SWITCH';
const AUTH_SWITCH = 'AUTH_SWITCH';

const routes = {
  Profile: PROFILE_ROUTE,
  Matches: MATCHES_ROUTE,
  Message: MESSAGE_ROUTE,
  Cards: CARDS_ROUTE,
  SmashCards: SMASH_CARDS_ROUTE,
  SocialCards: SOCIAL_CARDS_ROUTE,
  SettingsEdit: SETTINGS_EDIT_ROUTE,
  ProfileEdit: PROFILE_EDIT_ROUTE,
  ProfileHelp: PROFILE_HELP_ROUTE,
  SelectCity: SELECT_CITY_ROUTE,
  CardsStack: CARDS_STACK,
  ProfileStack: PROFILE_STACK,
  MatchesStack: MATCHES_STACK,
  Splash: SPLASH_ROUTE,
  Verify: VERIFY_ROUTE,
  ExpiredCode: EXPIRED_CODE_ROUTE,
  Not2019: NOT2019_ROUTE,
  AuthHelp: AUTH_HELP_ROUTE,
  OnboardingStart: ONBOARDING_START_ROUTE,
  OnboardingNameAge: ONBOARDING_NAME_AGE_ROUTE,
  OnboardingGenders: ONBOARDING_GENDERS_ROUTE,
  OnboardingAddPictures: ONBOARDING_ADD_PICTURES_ROUTE,
  OnboardingBio: ONBOARDING_BIO_ROUTE,
  OnboardingNotifications: ONBOARDING_NOTIFICATIONS_ROUTE,
  OnboardingFinish: ONBOARDING_FINISH_ROUTE,
  OnboardingAppLoad: ONBOARDING_APP_LOAD,
  OnboardingTermsAndConditions: ONBOARDING_TERMS_AND_CONDITIONS_ROUTE,
  OnboardingSettingsInfo: ONBOARDING_SETTINGS_INFO_ROUTE,
  LoginStack: LOGIN_STACK,
  AuthLoading: AUTH_LOADING_ROUTE,
  MainSwitch: MAIN_SWITCH,
  OnboardingStack: ONBOARDING_STACK,
  AppLoading: APP_LOADING_ROUTE,
  AppSwitch: APP_SWITCH,
  AuthSwitch: AUTH_SWITCH
};

export default routes;
