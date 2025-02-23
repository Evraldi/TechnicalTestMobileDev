import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Linking, 
  ScrollView,
  Image
} from 'react-native';
import Animated, { 
  FadeIn,
  SlideInLeft,
  SlideInRight,
  LightSpeedInLeft,
  ZoomIn
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const ProfileScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout, isAuthenticated } = useAuth();

  const profileData = {
    name: "Evraldi Yadin",
    title: "Junior Software Developer",
    bio: "Full-stack developer with expertise in Flutter, Node.js, and IoT solutions. Passionate about building performant mobile applications, real-time systems, and data-driven solutions. Experienced in backend development, data analysis, and implementing secure systems following OWASP guidelines.",
    stats: {
      projects: "10+",
      experience: "Personal Projects",
      skills: ["Flutter", "TensorFlow Lite", "CNN", "Node.js", "Express.js", "React.js", "MySQL", "MongoDB", "Socket.IO", "Kotlin", "Image Processing", "Data Analysis", "Telegram Bot", "OWASP Security Practices", "JavaScript"]
    },
    contact: {
      email: "evraldiyadin@gmail.com",
      phone: "+62 89522534124"
    }
  };

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/Evraldi', icon: 'github', color: '#333' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/evraldi-yadin-2782102a2', icon: 'linkedin', color: '#0077b5' },
  ];

  const renderStatItem = (icon: string, title: string, value: string | number) => (
    <Animated.View 
      style={[styles.statItem, themeStyles.statItem]}
      entering={ZoomIn.delay(300)}
    >
      <MaterialIcons 
        name={icon as "work" | "schedule" | "code"}
        size={24} 
        color={themeStyles.icon.color} 
      />
      <Text style={[styles.statValue, themeStyles.statValue]}>{value}</Text>
      <Text style={[styles.statTitle, themeStyles.statTitle]}>{title}</Text>
    </Animated.View>
  );

  const themeStyles = {
    container: {
      backgroundColor: theme === 'light' ? '#f8f9fa' : '#121212',
    },
    text: {
      color: theme === 'light' ? '#2c3e50' : '#ffffff',
    },
    card: {
      backgroundColor: theme === 'light' ? '#ffffff' : '#1e1e1e',
    },
    icon: {
      color: theme === 'light' ? '#2c3e50' : '#ffffff',
    },
    statValue: {
      color: theme === 'light' ? '#1abc9c' : '#1abc9c',
    },
    statTitle: {
      color: theme === 'light' ? '#95a5a6' : '#7f8c8d',
    },
    statItem: {
      backgroundColor: theme === 'light' ? '#ffffff' : '#1e1e1e',
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, themeStyles.container]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <Animated.View entering={LightSpeedInLeft.delay(200)} style={styles.header}>
        <Image
          source={require('../../foto/hitler.jpg')}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={[styles.name, themeStyles.text]}>{profileData.name}</Text>
          <Text style={[styles.title, themeStyles.text]}>{profileData.title}</Text>
          <View style={styles.statusBadge}>
            <View style={[styles.statusIndicator, { backgroundColor: '#1abc9c' }]} />
            <Text style={styles.statusText}>Available for work</Text>
          </View>
        </View>
      </Animated.View>

      {/* Stats Section */}
      <Animated.View entering={SlideInLeft.delay(250)} style={styles.statsContainer}>
        {renderStatItem('work', 'Projects', profileData.stats.projects)}
        {renderStatItem('schedule', 'Experience', profileData.stats.experience)}
        {renderStatItem('code', 'Skills', profileData.stats.skills.length)}
      </Animated.View>

      {/* Bio Section */}
      <Animated.View entering={FadeIn.delay(400)} style={[styles.card, themeStyles.card]}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>About Me</Text>
        <Text style={[styles.bioText, themeStyles.text]}>{profileData.bio}</Text>
      </Animated.View>

      {/* Skills Section */}
      <Animated.View entering={SlideInRight.delay(450)} style={[styles.card, themeStyles.card]}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Technical Skills</Text>
        <View style={styles.skillsContainer}>
          {profileData.stats.skills.map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Contact Section */}
      <Animated.View entering={FadeIn.delay(500)} style={[styles.card, themeStyles.card]}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Contact Info</Text>
        <View style={styles.contactItem}>
          <Ionicons name="mail" size={20} color={themeStyles.icon.color} />
          <Text style={[styles.contactText, themeStyles.text]}>{profileData.contact.email}</Text>
        </View>
        <View style={styles.contactItem}>
          <Ionicons name="phone-portrait" size={20} color={themeStyles.icon.color} />
          <Text style={[styles.contactText, themeStyles.text]}>{profileData.contact.phone}</Text>
        </View>
      </Animated.View>

      {/* Social Links */}
      <Animated.View entering={ZoomIn.delay(550)} style={styles.socialContainer}>
        {socialLinks.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.socialButton, { backgroundColor: link.color }]}
            onPress={() => Linking.openURL(link.url)}
          >
            <FontAwesome5 name={link.icon} size={20} color="#fff" />
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Theme Toggle */}
      <Animated.View entering={FadeIn.delay(600)}>
        <TouchableOpacity
          style={[styles.themeButton, themeStyles.card]}
          onPress={toggleTheme}
        >
          <MaterialIcons 
            name={theme === 'light' ? 'nights-stay' : 'wb-sunny'} 
            size={24} 
            color="#1abc9c" 
          />
          <Text style={[styles.themeButtonText, { color: '#1abc9c' }]}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Logout Button */}
      {isAuthenticated && (
        <Animated.View entering={FadeIn.delay(650)}>
          <TouchableOpacity
            style={[styles.logoutButton, themeStyles.card]}
            onPress={logout}
          >
            <MaterialIcons name="exit-to-app" size={24} color="#e74c3c" />
            <Text style={[styles.logoutText, { color: '#e74c3c' }]}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: '#95a5a6',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 188, 156, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#1abc9c',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 8,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.9,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: 'rgba(26, 188, 156, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  skillText: {
    color: '#1abc9c',
    fontSize: 12,
    fontWeight: '500',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 12,
  },
  contactText: {
    fontSize: 14,
    flex: 1,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 24,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 12,
    marginVertical: 8,
  },
  themeButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.2)',
  },
  logoutText: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProfileScreen;