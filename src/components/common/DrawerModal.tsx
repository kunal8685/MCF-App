import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useLanguage, Language } from '@/context/LanguageContext';
import { Colors, Radius, Shadow } from '@/constants/theme';

interface DrawerModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DrawerModal: React.FC<DrawerModalProps> = ({ visible, onClose }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [tempLang, setTempLang] = useState<Language>(language);

  const handleNavigate = (path: string) => {
    onClose();
    setTimeout(() => {
      router.push(path as any);
    }, 200);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out of MCF CITIZEN?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          onClose();
          await logout();
          router.replace('/(auth)/login' as any);
        },
      },
    ]);
  };

  const handleSaveLanguage = async () => {
    await setLanguage(tempLang);
    setLangModalVisible(false);
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.drawerContainer}>
            {/* Header Citizen Profile */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitial}>
                    {user.name ? user.name[0] : 'K'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeDrawerButton}
                  onPress={onClose}
                >
                  <Feather name="x" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <Text style={styles.welcomeText}>
                {t('welcome')} {user.name}!
              </Text>
              <Text style={styles.mobileText}>+91 {user.mobile}</Text>
              <Text style={styles.wardBadge}>{user.ward}</Text>
            </View>

            {/* Navigation Menu Items */}
            <ScrollView
              style={styles.menuScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.menuSection}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIconBg, { backgroundColor: '#FFF7ED' }]}>
                    <Feather name="home" size={20} color="#F59019" />
                  </View>
                  <Text style={styles.menuText}>{t('home')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate('/profile')}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIconBg, { backgroundColor: '#EFF6FF' }]}>
                    <Feather name="user" size={20} color="#3B82F6" />
                  </View>
                  <Text style={styles.menuText}>{t('profile')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate('/faqs')}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIconBg, { backgroundColor: '#F0FDF4' }]}>
                    <Feather name="help-circle" size={20} color="#10B981" />
                  </View>
                  <Text style={styles.menuText}>{t('faqs')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate('/feedback')}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIconBg, { backgroundColor: '#FEF3C7' }]}>
                    <Feather name="message-square" size={20} color="#D97706" />
                  </View>
                  <Text style={styles.menuText}>{t('feedback')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setTempLang(language);
                    setLangModalVisible(true);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIconBg, { backgroundColor: '#FAF5FF' }]}>
                    <Feather name="globe" size={20} color="#8B5CF6" />
                  </View>
                  <View style={styles.langRow}>
                    <Text style={styles.menuText}>{t('changeLanguage')}</Text>
                    <Text style={styles.currentLangBadge}>
                      {language === 'en' ? 'EN' : 'HI'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <View style={styles.menuSection}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleLogout}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIconBg, { backgroundColor: '#FEF2F2' }]}>
                    <Feather name="log-out" size={20} color="#EF4444" />
                  </View>
                  <Text style={[styles.menuText, { color: '#EF4444' }]}>
                    {t('logout')}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footerContainer}>
              <Image
                source={require('@/../assets/images/logo.png')}
                style={styles.footerLogo}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.footerOrg}>Municipal Corporation Faridabad</Text>
                <Text style={styles.footerVersion}>MCF Citizen App v1.0.0</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={langModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <View style={styles.langOverlay}>
          <View style={styles.langCard}>
            <View style={styles.langHeader}>
              <Text style={styles.langTitle}>{t('selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setLangModalVisible(false)}>
                <Feather name="x" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.langOption,
                tempLang === 'en' && styles.langOptionSelected,
              ]}
              onPress={() => setTempLang('en')}
            >
              <View style={styles.radioRow}>
                <View
                  style={[
                    styles.radioCircle,
                    tempLang === 'en' && styles.radioCircleActive,
                  ]}
                >
                  {tempLang === 'en' && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.langOptionText}>English</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langOption,
                tempLang === 'hi' && styles.langOptionSelected,
              ]}
              onPress={() => setTempLang('hi')}
            >
              <View style={styles.radioRow}>
                <View
                  style={[
                    styles.radioCircle,
                    tempLang === 'hi' && styles.radioCircleActive,
                  ]}
                >
                  {tempLang === 'hi' && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.langOptionText}>हिंदी (Hindi)</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.langButtonsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setLangModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveLanguage}
              >
                <Text style={styles.saveBtnText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  drawerContainer: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    height: '100%',
    ...Shadow.lg,
  },
  profileHeader: {
    backgroundColor: '#F59019',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomRightRadius: 24,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.md,
  },
  avatarInitial: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F59019',
  },
  closeDrawerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mobileText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  wardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 8,
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  menuScroll: {
    flex: 1,
    paddingVertical: 12,
  },
  menuSection: {
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    marginBottom: 4,
  },
  menuIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  langRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentLangBadge: {
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: '#FAF5FF',
    color: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
    marginHorizontal: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FAFAFA',
  },
  footerLogo: {
    width: 34,
    height: 34,
    marginRight: 10,
  },
  footerOrg: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  footerVersion: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },

  /* Language Modal Styles */
  langOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  langCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    ...Shadow.lg,
  },
  langHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  langTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  langOption: {
    padding: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  langOptionSelected: {
    borderColor: '#F59019',
    backgroundColor: '#FFF7ED',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioCircleActive: {
    borderColor: '#F59019',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F59019',
  },
  langOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  langButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  cancelBtnText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#F59019',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
