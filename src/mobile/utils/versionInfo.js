// @flow
import { Constants } from 'expo';

function getReleaseChannel(): string {
  const { releaseChannel } = Constants.manifest;
  if (releaseChannel === undefined) return 'development';
  return releaseChannel;
}

function getVersion(): string {
  return Constants.manifest.version;
}

export default function formattedVersionInfo(): string {
  const version = getVersion();
  const releaseChannel = getReleaseChannel();
  const versionInfo = `Version ${version}`;
  if (releaseChannel.indexOf('prod') !== -1) {
    return versionInfo;
  }
  return `${versionInfo} (${releaseChannel})`;
}
