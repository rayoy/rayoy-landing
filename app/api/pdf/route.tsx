import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { calculateFusionChart } from '@/lib/fusion';
import path from 'path';

// Register Chinese Font
Font.register({
    family: 'SimHei',
    src: path.join(process.cwd(), 'public/fonts/SimHei.ttf'),
});

// ─── Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#F8FAFC',
        padding: 40,
        fontFamily: 'SimHei',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: '#4F46E5',
        paddingBottom: 20,
    },
    titleBox: {
        flexDirection: 'column',
    },
    title: {
        fontSize: 26,
        color: '#0F172A',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 11,
        color: '#64748B',
    },
    badge: {
        fontSize: 9,
        backgroundColor: '#EEF2FF',
        color: '#4F46E5',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    // Bento grid
    bentoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    cardFull: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cardHalf: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        paddingBottom: 8,
    },
    cardTitle: {
        fontSize: 14,
        color: '#334155',
        fontWeight: 'bold',
    },
    cardBadge: {
        marginLeft: 'auto',
        fontSize: 9,
        backgroundColor: '#EEF2FF',
        color: '#4F46E5',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    // Text
    textNormal: {
        fontSize: 11,
        color: '#475569',
        lineHeight: 1.6,
    },
    textBold: {
        fontSize: 11,
        color: '#1E293B',
        fontWeight: 'bold',
    },
    // Bazi
    baziRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    pillarBox: {
        width: '23%',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    pillarLabel: {
        fontSize: 9,
        color: '#94A3B8',
        marginBottom: 4,
    },
    pillarValue: {
        fontSize: 20,
        color: '#0F172A',
        fontWeight: 'bold',
        marginBottom: 3,
    },
    pillarEng: {
        fontSize: 8,
        color: '#64748B',
    },
    elementTag: {
        marginTop: 8,
        padding: 5,
        backgroundColor: '#ECFDF5',
        color: '#059669',
        borderRadius: 6,
        fontSize: 11,
        textAlign: 'center',
    },
    // Dual layer section
    sectionCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    sectionBadge: {
        marginLeft: 'auto',
        fontSize: 8,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 4,
    },
    sectionBody: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    plainBox: {
        marginTop: 8,
        padding: 10,
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#A5B4FC',
    },
    plainLabel: {
        fontSize: 9,
        color: '#6366F1',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    plainText: {
        fontSize: 10,
        color: '#64748B',
        lineHeight: 1.5,
    },
    // Risk badge
    riskBadge: {
        fontSize: 9,
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 10,
        fontWeight: 'bold',
    },
    // Footer
    footer: {
        marginTop: 'auto',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        textAlign: 'center',
        fontSize: 9,
        color: '#94A3B8',
    },
});

// ─── Helper Components ──────────────────────────────────────────────────

const SectionCard = ({
    title,
    badge,
    badgeColor,
    professional,
    plain,
    isZh,
}: {
    title: string;
    badge: string;
    badgeColor: { bg: string; text: string };
    professional: string;
    plain: string;
    isZh: boolean;
}) => (
    <View style={styles.sectionCard} wrap={false}>
        <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={{ ...styles.sectionBadge, backgroundColor: badgeColor.bg, color: badgeColor.text }}>
                {badge}
            </Text>
        </View>
        <View style={styles.sectionBody}>
            <Text style={{ ...styles.textNormal, marginBottom: 4 }}>{professional}</Text>
            {plain ? (
                <View style={styles.plainBox}>
                    <Text style={styles.plainLabel}>{isZh ? '· 通俗解读' : '· In Plain Terms'}</Text>
                    <Text style={styles.plainText}>{plain}</Text>
                </View>
            ) : null}
        </View>
    </View>
);

const RiskBadgePdf = ({ level, isZh }: { level: string; isZh: boolean }) => {
    const config: Record<string, { label: string; bg: string; text: string }> = {
        low: { label: isZh ? '低风险' : 'Low', bg: '#ECFDF5', text: '#059669' },
        medium: { label: isZh ? '中等风险' : 'Medium', bg: '#FFFBEB', text: '#D97706' },
        high: { label: isZh ? '高风险' : 'High', bg: '#FEF2F2', text: '#DC2626' },
    };
    const c = config[level] || config.medium;
    return <Text style={{ ...styles.riskBadge, backgroundColor: c.bg, color: c.text }}>{c.label}</Text>;
};

// ─── Document ───────────────────────────────────────────────────────────

const GraphicReportDocument = ({
    chartData,
    userName,
    locale,
    freeReport,
    lockedReport,
}: {
    chartData: any;
    userName: string;
    locale: string;
    freeReport?: any;
    lockedReport?: any;
}) => {
    const isZh = locale?.startsWith('zh');

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>RAYOY | {isZh ? '战略推演报告' : 'Strategic Timing Report'}</Text>
                        <Text style={styles.subtitle}>{isZh ? `为 ${userName} 定制的推演报告` : `Strategic Timing Report for ${userName}`}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.subtitle}>{new Date().toLocaleDateString()}</Text>
                        <Text style={{ ...styles.badge, marginTop: 4 }}>{isZh ? '机密' : 'Confidential'}</Text>
                    </View>
                </View>

                {/* BENTO GRID */}
                <View style={styles.bentoGrid}>

                    {/* BAZI (DYNAMIC WIDTH) */}
                    <View style={chartData.ziwei ? styles.cardHalf : styles.cardFull}>
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
                        <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ width: '48%' }}>
                                <Text style={{ fontSize: 10, color: '#64748B' }}>{isZh ? '日主' : 'Core Element'}</Text>
                                <Text style={styles.elementTag}>
                                    {isZh ? `${chartData.bazi.dayMaster.element} ${chartData.bazi.dayMaster.polarity === 'Yang' ? '阳' : '阴'}` : `${chartData.bazi.dayMaster.elementEn} ${chartData.bazi.dayMaster.polarity}`}
                                </Text>
                            </View>
                            <View style={{ width: '48%' }}>
                                <Text style={{ fontSize: 10, color: '#64748B' }}>{isZh ? '当旺' : 'Strongest'}</Text>
                                <Text style={{ ...styles.elementTag, backgroundColor: '#FFFBEB', color: '#D97706' }}>
                                    ↑ {isZh ? chartData.bazi.dominantElement?.zh : chartData.bazi.dominantElement?.en}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* ZIWEI (HALF) */}
                    {chartData.ziwei && (
                        <View style={styles.cardHalf}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>{isZh ? '紫微斗数' : 'Ziwei Palace'}</Text>
                                <Text style={styles.cardBadge}>Life Structural</Text>
                            </View>
                            <View style={{ backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginBottom: 10 }}>
                                <Text style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>{isZh ? '命宫主星' : 'Core Palace Stars'}</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0F172A' }}>
                                    {isZh ? chartData.ziwei.lifePalace.majorStars.map((s: any) => s.name).join('、') || '无主星' : chartData.ziwei.lifePalace.majorStars.map((s: any) => s.nameEn).join(', ') || 'Empty'}
                                </Text>
                            </View>
                            <View style={{ backgroundColor: '#F5F3FF', padding: 12, borderRadius: 10 }}>
                                <Text style={{ fontSize: 10, color: '#64748B', marginBottom: 4 }}>{isZh ? '四化能量' : 'Transformations'}</Text>
                                <Text style={{ fontSize: 11, color: '#4C1D95', lineHeight: 1.5 }}>
                                    {isZh ? '禄' : 'Lu'}: {chartData.ziwei.transformations['化禄'] || (isZh ? '无' : 'None')} {'  '}
                                    {isZh ? '权' : 'Quan'}: {chartData.ziwei.transformations['化权'] || (isZh ? '无' : 'None')} {'\n'}
                                    {isZh ? '科' : 'Ke'}: {chartData.ziwei.transformations['化科'] || (isZh ? '无' : 'None')} {'  '}
                                    {isZh ? '忌' : 'Ji'}: {chartData.ziwei.transformations['化忌'] || (isZh ? '无' : 'None')}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* ═══ AI Structured Report Sections ═══ */}
                    {freeReport ? (
                        <>
                            {/* Section divider */}
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 4 }}>
                                <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
                                <Text style={{ fontSize: 9, color: '#6366F1', fontWeight: 'bold', marginHorizontal: 10 }}>
                                    {isZh ? 'AI 分析报告' : 'AI Analysis Report'}
                                </Text>
                                <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
                            </View>

                            {/* Identity */}
                            {freeReport.identity && (
                                <SectionCard
                                    title={freeReport.identity.title}
                                    badge={isZh ? '核心人格' : 'Core Identity'}
                                    badgeColor={{ bg: '#EEF2FF', text: '#4F46E5' }}
                                    professional={freeReport.identity.professional}
                                    plain={freeReport.identity.plain}
                                    isZh={isZh}
                                />
                            )}

                            {/* Current Cycle */}
                            {freeReport.currentCycle && (
                                <SectionCard
                                    title={freeReport.currentCycle.title}
                                    badge={isZh ? '当前周期' : 'Current Cycle'}
                                    badgeColor={{ bg: '#F5F3FF', text: '#7C3AED' }}
                                    professional={freeReport.currentCycle.professional}
                                    plain={freeReport.currentCycle.plain}
                                    isZh={isZh}
                                />
                            )}

                            {/* Risk Assessment */}
                            {freeReport.riskAssessment && (
                                <View style={styles.sectionCard} wrap={false}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.cardTitle}>{freeReport.riskAssessment.title}</Text>
                                        <RiskBadgePdf level={freeReport.riskAssessment.level} isZh={isZh} />
                                    </View>
                                    <View style={styles.sectionBody}>
                                        <Text style={styles.textNormal}>{freeReport.riskAssessment.professional}</Text>
                                        {freeReport.riskAssessment.plain ? (
                                            <View style={styles.plainBox}>
                                                <Text style={styles.plainLabel}>{isZh ? '· 通俗解读' : '· In Plain Terms'}</Text>
                                                <Text style={styles.plainText}>{freeReport.riskAssessment.plain}</Text>
                                            </View>
                                        ) : null}
                                    </View>
                                </View>
                            )}

                            {/* ═══ Unlock CTA — shown when no lockedReport ═══ */}
                            {!lockedReport && (
                                <View style={{
                                    width: '100%',
                                    marginTop: 16,
                                    padding: 24,
                                    backgroundColor: '#FFFBEB',
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: '#F59E0B',
                                    marginBottom: 14,
                                }} wrap={false}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#92400E', marginBottom: 8 }}>
                                        {isZh ? '解锁完整深度报告' : 'Unlock Full Deep Report'}
                                    </Text>
                                    <Text style={{ fontSize: 11, color: '#78350F', lineHeight: 1.6, marginBottom: 12 }}>
                                        {isZh
                                            ? '以上为免费预览内容。完整报告包含更多高价值策略分析：'
                                            : 'The above is a free preview. The full report includes more high-value strategic analysis:'}
                                    </Text>
                                    <View style={{ paddingLeft: 8, marginBottom: 12 }}>
                                        <Text style={{ fontSize: 11, color: '#92400E', marginBottom: 6 }}>
                                            {isZh ? '· 个性化行动建议 — 具体落地的做法与方向' : '· Personalized Action Plans'}
                                        </Text>
                                        <Text style={{ fontSize: 11, color: '#92400E', marginBottom: 6 }}>
                                            {isZh ? '· 最佳时机窗口 — 什么时候做什么，精准吉时推荐' : '· Optimal Timing Windows'}
                                        </Text>
                                        <Text style={{ fontSize: 11, color: '#92400E', marginBottom: 6 }}>
                                            {isZh ? '· 五行调节策略 — 衣食住行的平衡建议' : '· Five Element Balancing Strategy'}
                                        </Text>
                                        <Text style={{ fontSize: 11, color: '#92400E', marginBottom: 6 }}>
                                            {isZh ? '· 决策深度分析 — 关键决定的推演参考' : '· Decision Analysis Deep Dive'}
                                        </Text>
                                    </View>
                                    <View style={{ backgroundColor: '#F59E0B', borderRadius: 8, padding: 12, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' }}>
                                            {isZh ? '立即解锁 → rayoy.com/try' : 'Unlock Now → rayoy.com/try'}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 9, color: '#A16207', textAlign: 'center', marginTop: 8 }}>
                                        {isZh ? '一次购买，永久查看。也可升级会员享更多权益。' : 'One-time purchase, lifetime access. Or upgrade to membership for more benefits.'}
                                    </Text>
                                </View>
                            )}
                        </>
                    ) : (
                        // Fallback: render fusionContext raw text
                        <View style={styles.cardFull}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>{isZh ? '融合分析' : 'Fusion Analysis'}</Text>
                                <Text style={{ ...styles.cardBadge, backgroundColor: '#ECFDF5', color: '#059669' }}>AI</Text>
                            </View>
                            <Text style={styles.textNormal}>{chartData.fusionContext?.slice(0, 500) || ''}</Text>
                        </View>
                    )}

                    {/* PREMIUM Content */}
                    {lockedReport && (
                        <>
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 4 }}>
                                <View style={{ flex: 1, height: 1, backgroundColor: '#FDE68A' }} />
                                <Text style={{ fontSize: 9, color: '#D97706', fontWeight: 'bold', marginHorizontal: 10 }}>
                                    {isZh ? '深度策略 (Pro)' : 'Deep Strategy (Pro)'}
                                </Text>
                                <View style={{ flex: 1, height: 1, backgroundColor: '#FDE68A' }} />
                            </View>

                            {/* Actions */}
                            {lockedReport.actions?.items?.map((item: any, i: number) => (
                                <SectionCard
                                    key={`action-${i}`}
                                    title={item.label}
                                    badge={isZh ? '行动建议' : 'Action'}
                                    badgeColor={{ bg: '#FFFBEB', text: '#D97706' }}
                                    professional={item.professional}
                                    plain={item.plain}
                                    isZh={isZh}
                                />
                            ))}

                            {/* Timing Windows */}
                            {lockedReport.timing?.windows?.length > 0 && (
                                <View style={styles.sectionCard} wrap={false}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.cardTitle}>{lockedReport.timing.title || (isZh ? '最佳时机窗口' : 'Timing Windows')}</Text>
                                        <Text style={{ ...styles.sectionBadge, backgroundColor: '#ECFDF5', color: '#059669' }}>Timing</Text>
                                    </View>
                                    <View style={styles.sectionBody}>
                                        {lockedReport.timing.windows.map((w: any, i: number) => (
                                            <View key={i} style={{ flexDirection: 'row', marginBottom: 8, paddingLeft: 4 }}>
                                                <Text style={{ fontSize: 11, color: '#059669', marginRight: 6 }}>▸</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.textBold}>{w.period} — {w.focus}</Text>
                                                    <Text style={{ ...styles.textNormal, fontSize: 10 }}>{w.detail}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Element Strategy */}
                            {lockedReport.elementStrategy && (
                                <SectionCard
                                    title={lockedReport.elementStrategy.title || (isZh ? '五行调节策略' : 'Element Strategy')}
                                    badge={isZh ? '调节' : 'Balance'}
                                    badgeColor={{ bg: '#ECFDF5', text: '#059669' }}
                                    professional={lockedReport.elementStrategy.professional}
                                    plain={lockedReport.elementStrategy.plain}
                                    isZh={isZh}
                                />
                            )}

                            {/* Decision Analysis */}
                            {lockedReport.decisionAnalysis && (
                                <SectionCard
                                    title={lockedReport.decisionAnalysis.title || (isZh ? '决策分析' : 'Decision Analysis')}
                                    badge={isZh ? '决策' : 'Decision'}
                                    badgeColor={{ bg: '#FEF2F2', text: '#DC2626' }}
                                    professional={lockedReport.decisionAnalysis.professional}
                                    plain={lockedReport.decisionAnalysis.plain}
                                    isZh={isZh}
                                />
                            )}
                        </>
                    )}
                </View>

                {/* FOOTER */}
                <View style={styles.footer}>
                    <Text>{isZh ? 'Rayoy 精英战略顾问 | 系统版本 3.0' : 'Rayoy Elite Strategic Advisor | System Version 3.0'}</Text>
                    <Text style={{ marginTop: 3 }}>{isZh ? '本报告基于命理结构推演概率，行动由你掌控。' : 'This report maps structural probabilities. Execution is in your hands.'}</Text>
                    <Text style={{ marginTop: 3 }}>rayoy.com</Text>
                </View>
            </Page>
        </Document>
    );
};

