import { projectApi } from '@/app/api/network';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { decodeHtml } from '@/utils/string-utils';
import { Tabs } from '@ant-design/react-native';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabItem {
    title: string;
    key: string;
}

export default function ProjectScreen() {
    const insets = useSafeAreaInsets();
    const colors = Colors[useColorScheme() ?? 'light'];

    const [tabDatas, setTabDatas] = useState<TabItem[]>([]);
    const [activeId, setActiveId] = useState<number>(0);

    useEffect(() => {
        projectApi.getProjectTab().then((chapters) => {            
            // 将 Chapter 类型映射为 Tabs 需要的格式，并解码 HTML 实体
            const tabs = chapters.map(chapter => ({
                title: decodeHtml(chapter.name),
                key: chapter.id.toString()
            }));
            setTabDatas(tabs);
            setActiveId(chapters[0].id);
        });
    }, []);

    const _renderTabs = (
        <Tabs 
            style={{ height: 44 }} 
            tabBarBackgroundColor={ colors.background }
            // 这个底部边线设置真是难找; 
            styles={{
                // 注意: 因为`tabBarPosition默认是上`, 所以这里是`topTabBarSplitLine`属性
                topTabBarSplitLine: {
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.separator
                }
            }}
            tabBarUnderlineStyle={{ backgroundColor: colors.tint }}
            tabs={tabDatas}
            initialPage={0}
            renderTab={(tabData) => (
               <ThemedText style={{ marginHorizontal: 10, fontWeight: 500, fontSize: 17 }}>{tabData.title}</ThemedText> 
            )}
            onChange={(tabData) => {
                console.log(tabData);
            }}
        >
            {
                // 子页面容器
                tabDatas.map((tab) => {
                    return (
                        <ThemedView key={tab.key} style={{ flex: 1}} >

                        </ThemedView>
                    )
                })
            }
        </Tabs>
    );

    return (
        <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
            <ThemedView style={[{ marginTop: insets.top }]}>
                {_renderTabs}
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});