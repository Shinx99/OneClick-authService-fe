import ApplicationsList from "@/components/features/applications/ApplicationsList";

export const metadata = {
  title: "Việc làm đã ứng tuyển | OneClick",
  description: "Theo dõi trạng thái hồ sơ ứng tuyển của bạn",
};

export default function ApplicationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ApplicationsList />
    </div>
  );
}