import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocsSidebar from "@/components/DocsSidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Navbar />
      <div className="gradient-line" />
      <div className="flex flex-1 max-w-[72rem] mx-auto w-full px-5 py-10 gap-10">
        <DocsSidebar />
        <main className="flex-1 min-w-0 prose-docs">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

