import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import React from 'react';
import * as jsx from 'react/jsx-runtime';
import * as pdf from '@react-pdf/renderer';
import { loadSource, root } from './load-source.mjs';

// Render with the bundled local font and synthetic chart data. The route has no
// AI, payment or database dependency; no HTTP server or remote request is used.
const { POST } = loadSource('app/api/pdf/route.tsx', {
    mocks: { react: React, 'react/jsx-runtime': jsx, '@react-pdf/renderer': pdf, path },
    globals: { process: { env: {}, cwd: () => root } },
});

test('PDF JSON and form downloads still render with and without Ziwei/report sections', async () => {
    for (const form of [false, true]) {
        const body = {
            birthDate: '1990-05-15', birthTime: form ? '09:00' : undefined,
            userName: 'Offline Fixture', locale: form ? 'zh-CN' : 'en',
            freeReport: form ? {
                identity: { title: 'Identity', professional: 'Fixture', plain: 'Fixture' },
                currentCycle: { title: 'Cycle', professional: 'Fixture', plain: 'Fixture' },
                riskAssessment: { level: 'low', title: 'Risk', professional: 'Fixture', plain: 'Fixture' },
            } : undefined,
            lockedReport: form ? { timing: { title: 'Window', windows: [{ period: 'October', focus: 'Fixture', detail: 'Fixture' }] } } : undefined,
        };
        const request = new Request('http://localhost/api/pdf', {
            method: 'POST',
            headers: { 'Content-Type': form ? 'application/x-www-form-urlencoded' : 'application/json' },
            body: form ? new URLSearchParams({ data: JSON.stringify(body) }) : JSON.stringify(body),
        });
        const response = await POST(request);
        assert.equal(response.status, 200);
        assert.equal(response.headers.get('Content-Type'), 'application/pdf');
        assert.match(response.headers.get('Content-Disposition'), /Timing_Report_1990-05-15\.pdf/);
        const bytes = Buffer.from(await response.arrayBuffer());
        assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
        assert.ok(bytes.length > 1000);
    }
});

test('PDF keeps the missing-birth-date response', async () => {
    const response = await POST(new Request('http://localhost/api/pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }));
    assert.equal(response.status, 400);
    assert.equal(await response.text(), 'Birth date is required');
});
