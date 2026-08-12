import { AboutSection } from "@/src/components/profile/about-section";
import { CertificationsSection } from "@/src/components/profile/certifications-section";
import { ContactSection } from "@/src/components/profile/contact-section";
import { EducationSection } from "@/src/components/profile/education-section";
import { ExperienceSection } from "@/src/components/profile/experience-section";
import { FeaturedSection } from "@/src/components/profile/featured-section";
import { LanguagesSection } from "@/src/components/profile/languages-section";
import { ProfileFooter } from "@/src/components/profile/profile-footer";
import { ProfileHeader } from "@/src/components/profile/profile-header";
import { SiteNavigation } from "@/src/components/profile/site-navigation";
import { SkillsSection } from "@/src/components/profile/skills-section";
import { certifications, education, experiences, featuredItems, languages, profile, skills } from "@/src/data/profile";

export default function Home() {
  return (
    <main>
      <SiteNavigation />
      <ProfileHeader profile={profile} />
      <AboutSection summary={profile.summary} />
      <FeaturedSection items={featuredItems} />
      <ExperienceSection experiences={experiences} />
      <SkillsSection skills={skills} />
      <LanguagesSection languages={languages} />
      <CertificationsSection certifications={certifications} />
      <EducationSection education={education} />
      <ContactSection profile={profile} />
      <ProfileFooter name={profile.name} />
    </main>
  );
}
