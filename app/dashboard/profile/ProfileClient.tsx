'use client';

import { useLanguage } from '@/lib/LanguageContext';

interface ProfileClientProps {
    birthDate: string | null;
    birthTime: string | null;
    birthLocation: string | null;
}

export default function ProfileClient({ birthDate, birthTime, birthLocation }: ProfileClientProps) {
    const { ta } = useLanguage();
    const t = ta.profile;

    return (
        <div className="max-w-2xl fade-in">
            <h1 className="text-2xl font-bold text-white mb-2">{t.title}</h1>
            <p className="text-gray-400 mb-8">
                {t.description}
            </p>

            <form className="space-y-6 bg-gray-900/50 p-6 rounded-2xl border border-gray-800" action="/api/profile/update" method="POST">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300" htmlFor="birth_date">{t.dateOfBirth}</label>
                        <input
                            type="date"
                            name="birth_date"
                            id="birth_date"
                            defaultValue={birthDate || ''}
                            className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300" htmlFor="birth_time">{t.timeOfBirth}</label>
                        <input
                            type="time"
                            name="birth_time"
                            id="birth_time"
                            defaultValue={birthTime || ''}
                            className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300" htmlFor="birth_location">{t.cityOfBirth}</label>
                    <input
                        type="text"
                        name="birth_location"
                        id="birth_location"
                        defaultValue={birthLocation || ''}
                        placeholder={t.cityPlaceholder}
                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        required
                    />
                </div>

                <div className="pt-4 border-t border-gray-800 flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/25"
                    >
                        {t.saveProfile}
                    </button>
                </div>
            </form>
        </div>
    );
}
