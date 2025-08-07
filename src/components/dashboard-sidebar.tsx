"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import type { Epic, FilterState } from "@/types";

interface DashboardSidebarProps {
  epics: Epic[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function DashboardSidebar({ epics, filters, onFiltersChange, isCollapsed, onToggleCollapse }: DashboardSidebarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const { theme, setTheme } = useTheme();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusFilter = (status: FilterState['status']) => {
    onFiltersChange({ ...filters, status });
  };

  const handleEpicFilter = (epic: string | null) => {
    onFiltersChange({ ...filters, epic });
  };

  const totalTests = epics.reduce((sum, epic) => sum + epic.total, 0);
  const passedTests = epics.reduce((sum, epic) => sum + epic.passed, 0);
  const failedTests = 0; // You can calculate this from actual test data
  const notRunTests = totalTests - passedTests - failedTests;

  if (isCollapsed) {
    return (
      <div className="w-16 h-screen bg-card border-r border-border p-2 flex flex-col items-center overflow-y-auto">
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Separator className="mb-4" />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="mb-4"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>

        <Separator className="mb-4" />

        {/* Status Indicators */}
        <div className="space-y-2 w-full flex flex-col items-center">
          <Button
            variant={filters.status === 'all' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handleStatusFilter('all')}
            title="Total"
          >
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          </Button>
          
          <Button
            variant={filters.status === 'passed' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handleStatusFilter('passed')}
            title="Passed"
          >
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </Button>
          
          <Button
            variant={filters.status === 'failed' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handleStatusFilter('failed')}
            title="Failed"
          >
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
          </Button>
          
          <Button
            variant={filters.status === 'not-run' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handleStatusFilter('not-run')}
            title="Not Run"
          >
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 h-screen bg-card border-r border-border p-4 overflow-y-auto">
      {/* Header with Controls */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
          
          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search test cases..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">FILTERS</h2>
        <div className="space-y-2">
          <Button
            variant={filters.status === 'all' ? 'default' : 'ghost'}
            className="w-full justify-between"
            onClick={() => handleStatusFilter('all')}
          >
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              Total
            </span>
            <Badge variant="secondary">{totalTests}</Badge>
          </Button>
          
          <Button
            variant={filters.status === 'passed' ? 'default' : 'ghost'}
            className="w-full justify-between"
            onClick={() => handleStatusFilter('passed')}
          >
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              Passed
            </span>
            <Badge variant="secondary">{passedTests}</Badge>
          </Button>
          
          <Button
            variant={filters.status === 'failed' ? 'default' : 'ghost'}
            className="w-full justify-between"
            onClick={() => handleStatusFilter('failed')}
          >
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              Failed
            </span>
            <Badge variant="secondary">{failedTests}</Badge>
          </Button>
          
          <Button
            variant={filters.status === 'not-run' ? 'default' : 'ghost'}
            className="w-full justify-between"
            onClick={() => handleStatusFilter('not-run')}
          >
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              Not Run
            </span>
            <Badge variant="secondary">{notRunTests}</Badge>
          </Button>
        </div>
      </div>

      {/* Epics */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">EPICS</h2>
        <div className="space-y-2">
          <Button
            variant={filters.epic === null ? 'default' : 'ghost'}
            className="w-full justify-between"
            onClick={() => handleEpicFilter(null)}
          >
            All Epics
            <Badge variant="secondary">{totalTests}</Badge>
          </Button>
          
          {epics.map((epic) => (
            <Button
              key={epic.id}
              variant={filters.epic === epic.id ? 'default' : 'ghost'}
              className="w-full justify-between"
              onClick={() => handleEpicFilter(epic.id)}
            >
              <span className="truncate">{epic.name}</span>
              <Badge variant="secondary">{epic.total}</Badge>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}