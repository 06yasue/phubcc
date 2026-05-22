import Header from '@/components/Header';

export default function ListLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
