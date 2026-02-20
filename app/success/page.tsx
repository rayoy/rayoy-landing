import Link from 'next/link';

export default function SuccessPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-brand-dark px-6 text-center">
            <div className="mx-auto max-w-md rounded-2xl border border-brand-accent/30 bg-brand-card/30 p-10 shadow-[0_0_40px_rgba(45,212,191,0.1)] backdrop-blur-sm">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-accent/20">
                    <svg
                        className="h-10 w-10 text-brand-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-brand-text mb-4">
                    Payment Successful
                </h1>
                <p className="text-brand-muted mb-8 leading-relaxed">
                    Your payment has been securely processed. We are now initializing your cycle intelligence analysis environment.
                </p>
                <Link
                    href="/"
                    className="inline-flex w-full items-center justify-center rounded-md bg-brand-accent px-6 py-3 text-sm font-medium text-brand-dark transition-all hover:bg-brand-accent-hover hover:shadow-[0_0_20px_rgba(45,212,191,0.4)]"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
}
