import {
    HiUsers,
    HiCheckCircle,
    HiClock,
    HiChartBar,
} from "react-icons/hi";

interface SummaryCardsProps {
    summary: {
        grand_total_siswa: number;
        grand_total_submitted: number;
        grand_total_pending: number;
        grand_percentage_submitted: number;
    };
}

export function SummaryCards({ summary }: SummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <HiUsers className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Siswa</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {summary.grand_total_siswa.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                        <HiCheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Sudah Mengumpulkan</p>
                        <p className="text-2xl font-bold text-emerald-600">
                            {summary.grand_total_submitted.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                    <div className="bg-orange-100 p-2 rounded-lg">
                        <HiClock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Belum Mengumpulkan</p>
                        <p className="text-2xl font-bold text-orange-600">
                            {summary.grand_total_pending.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-lg">
                        <HiChartBar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Persentase</p>
                        <p className="text-2xl font-bold text-purple-600">
                            {summary.grand_percentage_submitted.toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}