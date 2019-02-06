// @flow

import React from 'react';
import { Text } from 'react-native';
import { textStyles } from 'mobile/styles/textStyles';

// This is just some lazy psudo hyper text styling to make things easily formatted.
/*eslint-disable */
const H = props => <Text style={textStyles.body1Style}>{`${props.children}\n\n`}</Text>;
const P = props => <Text style={textStyles.body2Style}>{`${props.children}\n\n`}</Text>;
/* eslint-enable */

export default () => (
  <Text style={{ textAlign: 'justify' }}>
    <H>Terms and Conditions v.1.0</H>
    <P>Welcome to JumboSmash (“us”, “we”, “the App”, “the Service”, “the Team”).</P>
    <H>Acceptance of Terms of Use Agreement</H>
    <P>
      By accessing and using JumboSmash, you accept and agree to be bound by the Terms and
      Conditions, Privacy Policy, and Safety Tips (collectively, “the Agreement”). In addition, when
      using the Service, you shall be subject to any posted guidelines or rules applicable to
      JumboSmash. Any participation in JumboSmash will constitute acceptance of this agreement. If
      you do not agree to abide by the Agreement, do not use this service.
    </P>
    <P>
      We may update this Agreement and the Service periodically, for a variety of reasons including
      to reflect changes in or requirements of the law, or to update new features. The most recent
      version of this Agreement will be posted on the Service under Settings and also on
      jumbosmash.com. The most recent version is the version that applies. If the changes include
      material changes that affect your rights or obligations, we’ll let you know through the App or
      the email associated with your account. If you continue to use the Service after the changes
      become effective, then you agree to the revised Agreement. You agree that this Agreement shall
      supersede any prior agreements, and shall govern your entire relationship with JumboSmash.
    </P>
    <H>Eligibility</H>
    <P>
      {`You must be at least 18 years of age to create a profile on JumboSmash and use the Service. By creating an account and using the Service, you represent and warrant that: \n
• You are enrolled at an approved University in your final year,\n
• You can form a binding contract with JumboSmash,\n
• You will comply with this Agreement and all applicable local, state, national and international laws, rules and regulations, and \n
• You have never been convicted of or pled no contest to a sex crime, or any crime involving violence, and that you are not required to register as a sex offender with any state, federal or local sex offender registry.
`}
    </P>
    <H>Safety, Your Interactions With Other Users</H>
    <P>
      Though JumboSmash strives to encourage a respectful user experience, the Team is not
      responsible for the conduct of any user on or off of the Service. You agree to use caution in
      all interactions with other users, particularly if you decide to communicate off the Service
      or meet in person. In addition, you agree to review and follow JumboSmash’s Safety Tips prior
      to using the Service. You agree that you will not provide your financial information (for
      example, your credit card or bank account information), or wire or otherwise send money, to
      other users.
    </P>
    <P>
      YOU ARE SOLELY RESPONSIBLE FOR YOUR INTERACTIONS WITH OTHER USERS. YOU UNDERSTAND THAT
      JUMBOSMASH DOES NOT CONDUCT CRIMINAL BACKGROUND CHECKS ON ITS USERS OR OTHERWISE INQUIRE INTO
      THE BACKGROUND OF ITS USERS. JUMBOSMASH MAKES NO REPRESENTATIONS OR WARRANTIES AS TO THE
      CONDUCT OF USERS. JUMBOSMASH RESERVES THE RIGHT TO CONDUCT – AND YOU AGREE THAT JUMBOSMASH MAY
      CONDUCT - ANY CRIMINAL BACKGROUND CHECK OR OTHER SCREENINGS (SUCH AS SEX OFFENDER REGISTER
      SEARCHES) AT ANY TIME USING AVAILABLE PUBLIC RECORDS.
    </P>
    <H>Rights JumboSmash Grants You</H>
    <P>
      {`JumboSmash grants you a personal, worldwide, royalty-free, non-assignable, revocable, and non-sublicensable license to access and use the Service. This license is for the sole purpose of letting you use and enjoy the Service’s benefits as intended by JumboSmash and permitted by this Agreement. Therefore, you agree not to:
\n• Use the Service or any content contained in the Service for any commercial purposes without our written consent.
\n• Copy, modify, transmit, create any derivative works from, make use of, or reproduce in any way any copyrighted material, images, trade names, service marks, or other intellectual property, content or proprietary information accessible through the Service without JumboSmash’s prior written consent.
\n• Express or imply that any statements you make are endorsed by JumboSmash.
\n• Use any robot, bot, spider, crawler, scraper, site search/retrieval application, proxy or other manual or automatic device, method or process to access, retrieve, index, “data mine,” or in any way reproduce or circumvent the navigational structure or presentation of the Service or its contents.
\n• Use the Service in any way that could interfere with, disrupt or negatively affect the Service or the servers or networks connected to the Service.
\n• Upload viruses or other malicious code or otherwise compromise the security of the Service.
\n• Forge headers or otherwise manipulate identifiers in order to disguise the origin of any information transmitted to or through the Service.
\n• “Frame” or “mirror” any part of the Service without JumboSmash’s prior written authorization.
\n• Use meta tags or code or other devices containing any reference to JumboSmash or the Service (or any logo or slogan of JumboSmash) to direct any person to any other website for any purpose.
\n• Modify, adapt, sublicense, translate, sell, reverse engineer, decipher, decompile or otherwise disassemble any portion of the Service, or cause others to do so.
\n• Use or develop any third-party applications that interact with the Service or other users’ Content or information without our written consent.
\n• Use, access, or publish the JumboSmash application programming interface without our written consent.
\n• Probe, scan or test the vulnerability of our Service or any system or network.
\n• Encourage or promote any activity that violates this Agreement.
\nThe Team may investigate and take any available legal action in response to illegal and/ or unauthorized uses of the Service, including termination of your account.
\nAny software that we provide you may automatically download and install upgrades, updates, or other new features.
`}
    </P>
    <H>Rights You Grant To JumboSmash</H>
    <P>
      By creating an account, you grant to JumboSmash a worldwide, transferable, sub-licensable,
      royalty-free, right and license to host, store, use, copy, and display information you upload
      to the Service.
    </P>
    <P>
      You agree that all information that you submit upon creation of your account, or any other
      time, collectively, “Content”, is accurate and truthful and you have the right to post this
      information on the Service.
    </P>
    <P>
      You understand and agree that we may monitor or review any Content you post as part of a
      Service. We may delete any Content, in whole or in part, that in our sole judgment violates
      this Agreement or may harm the reputation of the Service or the experience of other users.
      However, such Content is the sole responsibility of the user who posts it, and JumboSmash
      cannot guarantee that all Content will comply with this Agreement.
    </P>
    <P>
      When communicating with the Team, you agree to be respectful and kind. If we feel that your
      behavior towards anyone on our Team is at any time threatening or offensive, we reserve the
      right to immediately terminate your account.
    </P>
    <P>
      You agree that JumboSmash may access, preserve and disclose your account information and
      Content if required to do so by law or if we think it to be otherwise necessary, such as to:
      (i) comply with legal process; (ii) enforce this Agreement; (iii) respond to claims that any
      Content violates the rights of third parties; (iv) respond to your requests for customer
      service; or (v) protect the rights, property or personal safety of the Team or any other
      person.
    </P>
    <H>Community Rules</H>
    <P>
      {`By using the Service, you agree that you will not:
\n• Use the Service for any purpose that is illegal, harmful or nefarious, or prohibited by this Agreement.
\n• Use the Service to damage JumboSmash or individuals on the Team.
\n• Spam, solicit money from, or defraud users.
\n• Impersonate any person or entity, or post images of another person without their permission.
\n• Bully, stalk, intimidate, assault, harass, or mistreat any person.
\n• Post any content that violates or infringes anyone’s rights.
\n• Post any content that is hate speech or threatening, incites violence, or contains graphic or gratuitous violence.
\n• Post any content that promotes racism, sexism, homophobia, transphobia, bigotry, or hatred or physical harm of any kind of any group or individual.
\n• Solicit passwords for any purpose, or personal identifying information for commercial or unlawful purposes from other users.
\n• Use another user’s account.
\n• Create another account if your account has been terminated.`}
    </P>

    <H>Privacy Policy</H>
    <P>
      {`What Personal Information We Collect
\n• When you create a JumboSmash account, you provide us with your approved university email address.
\n• When you complete your profile, you provide us with your photos, gender identity, and your gender preferences. By sharing this data with us, you consent to our processing of that data.
\n• When you contact the Team, we collect the information you give us during the interaction.
\n• We reserve the right to review your messages and other Content if we have reason to believe you or the person you’re interacting with have violated the Agreement.
\n• Other users may provide information about you as they use our services. For instance, we may collect information about you from other users if they contact us about you.
\nHow To Review and Change Your Personal Information
\n• You can always change your display name, photos, gender identity, and sexual orientation from the Settings page.
\n• To delete your account, please email support@jumbosmash.com.
\nHow We Use Personal Information
\n• We display your name and photos on your profile which is shown to other users so they can interact with you.
\n• We use your email to verify that you are a senior in college at an approved school.
\n• We use your gender identity and sexuality to display appropriate profiles within the app. We never reveal your gender identity or sexuality to other users unless you choose to do so.
\nHow We Protect Personal Information
\n• We store one-time login codes instead of any personal passwords so that a data breach of JumboSmash would not have any impact on a user's accounts on other services.
\nMessages
\n• We will not read your messages unless we have reason to believe you are violating the Agreement.`}
    </P>
    <H>Disclaimers</H>
    <P>
      JUMBOSMASH PROVIDES THE SERVICE ON AN “AS IS” AND “AS AVAILABLE” BASIS AND TO THE EXTENT
      PERMITTED BY APPLICABLE LAW, GRANTS NO WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED,
      STATUTORY OR OTHERWISE WITH RESPECT TO THE SERVICE (INCLUDING ALL CONTENT CONTAINED THEREIN),
      INCLUDING, WITHOUT LIMITATION, ANY IMPLIED WARRANTIES OF SATISFACTORY QUALITY OR FITNESS FOR A
      PARTICULAR PURPOSE OR NON-INFRINGEMENT. JUMBOSMASH DOES NOT REPRESENT OR WARRANT THAT (A) THE
      SERVICE WILL BE UNINTERRUPTED, SECURE OR ERROR FREE, (B) ANY DEFECTS OR ERRORS IN THE SERVICE
      WILL BE CORRECTED, OR (C) THAT ANY CONTENT OR INFORMATION YOU OBTAIN ON OR THROUGH THE SERVICE
      WILL BE ACCURATE. JUMBOSMASH TAKES NO RESPONSIBILITY FOR ANY CONTENT THAT YOU OR ANOTHER USER
      OR THIRD PARTY POSTS, SENDS OR RECEIVES THROUGH THE SERVICE. ANY MATERIAL DOWNLOADED OR
      OTHERWISE OBTAINED THROUGH THE USE OF THE SERVICE IS ACCESSED AT YOUR OWN DISCRETION AND RISK.
      JUMBOSMASH DISCLAIMS AND TAKES NO RESPONSIBILITY FOR ANY CONDUCT OF YOU OR ANY OTHER USER, ON
      OR OFF THE SERVICE.
    </P>
    <H>Accuracy Warning</H>
    <P>
      JumboSmash is offered for informational purposes only; the Service shall not be responsible or
      liable for the accuracy, usefulness or availability of any information transmitted or made
      available via the site, and shall not be responsible or liable for any error or omissions in
      that information. Additionally, while the Team hopes that you use JumboSmash to connect with
      your classmates in your final semester of college (whatever “connect” may mean to you), we are
      not responsible for any failure to do so.
    </P>
    <H>Disaffiliation Statement</H>
    <P>
      JumboSmash is not affiliated, associated, authorized, endorsed by, or in any way officially
      connected with any approved university, or any of its subsidiaries or its affiliates.
    </P>
    <H>Intellectual Property</H>
    <P>
      The App and its original content, features, and functionality are owned by the Team and are
      protected by international laws.
    </P>
    <H>Limitation of Liability</H>
    <P>
      TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL JUMBOSMASH, ITS
      AFFILIATES, OR SERVICE PROVIDERS BE LIABLE FOR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY,
      INCIDENTAL, SPECIAL, PUNITIVE, OR ENHANCED DAMAGES, INCLUDING, WITHOUT LIMITATION, LOSS OF
      PROFITS, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER
      INTANGIBLE LOSSES, RESULTING FROM: (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE
      THE SERVICE; (II) THE CONDUCT OR CONTENT OF OTHER USERS OR THIRD PARTIES ON, THROUGH OR
      FOLLOWING USE OF THE SERVICE; OR (III) UNAUTHORIZED ACCESS, USE OR ALTERATION OF YOUR CONTENT,
      EVEN IF JUMBOSMASH HAS BEEN ADVISED AT ANY TIME OF THE POSSIBILITY OF SUCH DAMAGES. THE
      LIMITATION OF LIABILITY PROVISIONS SET FORTH IN THIS SECTION SHALL APPLY EVEN IF YOUR REMEDIES
      UNDER THIS AGREEMENT FAIL WITH RESPECT TO THEIR ESSENTIAL PURPOSE.
    </P>
    <H>Termination Clause</H>
    <P>
      We may terminate your access to the App, without cause or notice, which may result in the
      forfeiture and destruction of all information associated with your account. All provisions of
      this Agreement that, by their nature, should survive termination shall survive termination,
      including, without limitation, ownership provisions, warranty disclaimers, indemnity, and
      limitations of liability.
    </P>
    <H>Entire Agreement</H>
    <P>
      This Agreement, along with the Privacy Policy, the Safety Tips, and any terms disclosed to
      you, contains the entire agreement between you and JumboSmash regarding your relationship with
      JumboSmash and the use of the Service. If any provision of this Agreement is held invalid, the
      remainder of this Agreement shall continue in full force and effect. The failure of JumboSmash
      to exercise or enforce any right or provision of this Agreement shall not constitute a waiver
      of such right or provision. You agree that your JumboSmash account is non-transferable and all
      of your rights to your account and its Content terminate upon your death.
    </P>
  </Text>
);
