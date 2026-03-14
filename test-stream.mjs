import { createDataStreamResponse } from 'ai';

async function testStream() {
    const text = 'Hello world this is a test from the proxy cascade returning data.';
    
    // Simulate what the route handler does
    const response = createDataStreamResponse({
        execute: async (dataStream) => {
            try {
                console.log('[Fallback Stream] Executing stream response to client');
                const chunkSize = 20;

                for (let i = 0; i < text.length; i += chunkSize) {
                    const chunk = text.slice(i, i + chunkSize);
                    const formattedChunk = `0:${JSON.stringify(chunk)}\n`;
                    if (i === 0) console.log('[Fallback Stream] First chunk formatted as:', formattedChunk);
                    dataStream.write(formattedChunk);
                    await new Promise(r => setTimeout(r, 15));
                }
                
                console.log('[Fallback Stream] Finished writing chunks');
            } catch (err) {
                console.error('[Fallback Stream Error]', err);
            }
        }
    });

    console.log('[Test Stream] Headers:', response.headers);
    if (response.body) {
        const reader = response.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            console.log(Buffer.from(value).toString('utf-8'));
        }
    }
}

testStream().catch(console.error);
