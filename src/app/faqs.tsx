import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Header } from '@/components/common/Header';
import { CustomCard } from '@/components/common/CustomCard';
import { FAQ_DATA, FAQItem } from '@/data/faqData';
import { useLanguage } from '@/context/LanguageContext';
import { Colors, Radius, Shadow } from '@/constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FaqsScreen() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<string[]>(['faq-1']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Complaints', 'Property Tax', 'Water & Sanitation', 'General'];

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((item) => item !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCategory =
      selectedCategory === 'All' ? true : faq.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      faq.question.toLowerCase().includes(query) ||
      faq.hindiQuestion.includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.hindiAnswer.includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <Header title="Frequently Asked Questions" showBack />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search FAQs (e.g. complaint, tax, water)..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color="#64748B" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category Filter Chips */}
      <View style={styles.chipRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip,
                selectedCategory === cat && styles.chipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === cat && styles.chipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.faqsList}>
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedIds.includes(faq.id);

            return (
              <CustomCard
                key={faq.id}
                style={[styles.faqCard, isExpanded && styles.faqCardExpanded]}
                onPress={() => toggleExpand(faq.id)}
              >
                <View style={styles.questionRow}>
                  <View style={styles.qBadge}>
                    <Text style={styles.qBadgeText}>Q</Text>
                  </View>
                  <Text style={styles.questionText}>
                    {language === 'hi' ? faq.hindiQuestion : faq.question}
                  </Text>
                  <Feather
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#F59019"
                  />
                </View>

                {isExpanded && (
                  <View style={styles.answerContainer}>
                    <Text style={styles.answerText}>
                      {language === 'hi' ? faq.hindiAnswer : faq.answer}
                    </Text>
                    <View style={styles.categoryFooter}>
                      <Text style={styles.categoryLabel}>
                        Topic: {faq.category}
                      </Text>
                    </View>
                  </View>
                )}
              </CustomCard>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FB',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    ...Shadow.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  chipRow: {
    paddingVertical: 10,
  },
  chipScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#F59019',
    borderColor: '#F59019',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  faqsList: {
    gap: 10,
  },
  faqCard: {
    padding: 16,
  },
  faqCardExpanded: {
    borderColor: '#FED7AA',
    borderLeftWidth: 3,
    borderLeftColor: '#F59019',
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F59019',
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 20,
  },
  answerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  answerText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  categoryFooter: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
