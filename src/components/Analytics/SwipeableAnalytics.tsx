import { useState, useRef, useEffect } from "react";
import { IncomeExpenseTrend } from "@/components/Analytics/IncomeExpenseTrend";
import { SavingsTrend } from "@/components/Analytics/SavingsTrend";
import { ChartBar } from "@/components/Dashboard/BarChart";
import { ChartPie } from "@/components/Dashboard/PieChart";
import { useAppContext } from "@/lib/AppContext";

interface SwipeableAnalyticsProps {
  trendData: any[];
  savingsData: any[];
  pieChartData: any[];
  totalExpenses: number;
}

const TABS = [
  { id: "trends", name: "Trends" },
  { id: "comparison", name: "Comparison" },
  { id: "categories", name: "Categories" },
];

export function SwipeableAnalytics({
  trendData,
  savingsData,
  pieChartData,
  totalExpenses,
}: SwipeableAnalyticsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { formatCurrency } = useAppContext();

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const diffX = startX - currentX;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && activeTab < TABS.length - 1) {
        // Swipe left - next tab
        setActiveTab(activeTab + 1);
      } else if (diffX < 0 && activeTab > 0) {
        // Swipe right - previous tab
        setActiveTab(activeTab - 1);
      }
    }

    setCurrentX(0);
  };

  // Handle mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const diffX = startX - currentX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && activeTab < TABS.length - 1) {
        setActiveTab(activeTab + 1);
      } else if (diffX < 0 && activeTab > 0) {
        setActiveTab(activeTab - 1);
      }
    }

    setCurrentX(0);
  };

  // Prevent context menu on long press
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Keyboard navigation
  useEffect(() => {
    // Only add event listeners in browser environment
    if (typeof window === 'undefined') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && activeTab > 0) {
        setActiveTab(activeTab - 1);
      } else if (e.key === "ArrowRight" && activeTab < TABS.length - 1) {
        setActiveTab(activeTab + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <div className="space-y-4">
            <IncomeExpenseTrend data={trendData} />
            <SavingsTrend data={savingsData} />
          </div>
        );
      case 1:
        return (
          <ChartBar data={trendData} title="Income vs. Expenses by Month" />
        );
      case 2:
        return (
          <ChartPie
            data={pieChartData}
            title="Expense Breakdown"
            total={formatCurrency(totalExpenses)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-muted p-1 rounded-lg">
          {TABS.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === index
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Swipeable Content */}
      <div
        ref={containerRef}
        className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
        style={{
          touchAction: "pan-y pinch-zoom", // Allow vertical scrolling and zoom
        }}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${activeTab * 100}%)`,
            width: `${TABS.length * 100}%`,
          }}
        >
          {TABS.map((_, index) => (
            <div key={index} className="w-full flex-shrink-0 px-2">
              {index === activeTab && renderTabContent()}
            </div>
          ))}
        </div>
      </div>

      {/* Tab Indicators */}
      <div className="flex justify-center gap-2">
        {TABS.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              activeTab === index
                ? "bg-primary"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}