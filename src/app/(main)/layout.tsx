import MainLayout from '@/components/layout/MainLayout';

export default function MainRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}