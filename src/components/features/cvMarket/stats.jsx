import { stats } from "@/components/features/cvMarket/data/cvMarketData.js";

const Stats = () => {
    return (
        <section className="bg-green-500 py-8 px-6">
            <div className="max-w-[960px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {stats.map((s) => (
                    <div key={s.label}>
                        <div className="text-3xl md:text-4xl font-extrabold text-white leading-none mb-1">
                            {s.value}
                        </div>
                        <div className="text-sm text-white font-medium">
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Stats;