// ─── API Route ──────────────────────────────────────────────────────────

export async function POST(req: Request) {
    try {
        // Support both JSON and form data (form data for native browser download)
        let body: any;
        const contentType = req.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            body = await req.json();
        } else {
            const formData = await req.formData();
            const dataField = formData.get('data') as string;
            body = dataField ? JSON.parse(dataField) : {};
        }
        const { birthDate, birthTime, userName = 'Strategist', locale = 'en', freeReport, lockedReport } = body;

        if (!birthDate) {
            return new Response('Birth date is required', { status: 400 });
        }

        const fusionChart = calculateFusionChart(birthDate, birthTime || undefined, 'M');

        const stream = await renderToStream(
            <GraphicReportDocument
                chartData={fusionChart}
                userName={userName}
                locale={locale}
                freeReport={freeReport}
                lockedReport={lockedReport}
            />
        );

        const webStream = new ReadableStream({
            start(controller) {
                stream.on('data', (chunk) => controller.enqueue(chunk));
                stream.on('end', () => controller.close());
                stream.on('error', (err) => controller.error(err));
            }
        });

        const safeFilename = encodeURIComponent(`Rayoy_Report_${birthDate}.pdf`);

        return new Response(webStream, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Rayoy_Report_${birthDate}.pdf"; filename*=UTF-8''${safeFilename}`,
            },
        });
    } catch (e: any) {
        console.error('PDF Generation Error:', e);
        return new Response(`Failed to generate PDF: ${e.message}`, { status: 500 });
    }
}
