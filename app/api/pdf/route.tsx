import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { calculateFusionChart } from '@/lib/fusion';
import path from 'path';

// Register Chinese Font from local storage to fix gibberish issue in PDF and avoid CDN timeouts
Font.register({
    family: 'SimHei',
    src: path.join(process.cwd(), 'public/fonts/SimHei.ttf'),
});

// Define elegant styles for the PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#F8FAFC', // slate-50
        padding: 40,
        fontFamily: 'SimHei',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: '#4F46E5', // indigo-600
        paddingBottom: 20,
    },
    titleBox: {
        flexDirection: 'column',
    },
    title: {
        fontSize: 28,
        color: '#0F172A', // slate-900
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#64748B', // slate-500
    },
    bentoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    bentoCardFull: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0', // slate-200
    },
    bentoCardHalf: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9', // slate-100
        paddingBottom: 10,
    },
    cardTitle: {
        fontSize: 16,
        color: '#334155', // slate-700
        fontWeight: 'bold',
    },
    cardBadge: {
        marginLeft: 'auto',
        fontSize: 10,
        backgroundColor: '#EEF2FF', // indigo-50
        color: '#4F46E5', // indigo-600
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    textNormal: {
        fontSize: 13,
        color: '#475569', // slate-600
        lineHeight: 1.6,
    },
    textHighlight: {
        backgroundColor: '#FEF3C7', // amber-100
        color: '#B45309', // amber-700
    },
    baziRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    pillarBox: {
        width: '23%',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    pillarLabel: {
        fontSize: 10,
        color: '#94A3B8', // slate-400
        marginBottom: 6,
    },
    pillarValue: {
        fontSize: 22,
        color: '#0F172A',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    pillarEng: {
        fontSize: 9,
        color: '#64748B',
    },
    elementTag: {
        marginTop: 10,
        padding: 6,
        backgroundColor: '#ECFDF5', // emerald-50
        color: '#059669', // emerald-600
        borderRadius: 6,
        fontSize: 12,
        textAlign: 'center',
    },
    ziweiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    palaceBox: {
        width: '31%',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#8B5CF6', // violet-500
    },
    palaceName: {
        fontSize: 12,
        color: '#334155',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    palaceStars: {
        fontSize: 11,
        color: '#64748B',
    },
    footer: {
        marginTop: 'auto',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        textAlign: 'center',
        fontSize: 10,
        color: '#94A3B8',
    },
});

const MarkdownBlock = ({ text }: { text: string }) => {
    if (!text) return null;
    const sections = text.split('\n').filter((s: string) => s.trim().length > 0);
    return (
        <View>
            {sections.map((section: string, idx: number) => {
                const s = section.trim();
                if (s.startsWith('###') || s.startsWith('**') && s.endsWith('**')) {
                    return (
                        <Text key={idx} style={{ ...styles.textNormal, fontWeight: 'bold', color: '#1E293B', marginTop: 10, marginBottom: 5 }}>
                            {s.replace(/#/g, '').replace(/\*\*/g, '').trim()}
                        </Text>
                    );
                } else if (s.startsWith('-') || s.startsWith('*')) {
                    const cleanText = s.replace(/^[-*]+\s*/, '').replace(/\*/g, '').trim();
                    return (
                        <View key={idx} style={{ flexDirection: 'row', marginBottom: 5, paddingLeft: 10 }}>
                            <Text style={{ fontSize: 13, color: '#4F46E5', marginRight: 5 }}>•</Text>
                            <Text style={styles.textNormal}>{cleanText}</Text>
                        </View>
                    )
                } else {
                    return (
                        <Text key={idx} style={{ ...styles.textNormal, marginBottom: 8 }}>
                            {s.replace(/\*\*/g, '')}
                        </Text>
                    );
                }
            })}
        </View>
    );
};

const GraphicReportDocument = ({ chartData, userName, locale, freePreview, lockedPreview }: { chartData: any, userName: string, locale: string, freePreview?: string, lockedPreview?: string }) => {
    const isZh = locale?.startsWith('zh');

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>RAYOY | 战略推演报告</Text>
                        <Text style={styles.subtitle}>Strategic Timing Report for {userName}</Text>
                    </View>
                    <View>
                        <Text style={styles.subtitle}>{new Date().toLocaleDateString()}</Text>
                        <Text style={styles.cardBadge}>Confidential</Text>
                    </View>
                </View>

                {/* BENTO GRID LAYOUT */}
                <View style={styles.bentoGrid}>

                    {/* BAZI VISUALIZATION (HALF WIDTH) */}
                    <View style={styles.bentoCardHalf}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{isZh ? '四柱原局' : 'Four Pillars (Bazi)'}</Text>
                            <Text style={styles.cardBadge}>Identity Map</Text>
                        </View>

                        <View style={styles.baziRow}>
                            {[
                                { label: isZh ? '年 Year' : 'Year', pd: chartData.bazi.yearPillar },
                                { label: isZh ? '月 Month' : 'Month', pd: chartData.bazi.monthPillar },
                                { label: isZh ? '日 Day' : 'Day', pd: chartData.bazi.dayPillar },
                                { label: isZh ? '时 Hour' : 'Hour', pd: chartData.bazi.hourPillar },
                            ].map((item, i) => (
                                <View key={i} style={styles.pillarBox}>
                                    <Text style={styles.pillarLabel}>{item.label}</Text>
                                    {item.pd ? (
                                        <>
                                            <Text style={styles.pillarValue}>{item.pd.stem}{item.pd.branch}</Text>
                                            <Text style={styles.pillarEng}>{item.pd.stemEn} {item.pd.branchEn}</Text>
                                        </>
                                    ) : (
                                        <Text style={styles.pillarValue}>--</Text>
                                    )}
                                </View>
                            ))}
                        </View>

                        <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ width: '48%' }}>
                                <Text style={{ fontSize: 11, color: '#64748B' }}>{isZh ? '日主 (Core Element)' : 'Core Element'}</Text>
                                <Text style={styles.elementTag}>
                                    {isZh ? `${chartData.bazi.dayMaster.element} ${chartData.bazi.dayMaster.polarity === 'Yang' ? '阳' : '阴'}` : `${chartData.bazi.dayMaster.elementEn} ${chartData.bazi.dayMaster.polarity}`}
                                </Text>
                            </View>
                            <View style={{ width: '48%' }}>
                                <Text style={{ fontSize: 11, color: '#64748B' }}>{isZh ? '当旺 (Strongest)' : 'Strongest'}</Text>
                                <Text style={{ ...styles.elementTag, backgroundColor: '#FFFBEB', color: '#D97706' }}>
                                    ↑ {isZh ? chartData.bazi.dominantElement?.zh : chartData.bazi.dominantElement?.en}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* ZIWEI TOP LEVEL (HALF WIDTH) */}
                    {chartData.ziwei && (
                        <View style={styles.bentoCardHalf}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>{isZh ? '紫微斗数' : 'Ziwei Palace'}</Text>
                                <Text style={styles.cardBadge}>Life Structural</Text>
                            </View>

                            <View style={{ backgroundColor: '#F8FAFC', padding: 15, borderRadius: 12, marginBottom: 15 }}>
                                <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 5 }}>{isZh ? '命宫主星' : 'Core Palace Stars'}</Text>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0F172A' }}>
                                    {isZh ? chartData.ziwei.lifePalace.majorStars.map((s: any) => s.name).join('、') || '无主星' : chartData.ziwei.lifePalace.majorStars.map((s: any) => s.nameEn).join(', ') || 'Empty'}
                                </Text>
                            </View>

                            <View style={{ backgroundColor: '#F5F3FF', padding: 15, borderRadius: 12 }}>
                                <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 5 }}>{isZh ? '四化能量' : 'Transformations'}</Text>
                                <Text style={{ fontSize: 13, color: '#4C1D95', lineHeight: 1.5 }}>
                                    {isZh ? '禄' : 'Lu(Prosperity)'}: {chartData.ziwei.transformations['化禄'] || (isZh ? '无' : 'None')} {'  '}
                                    {isZh ? '权' : 'Quan(Power)'}: {chartData.ziwei.transformations['化权'] || (isZh ? '无' : 'None')} {'\n'}
                                    {isZh ? '科' : 'Ke(Fame)'}: {chartData.ziwei.transformations['化科'] || (isZh ? '无' : 'None')} {'  '}
                                    {isZh ? '忌' : 'Ji(Obstacle)'}: {chartData.ziwei.transformations['化忌'] || (isZh ? '无' : 'None')}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* AI STRATEGIC INSIGHT (FULL WIDTH) */}
                    <View style={styles.bentoCardFull}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{isZh ? '双引擎交叉融合解析' : 'Fusion Strategic Context'}</Text>
                            <Text style={{ ...styles.cardBadge, backgroundColor: '#ECFDF5', color: '#059669' }}>AI Verified</Text>
                        </View>

                        {freePreview ? <MarkdownBlock text={freePreview} /> : <MarkdownBlock text={chartData.fusionContext} />}
                    </View>

                    {/* PREMIUM AI STRATEGIC INSIGHT (FULL WIDTH) */}
                    {lockedPreview && (
                        <View style={styles.bentoCardFull}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>{isZh ? '深度策略与行动建议 (Pro)' : 'Deep Strategy & Actionable Advice (Pro)'}</Text>
                                <Text style={{ ...styles.cardBadge, backgroundColor: '#FEF2F2', color: '#DC2626' }}>Premium</Text>
                            </View>
                            <MarkdownBlock text={lockedPreview} />
                        </View>
                    )}

                </View>

                {/* FOOTER */}
                <View style={styles.footer}>
                    <Text>Rayoy Elite Strategic Advisor | System Version 2.0</Text>
                    <Text style={{ marginTop: 4 }}>This report maps structural probabilities. Execution is in your hands.</Text>
                </View>
            </Page>
        </Document>
    );
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { birthDate, birthTime, userName = "Strategist", locale = "en", freePreview, lockedPreview } = body;

        if (!birthDate) {
            return new Response('Birth date is required', { status: 400 });
        }

        // Calculate integrated Fusion chart
        const fusionChart = calculateFusionChart(birthDate, birthTime || undefined, 'M');

        // Render PDF to stream
        const stream = await renderToStream(
            <GraphicReportDocument
                chartData={fusionChart}
                userName={userName}
                locale={locale}
                freePreview={freePreview}
                lockedPreview={lockedPreview}
            />
        );

        // Convert Node.js stream to Web ReadableStream
        const webStream = new ReadableStream({
            start(controller) {
                stream.on('data', (chunk) => controller.enqueue(chunk));
                stream.on('end', () => controller.close());
                stream.on('error', (err) => controller.error(err));
            }
        });

        return new Response(webStream, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Rayoy_Report_${birthDate}.pdf"`,
            },
        });
    } catch (e: any) {
        console.error('PDF Generation Error:', e);
        return new Response(`Failed to generate PDF: ${e.message}`, { status: 500 });
    }
}
