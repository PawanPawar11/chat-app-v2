import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
      </div>
    </ThemeProvider>
  );
}

export default App;
