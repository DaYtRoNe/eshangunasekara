import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30, // Document margin
  },
  header: {
    backgroundColor: '#1a1b26',
    color: '#ffffff',
    padding: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  titleLine: {
    fontSize: 10,
    color: '#93c5fd', // Light blue subtle accent
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 9,
  },
  contactItem: {
    color: '#e2e8f0',
    textDecoration: 'none',
  },
  mainBody: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#f1f5f9',
    padding: 15,
    borderRight: '1pt solid #e2e8f0',
  },
  content: {
    width: '70%',
    padding: 15,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4338ca', // Subtle blue accent
    textTransform: 'uppercase',
    marginBottom: 8,
    borderBottom: '1pt solid #cbd5e1',
    paddingBottom: 2,
    marginTop: 10,
  },
  // Sidebar Styles
  skillCategory: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
    color: '#1e293b',
  },
  skillItem: {
    fontSize: 9,
    color: '#334155',
    marginBottom: 2,
    flexDirection: 'row',
  },
  bulletPoint: {
    width: 10,
    fontSize: 9,
  },
  // Content Styles
  profileText: {
    fontSize: 9.5,
    color: '#334155',
    lineHeight: 1.5,
    marginBottom: 10,
  },
  itemBlock: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  itemDate: {
    fontSize: 9,
    color: '#64748b',
    fontStyle: 'italic',
  },
  itemSubtitle: {
    fontSize: 9.5,
    color: '#475569',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  descriptionBullet: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 5,
  },
  descriptionText: {
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.4,
    flex: 1,
  },
  techStackRow: {
    fontSize: 8.5,
    color: '#64748b',
    fontStyle: 'italic',
    marginBottom: 4,
  }
});

const CVTemplate = ({ data }) => {
  const { settings = {}, experience = [], education = [], skills = [], projects = [] } = data || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{settings.name || 'Eshan Gunasekara'}</Text>
          <Text style={styles.titleLine}>Software Engineering Undergraduate • Full-Stack Developer • AI Enthusiast</Text>
          
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>■ Matale, Sri Lanka</Text>
            <Text style={styles.contactItem}>■ +94 77 815 7227</Text>
            <Link src="mailto:eshangunsekara@gmail.com" style={styles.contactItem}>■ eshangunsekara@gmail.com</Link>
          </View>
          <View style={[styles.contactRow, { marginTop: 5 }]}>
            <Link src={settings.linkedinUrl || '#'} style={styles.contactItem}>■ LinkedIn</Link>
            <Link src={settings.githubUrl || '#'} style={styles.contactItem}>■ GitHub</Link>
            <Link src={settings.websiteUrl || "https://eshangunasekara.vercel.app"} style={styles.contactItem}>■ Portfolio</Link>
          </View>
        </View>

        {/* Body Section */}
        <View style={styles.mainBody}>
          
          {/* Left Sidebar */}
          <View style={styles.sidebar}>
            <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Technical Skills</Text>
            
            {Array.isArray(skills) && skills.map((skillGroup, idx) => (
              <View key={idx} wrap={false}>
                <Text style={styles.skillCategory}>{skillGroup.title || skillGroup.category || 'Category'}</Text>
                {Array.isArray(skillGroup.items) && skillGroup.items.map((item, i) => (
                  <View style={styles.skillItem} key={i}>
                    <Text style={styles.bulletPoint}>■</Text>
                    <Text>{item || ''}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Right Content */}
          <View style={styles.content}>
            
            {/* Profile */}
            <View wrap={false}>
              <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Profile</Text>
              <Text style={styles.profileText}>
                {settings.cvProfile || settings.aboutMe || "A passionate Software Engineering undergraduate specialising in full-stack development with a strong interest in AI and emerging technologies."}
              </Text>
            </View>

            {/* Experience */}
            {Array.isArray(experience) && experience.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Work Experience</Text>
                {experience.map((exp, idx) => {
                  // Determine which description to use
                  let descArray = [];
                  if (typeof exp.cvDescription === 'string' && exp.cvDescription.trim() !== '') {
                    descArray = exp.cvDescription.split('\n').map(d => d.trim()).filter(Boolean);
                  } else if (Array.isArray(exp.description)) {
                    descArray = exp.description;
                  }
                  
                  return (
                    <View style={styles.itemBlock} key={idx} wrap={false}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{exp.role || 'Role'}</Text>
                        <Text style={styles.itemDate}>{exp.period || ''}</Text>
                      </View>
                      <Text style={styles.itemSubtitle}>{exp.company || 'Company'}</Text>
                      
                      {descArray.map((desc, i) => (
                        <View style={styles.descriptionBullet} key={i}>
                          <Text style={styles.bulletPoint}>•</Text>
                          <Text style={styles.descriptionText}>{desc || ''}</Text>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>
            )}

            {/* Education */}
            {Array.isArray(education) && education.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Education</Text>
                {education.map((edu, idx) => (
                  <View style={styles.itemBlock} key={idx} wrap={false}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{edu.degree || 'Degree'}</Text>
                      <Text style={styles.itemDate}>{edu.period || ''}</Text>
                    </View>
                    <Text style={styles.itemSubtitle}>{edu.institution || 'Institution'}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {Array.isArray(projects) && projects.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Projects</Text>
                {projects.map((project, idx) => {
                  // Determine which description to use
                  let descText = project.cvDescription && project.cvDescription.trim() !== '' ? project.cvDescription : project.description;
                  let descArray = typeof descText === 'string' ? descText.split('\n').map(d => d.trim()).filter(Boolean) : [];

                  return (
                    <View style={styles.itemBlock} key={idx} wrap={false}>
                      <Text style={styles.itemTitle}>{project.title || 'Project'}</Text>
                      {Array.isArray(project.tech) && project.tech.length > 0 && (
                        <Text style={styles.techStackRow}>{project.tech.join(' • ')}</Text>
                      )}
                      
                      {descArray.map((desc, i) => (
                        <View style={styles.descriptionBullet} key={i}>
                          <Text style={styles.bulletPoint}>•</Text>
                          <Text style={styles.descriptionText}>{desc}</Text>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>
            )}

          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CVTemplate;
