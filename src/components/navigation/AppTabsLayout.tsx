import { AppTabButton } from "@/components/navigation/AppTabButton";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabItem = {
  name: string;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  hidden?: boolean;
};

type Props = {
  tabs: TabItem[];
  activeColor?: string;
  inactiveColor?: string;
  activeBackgroundColor?: string;
};

export function AppTabsLayout({
  tabs,
  activeColor = Colors.accent,
  inactiveColor = Colors.textSecondary,
  activeBackgroundColor = "rgba(20, 184, 166, 0.18)",
}: Props) {
  const insets = useSafeAreaInsets();
  const segments = useSegments();

  const isTabFocused = (tabName: string) => {
    // tabName can be 'rooms' or 'rooms/[id]' or 'profile'
    // segments can be ['(student)', 'rooms'] or ['(student)', 'rooms', '123']
    
    const normalizedTabName = tabName.split('/')[0]; // handle 'rooms/[id]' -> 'rooms'
    
    // Check if the tab name (first part) is present in segments
    // We skip the group segments like '(student)'
    return segments.some(segment => segment === normalizedTabName);
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingHorizontal: 10,
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        },
        tabBarItemStyle: {
          height: 60,
        },
      }}
    >
      {tabs.map((tab) => {
        if (tab.hidden) {
          return (
            <Tabs.Screen
              key={tab.name}
              name={tab.name}
              options={{
                title: tab.label,
                href: null,
              }}
            />
          );
        }

        const focused = isTabFocused(tab.name);

        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.label,
              tabBarButton: (props) => (
                <AppTabButton
                  {...props}
                  focused={focused}
                  label={tab.label}
                  iconName={tab.iconName}
                  activeColor={activeColor}
                  inactiveColor={inactiveColor}
                  activeBackgroundColor={activeBackgroundColor}
                />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
